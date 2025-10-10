import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const sum = (x: number[]): number => {
  return x.reduce((a, b) => a + b)
}

export const mean = (x: number[]): number => {
  return x.reduce((a, b) => a + b) / x.length
}

export const min = (x: number[]): number => {
  return Math.min(...x)
}

export const max = (x: number[]): number => {
  return Math.max(...x)
}

export const quantile = (
  x: number[],
  probs: number[],
  method: "nearest" | "linear" = "nearest"
): number[] => {
  const sorted = [...x].sort((a, b) => a - b)
  const n = sorted.length

  return probs.map((q) => {
    const position = q * (n - 1)
    const lowerIndex = Math.floor(position)
    const upperIndex = Math.ceil(position)

    if (lowerIndex === upperIndex) {
      return sorted[lowerIndex]
    }

    if (method === "nearest") {
      return sorted[Math.round(position)]
    } else {
      const fraction = position - lowerIndex
      const lowerValue = sorted[lowerIndex]
      const upperValue = sorted[upperIndex]
      return lowerValue + (upperValue - lowerValue) * fraction
    }
  })
}

// Optimized single-pass statistics calculation
// Assumes x.length > 0 (caller should check before calling)
export const calculateAllStats = (x: number[]) => {
  // First pass for min, max, and sum
  let minVal = x[0]
  let maxVal = x[0]
  let sum = 0

  for (let i = 0; i < x.length; i++) {
    const val = x[i]
    sum += val
    if (val < minVal) minVal = val
    if (val > maxVal) maxVal = val
  }

  const meanVal = sum / x.length

  // Second pass for variance calculation
  let sumSquaredDiffs = 0
  for (let i = 0; i < x.length; i++) {
    const diff = x[i] - meanVal
    sumSquaredDiffs += diff * diff
  }

  const variance = sumSquaredDiffs / x.length
  const stdDev = Math.sqrt(variance)

  // Calculate quantiles (still requires sorting, but only once)
  const quantiles = quantile(x, [0.1, 0.5, 0.9], "linear")

  return {
    min: minVal,
    max: maxVal,
    mean: meanVal,
    variance: variance,
    stdDev: stdDev,
    p10: quantiles[0],
    p50: quantiles[1],
    p90: quantiles[2],
  }
}

