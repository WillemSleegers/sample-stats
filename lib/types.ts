export type Distribution =
  | "normal"
  | "uniform"
  | "lognormal"
  | "pert"
  | "beta"
  | "metalog"

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
  | {
      distribution: "metalog"
      p10: number
      p50: number
      p90: number
      lower?: number
      upper?: number
    }
