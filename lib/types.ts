import { SPEED_SETTINGS } from "@/lib/constants"

export type Distribution =
  | "normal"
  | "uniform"
  | "lognormal"
  | "pert"
  | "beta"
  | "metalog"

export type ParamsNormal = {
  mean: number
  sd: number
}

export type ParamsLognormal = {
  meanlog: number
  sdlog: number
}
export type ParamsUniform = {
  min: number
  max: number
}
export type ParamsBeta = {
  alpha: number
  beta: number
}
export type ParamsPert = {
  min: number
  mode: number
  max: number
}
export type ParamsMetalog = {
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
}

export type SpeedSetting = keyof typeof SPEED_SETTINGS
