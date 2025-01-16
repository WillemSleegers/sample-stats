import { rnorm } from "@/lib/distributions/rnorm"
import { runif } from "@/lib/distributions/runif"
import { rlnorm } from "@/lib/distributions/rlnorm"
import { rpert } from "@/lib/distributions/rpert"
import { rbeta } from "@/lib/distributions/rbeta"

type NormalParams = {
  distribution: "normal"
  mean: number
  sd: number
}

type LogNormalParams = {
  distribution: "lognormal"
  meanlog: number
  sdlog: number
}

type UniformParams = {
  distribution: "uniform"
  min: number
  max: number
}

type PERTParams = {
  distribution: "pert"
  min: number
  likely: number
  max: number
}

type BetaParams = {
  distribution: "beta"
  alpha: number
  beta: number
}

type Params =
  | NormalParams
  | LogNormalParams
  | UniformParams
  | PERTParams
  | BetaParams

export const draw = (n: number, params: Params): number[] => {
  switch (params.distribution) {
    case "normal":
      return rnorm(n, params.mean, params.sd)
    case "uniform":
      return runif(n, params.min, params.max)
    case "lognormal":
      return rlnorm(n, params.meanlog, params.sdlog)
    case "pert":
      return rpert(n, params.min, params.likely, params.max)
    case "beta":
      return rbeta(n, params.alpha, params.beta)
  }
}
