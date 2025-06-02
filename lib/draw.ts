import { rnorm } from "@/lib/distributions/rnorm"
import { runif } from "@/lib/distributions/runif"
import { rlnorm } from "@/lib/distributions/rlnorm"
import { rpert } from "@/lib/distributions/rpert"
import { rbeta } from "@/lib/distributions/rbeta"
import { rmetalog } from "./distributions/rmetalog"

import {
  Distribution,
  Parameters,
  ParamsBeta,
  ParamsLognormal,
  ParamsMetalog,
  ParamsNormal,
  ParamsPert,
  ParamsUniform,
} from "@/lib/types"

export const draw = (
  n: number,
  distribution: Distribution,
  params: Parameters
): number[] => {
  switch (distribution) {
    case "normal": {
      const p = params as ParamsNormal
      return rnorm(n, p.mean, p.sd)
    }
    case "lognormal": {
      const p = params as ParamsLognormal
      return rlnorm(n, p.meanlog, p.sdlog)
    }
    case "uniform": {
      const p = params as ParamsUniform
      return runif(n, p.min, p.max)
    }
    case "beta": {
      const p = params as ParamsBeta
      return rbeta(n, p.alpha, p.beta)
    }
    case "pert": {
      const p = params as ParamsPert
      return rpert(n, p.min, p.mode, p.max)
    }

    case "metalog": {
      const p = params as ParamsMetalog
      return rmetalog(
        n,
        [
          { p: 0.1, x: p.p10 },
          { p: 0.5, x: p.p50 },
          { p: 0.9, x: p.p90 },
        ],
        { lower: p.lower, upper: p.upper }
      )
    }
    default:
      throw new Error(`Unknown distribution: ${distribution}`)
  }
}
