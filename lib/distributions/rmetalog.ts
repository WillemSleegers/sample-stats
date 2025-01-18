/**
 * Samples draws from a metalog distribution specified by quantile pairs
 * @param n Number of samples to draw
 * @param quantilePairs Three quantile pairs (e.g., p: 0.1, x: 10)
 * @param bounds Lower or upper bounds
 * @returns Array of n samples from the specified metalog distribution
 */
export function rmetalog(
  n: number = 1,
  quantilePairs: { p: number; x: number }[],
  bounds: { lower?: number; upper?: number }
): number[] {
  // Validate inputs
  if (quantilePairs.length !== 3) {
    throw new Error("Exactly three quantile pairs are required")
  }

  if (!quantilePairs.every((pair) => pair.p >= 0 && pair.p <= 1)) {
    throw new Error("All probabilities must be between 0 and 1")
  }

  // Sort quantile pairs by probability
  const sortedPairs = [...quantilePairs].sort((a, b) => a.p - b.p)

  // Determine boundedness and transform variables
  let boundedness: "u" | "sl" | "su" | "b" = "u"
  let lowerBound = -Infinity
  let upperBound = Infinity

  if (bounds) {
    if (bounds.lower !== undefined && bounds.upper !== undefined) {
      boundedness = "b"
      lowerBound = bounds.lower
      upperBound = bounds.upper
    } else if (bounds.lower !== undefined) {
      boundedness = "sl"
      lowerBound = bounds.lower
    } else if (bounds.upper !== undefined) {
      boundedness = "su"
      upperBound = bounds.upper
    }
  }

  // Build Y matrix for the quantile pairs
  const Y = sortedPairs.map((pair) => {
    const p = pair.p
    const logit = Math.log(p / (1 - p))
    return [1, logit, (p - 0.5) * logit]
  })

  // Transform x values based on boundedness
  const z = sortedPairs.map((pair) => {
    const x = pair.x
    switch (boundedness) {
      case "sl":
        return Math.log(x - lowerBound)
      case "su":
        return -Math.log(upperBound - x)
      case "b":
        return Math.log((x - lowerBound) / (upperBound - x))
      default:
        return x
    }
  })

  // Solve for parameters using linear algebra
  // Using simple matrix operations for 3x3 system
  const det = (m: number[][]) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])

  const detA = det(Y)
  const a = new Array(3).fill(0).map((_, i) => {
    const Yi = Y.map((row, j) => row.map((val, k) => (k === i ? z[j] : val)))
    return det(Yi) / detA
  })

  // Generate samples
  return Array.from({ length: n }, () => {
    const u = Math.random()
    const logit = Math.log(u / (1 - u))
    const y2 = logit
    const y3 = (u - 0.5) * logit

    const s = a[0] + a[1] * y2 + a[2] * y3

    // Transform back based on boundedness
    switch (boundedness) {
      case "sl":
        return lowerBound + Math.exp(s)
      case "su":
        return upperBound - Math.exp(-s)
      case "b":
        return (lowerBound + upperBound * Math.exp(s)) / (1 + Math.exp(s))
      default:
        return s
    }
  })
}
