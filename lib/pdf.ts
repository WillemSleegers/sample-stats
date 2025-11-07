import { WebR, type RObject } from "webr"
import {
  Parameters,
  ParamsMetalog,
} from "./types"

/**
 * Calculate PDF values using webR's density functions
 * For most distributions, we use R's built-in dnorm, dunif, dlnorm, dbeta
 * For Metalog, we use the custom implementation
 */
export async function calculatePdfValues(
  webR: WebR,
  xValues: number[],
  params: Parameters
): Promise<number[]> {
  switch (params.type) {
    case "normal": {
      // Use R's dnorm function
      const xVector = `c(${xValues.join(",")})`
      const result = (await webR.evalR(
        `dnorm(${xVector}, mean = ${params.mean}, sd = ${params.sd})`
      )) as RObject & { toArray: () => Promise<unknown[]> }
      try {
        return (await result.toArray()) as number[]
      } finally {
        await webR.destroy(result)
      }
    }

    case "lognormal": {
      const xVector = `c(${xValues.join(",")})`
      const result = (await webR.evalR(
        `dlnorm(${xVector}, meanlog = ${params.meanlog}, sdlog = ${params.sdlog})`
      )) as RObject & { toArray: () => Promise<unknown[]> }
      try {
        return (await result.toArray()) as number[]
      } finally {
        await webR.destroy(result)
      }
    }

    case "uniform": {
      const xVector = `c(${xValues.join(",")})`
      const result = (await webR.evalR(
        `dunif(${xVector}, min = ${params.min}, max = ${params.max})`
      )) as RObject & { toArray: () => Promise<unknown[]> }
      try {
        return (await result.toArray()) as number[]
      } finally {
        await webR.destroy(result)
      }
    }

    case "beta": {
      const xVector = `c(${xValues.join(",")})`
      const result = (await webR.evalR(
        `dbeta(${xVector}, shape1 = ${params.alpha}, shape2 = ${params.beta})`
      )) as RObject & { toArray: () => Promise<unknown[]> }
      try {
        return (await result.toArray()) as number[]
      } finally {
        await webR.destroy(result)
      }
    }

    case "pert": {
      // PERT uses beta distribution with transformed parameters
      const { min, mode, max } = params
      const range = max - min
      const modeNorm = (mode - min) / range
      const alpha = 1 + 4 * modeNorm
      const beta = 1 + 4 * (1 - modeNorm)

      // Transform x values to [0,1] range for beta distribution
      const xNorm = xValues.map((x) => (x - min) / range)
      const xVector = `c(${xNorm.join(",")})`

      const result = (await webR.evalR(
        `dbeta(${xVector}, shape1 = ${alpha}, shape2 = ${beta}) / ${range}`
      )) as RObject & { toArray: () => Promise<unknown[]> }
      try {
        return (await result.toArray()) as number[]
      } finally {
        await webR.destroy(result)
      }
    }

    case "metalog": {
      // Metalog uses custom implementation (no native R function)
      return xValues.map((x) => metalogPdf(x, params))
    }
  }
}

// Metalog distribution quantile function (custom implementation)
function metalogQuantile(p: number, params: ParamsMetalog): number {
  const { p10, p50, p90, lower, upper } = params

  const quantilePairs = [
    { p: 0.1, x: p10 },
    { p: 0.5, x: p50 },
    { p: 0.9, x: p90 },
  ]

  const sortedPairs = [...quantilePairs].sort((a, b) => a.p - b.p)

  let boundedness: "u" | "sl" | "su" | "b" = "u"
  let lowerBound = -Infinity
  let upperBound = Infinity

  if (lower !== undefined && upper !== undefined) {
    boundedness = "b"
    lowerBound = lower
    upperBound = upper
  } else if (lower !== undefined) {
    boundedness = "sl"
    lowerBound = lower
  } else if (upper !== undefined) {
    boundedness = "su"
    upperBound = upper
  }

  const Y = sortedPairs.map((pair) => {
    const prob = pair.p
    const logit = Math.log(prob / (1 - prob))
    return [1, logit, (prob - 0.5) * logit]
  })

  const z = sortedPairs.map((pair) => {
    const x = pair.x
    switch (boundedness) {
      case "sl":
        return Math.log(x - lowerBound)
      case "su":
        return -Math.log(upperBound - x)
      case "b":
        return Math.log((x - lowerBound) / (upperBound - x))
      default:
        return x
    }
  })

  const det = (m: number[][]) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])

  const detA = det(Y)
  const a = new Array(3).fill(0).map((_, i) => {
    const Yi = Y.map((row, j) => row.map((val, k) => (k === i ? z[j] : val)))
    return det(Yi) / detA
  })

  const logit = Math.log(p / (1 - p))
  const y2 = logit
  const y3 = (p - 0.5) * logit

  const s = a[0] + a[1] * y2 + a[2] * y3

  switch (boundedness) {
    case "sl":
      return lowerBound + Math.exp(s)
    case "su":
      return upperBound - Math.exp(-s)
    case "b":
      return (lowerBound + upperBound * Math.exp(s)) / (1 + Math.exp(s))
    default:
      return s
  }
}

// Metalog distribution PDF using numerical differentiation
function metalogPdf(x: number, params: ParamsMetalog): number {
  const { lower, upper } = params

  if (lower !== undefined && x <= lower) return 0
  if (upper !== undefined && x >= upper) return 0

  // Use numerical differentiation to find PDF from quantile function
  // PDF(x) = 1 / (d/dp Q(p)) where Q(p) is the quantile function

  // Find p such that Q(p) ≈ x using binary search
  let pLow = 0.001
  let pHigh = 0.999
  let p = 0.5
  const tolerance = 1e-6
  const maxIterations = 50

  for (let i = 0; i < maxIterations; i++) {
    const qp = metalogQuantile(p, params)
    if (Math.abs(qp - x) < tolerance) break

    if (qp < x) {
      pLow = p
    } else {
      pHigh = p
    }
    p = (pLow + pHigh) / 2
  }

  // Compute the derivative dQ/dp using numerical differentiation
  const h = 0.001
  const pPlus = Math.min(0.999, p + h)
  const pMinus = Math.max(0.001, p - h)

  const qPlus = metalogQuantile(pPlus, params)
  const qMinus = metalogQuantile(pMinus, params)

  const dQdp = (qPlus - qMinus) / (pPlus - pMinus)

  return dQdp > 0 ? 1 / dQdp : 0
}
