export const SPEED_SETTINGS = {
  slow: { interval: 1000, n: 1 },
  normal: { interval: 250, n: 1 },
  fast: { interval: 50, n: 2 },
  faster: { interval: 25, n: 4 },
}

export type SpeedSetting = keyof typeof SPEED_SETTINGS
