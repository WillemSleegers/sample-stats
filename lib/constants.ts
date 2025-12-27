export const SPEED_SETTINGS = {
  slow: { interval: 1000, n: 1, animationDuration: 1000 },
  normal: { interval: 500, n: 1, animationDuration: 500 },
  fast: { interval: 100, n: 1, animationDuration: 100 },
  fastest: { interval: 50, n: 1, animationDuration: 0 },
}

export const MAX_SAMPLES = 100 // Maximum number of samples to keep in memory

export const DEFAULT_PARAMETERS = {
  normal: { type: "normal" as const, mean: 0, sd: 1 },
  lognormal: { type: "lognormal" as const, meanlog: 0, sdlog: 1 },
  uniform: { type: "uniform" as const, min: 0, max: 1 },
  beta: { type: "beta" as const, alpha: 1, beta: 1 },
  pert: { type: "pert" as const, min: 1, mode: 2, max: 3 },
  metalog: { type: "metalog" as const, p10: 1, p50: 2, p90: 3 },
}
