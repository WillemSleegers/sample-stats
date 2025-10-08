import { rnorm } from "@/lib/distributions/rnorm"
import { runif } from "@/lib/distributions/runif"
import { rlnorm } from "@/lib/distributions/rlnorm"
import { rpert } from "@/lib/distributions/rpert"
import { rbeta } from "@/lib/distributions/rbeta"
import { rmetalog } from "./distributions/rmetalog"

import { Parameters } from "@/lib/types"

export const draw = (n: number, params: Parameters): number[] => {
  switch (params.type) {
    case "normal":
      return rnorm(n, params.mean, params.sd)
    case "lognormal":
      return rlnorm(n, params.meanlog, params.sdlog)
    case "uniform":
      return runif(n, params.min, params.max)
    case "beta":
      return rbeta(n, params.alpha, params.beta)
    case "pert":
      return rpert(n, params.min, params.mode, params.max)
    case "metalog":
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
