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
  const n = x.length

  // First pass for min, max, and sum
  let minVal = x[0]
  let maxVal = x[0]
  let sum = 0

  for (let i = 0; i < n; i++) {
    const val = x[i]
    sum += val
    if (val < minVal) minVal = val
    if (val > maxVal) maxVal = val
  }

  const meanVal = sum / n

  // Second pass for variance, skewness, and kurtosis
  let sumSquaredDiffs = 0
  let sumCubedDiffs = 0
  let sumQuartedDiffs = 0

  for (let i = 0; i < n; i++) {
    const diff = x[i] - meanVal
    const diffSquared = diff * diff
    sumSquaredDiffs += diffSquared
    sumCubedDiffs += diffSquared * diff
    sumQuartedDiffs += diffSquared * diffSquared
  }

  const variance = sumSquaredDiffs / n
  const stdDev = Math.sqrt(variance)

  // Skewness (using sample skewness formula)
  const skewness = stdDev === 0 ? 0 : (sumCubedDiffs / n) / Math.pow(stdDev, 3)

  // Excess kurtosis (using sample kurtosis formula, subtracting 3 for excess)
  const kurtosis = stdDev === 0 ? 0 : (sumQuartedDiffs / n) / Math.pow(variance, 2) - 3

  // Calculate mode (most frequent value using binning for continuous data)
  const mode = calculateMode(x)

  // Calculate quantiles (still requires sorting, but only once)
  const quantiles = quantile(x, [0.1, 0.5, 0.9], "linear")

  return {
    min: minVal,
    max: maxVal,
    mean: meanVal,
    variance: variance,
    stdDev: stdDev,
    skewness: skewness,
    kurtosis: kurtosis,
    mode: mode,
    p10: quantiles[0],
    p50: quantiles[1],
    p90: quantiles[2],
  }
}

// Calculate mode for continuous data using histogram binning
const calculateMode = (x: number[]): number => {
  if (x.length === 0) return 0

  // Use Sturges' rule for number of bins
  const binCount = Math.ceil(Math.log2(x.length) + 1)
  const minVal = Math.min(...x)
  const maxVal = Math.max(...x)
  const range = maxVal - minVal

  if (range === 0) return minVal

  const binWidth = range / binCount
  const bins = new Array(binCount).fill(0)

  // Count frequencies in each bin
  for (let i = 0; i < x.length; i++) {
    const binIndex = Math.min(Math.floor((x[i] - minVal) / binWidth), binCount - 1)
    bins[binIndex]++
  }

  // Find bin with highest frequency
  let maxFreq = 0
  let modeBinIndex = 0
  for (let i = 0; i < binCount; i++) {
    if (bins[i] > maxFreq) {
      maxFreq = bins[i]
      modeBinIndex = i
    }
  }

  // Return midpoint of the modal bin
  return minVal + (modeBinIndex + 0.5) * binWidth
}

