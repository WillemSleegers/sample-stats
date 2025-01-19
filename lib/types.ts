import { SPEED_SETTINGS } from "@/lib/constants"

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

export type Stats = {
  p10?: number
  p50?: number
  p90?: number
  min?: number
  max?: number
  mean?: number
}

export type SpeedSetting = keyof typeof SPEED_SETTINGS
