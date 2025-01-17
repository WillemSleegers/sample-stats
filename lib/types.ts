export type Distribution = "normal" | "uniform" | "lognormal" | "pert" | "beta"

export type Parameters =
  | {
      distribution: "normal"
      mean: number
      sd: number
    }
  | {
      distribution: "lognormal"
      meanlog: number
      sdlog: number
    }
  | {
      distribution: "uniform"
      min: number
      max: number
    }
  | {
      distribution: "beta"
      alpha: number
      beta: number
    }
  | {
      distribution: "pert"
      min: number
      mode: number
      max: number
    }
