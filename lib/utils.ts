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
