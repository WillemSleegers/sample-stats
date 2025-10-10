import { SPEED_SETTINGS } from "@/lib/constants"

export type Distribution =
  | "normal"
  | "uniform"
  | "lognormal"
  | "pert"
  | "beta"
  | "metalog"

export type ParamsNormal = {
  type: "normal"
  mean: number
  sd: number
}

export type ParamsLognormal = {
  type: "lognormal"
  meanlog: number
  sdlog: number
}
export type ParamsUniform = {
  type: "uniform"
  min: number
  max: number
}
export type ParamsBeta = {
  type: "beta"
  alpha: number
  beta: number
}
export type ParamsPert = {
  type: "pert"
  min: number
  mode: number
  max: number
}
export type ParamsMetalog = {
  type: "metalog"
  p10: number
  p50: number
  p90: number
  lower?: number
  upper?: number
}

export type Parameters =
  | ParamsNormal
  | ParamsLognormal
  | ParamsUniform
  | ParamsBeta
  | ParamsPert
  | ParamsMetalog

export type Stats = {
  p10?: number
  p50?: number
  p90?: number
  min?: number
  max?: number
  mean?: number
  variance?: number
  stdDev?: number
}

export type SpeedSetting = keyof typeof SPEED_SETTINGS
