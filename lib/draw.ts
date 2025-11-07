import { WebR, type RObject } from "webr"
import { Parameters } from "@/lib/types"
import { rmetalog } from "./distributions/rmetalog"

/**
 * Draw samples from a distribution using webR
 * For most distributions, we use R's built-in functions
 * For Metalog, we still use the custom implementation
 */
export const draw = async (
  webR: WebR,
  n: number,
  params: Parameters
): Promise<number[]> => {
  switch (params.type) {
    case "normal": {
      const result = (await webR.evalR(
        `rnorm(${n}, mean = ${params.mean}, sd = ${params.sd})`
      )) as RObject & { toArray: () => Promise<unknown[]> }
      try {
        return (await result.toArray()) as number[]
      } finally {
        await webR.destroy(result)
      }
    }

    case "lognormal": {
      const result = (await webR.evalR(
        `rlnorm(${n}, meanlog = ${params.meanlog}, sdlog = ${params.sdlog})`
      )) as RObject & { toArray: () => Promise<unknown[]> }
      try {
        return (await result.toArray()) as number[]
      } finally {
        await webR.destroy(result)
      }
    }

    case "uniform": {
      const result = (await webR.evalR(
        `runif(${n}, min = ${params.min}, max = ${params.max})`
      )) as RObject & { toArray: () => Promise<unknown[]> }
      try {
        return (await result.toArray()) as number[]
      } finally {
        await webR.destroy(result)
      }
    }

    case "beta": {
      const result = (await webR.evalR(
        `rbeta(${n}, shape1 = ${params.alpha}, shape2 = ${params.beta})`
      )) as RObject & { toArray: () => Promise<unknown[]> }
      try {
        return (await result.toArray()) as number[]
      } finally {
        await webR.destroy(result)
      }
    }

    case "pert": {
      // PERT distribution using R's beta distribution with transformed parameters
      const { min, mode, max } = params
      const range = max - min
      const modeNorm = (mode - min) / range
      const alpha = 1 + 4 * modeNorm
      const beta = 1 + 4 * (1 - modeNorm)

      const result = (await webR.evalR(
        `${min} + ${range} * rbeta(${n}, shape1 = ${alpha}, shape2 = ${beta})`
      )) as RObject & { toArray: () => Promise<unknown[]> }
      try {
        return (await result.toArray()) as number[]
      } finally {
        await webR.destroy(result)
      }
    }

    case "metalog": {
      // Metalog doesn't have a native R implementation, use custom one
      return rmetalog(
        n,
        [
          { p: 0.1, x: params.p10 },
          { p: 0.5, x: params.p50 },
          { p: 0.9, x: params.p90 },
        ],
        { lower: params.lower, upper: params.upper }
      )
    }
  }
}
