import { rnorm } from "@/lib/distributions/rnorm"
import { runif } from "@/lib/distributions/runif"
import { rlnorm } from "@/lib/distributions/rlnorm"
import { rpert } from "@/lib/distributions/rpert"
import { rbeta } from "@/lib/distributions/rbeta"

import { Parameters } from "@/lib/types"

export const draw = (n: number, params: Parameters): number[] => {
  switch (params.distribution) {
    case "normal":
      return rnorm(n, params.mean, params.sd)
    case "uniform":
      return runif(n, params.min, params.max)
    case "lognormal":
      return rlnorm(n, params.meanlog, params.sdlog)
    case "pert":
      return rpert(n, params.min, params.mode, params.max)
    case "beta":
      return rbeta(n, params.alpha, params.beta)
  }
}
