export type Distribution = "normal" | "uniform" | "lognormal" | "pert" | "beta"

export interface Params {
  normal: {
    mean?: number
    sd?: number
  }
  uniform: {
    min?: number
    max?: number
  }
  lognormal: {
    meanlog?: number
    sdlog?: number
  }
  pert: {
    min?: number
    likely?: number
    max?: number
  }
  beta: {
    alpha?: number
    beta?: number
  }
}

// Define all parameter types first
export type DistributionParams = {
  normal: {
    mean?: number
    sd?: number
  }
  uniform: {
    min?: number
    max?: number
  }
  lognormal: {
    meanlog?: number
    sdlog?: number
  }
  pert: {
    min: number
    likely: number
    max: number
  }
  beta: {
    alpha: number
    beta: number
  }
}

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
