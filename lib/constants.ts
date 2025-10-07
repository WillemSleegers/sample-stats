export const SPEED_SETTINGS = {
  slow: { interval: 1000, n: 1, animationDuration: 1000 },
  normal: { interval: 250, n: 1, animationDuration: 500 },
  fast: { interval: 100, n: 1, animationDuration: 100 },
  fastest: { interval: 50, n: 1, animationDuration: 0 },
}

export const DEFAULT_PARAMETERS = {
  normal: { mean: 0, sd: 1 },
  lognormal: { meanlog: 0, sdlog: 1 },
  uniform: { min: 0, max: 1 },
  beta: { alpha: 1, beta: 1 },
  pert: { min: 1, mode: 2, max: 3 },
  metalog: { p10: 1, p50: 2, p90: 3 },
}
