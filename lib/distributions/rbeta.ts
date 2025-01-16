/**
 * Generates n random samples from a Beta distribution
 * @param n Number of samples to generate
 * @param alpha First shape parameter of the Beta distribution (must be positive)
 * @param beta Second shape parameter of the Beta distribution (must be positive)
 * @returns Array of n samples from the specified Beta distribution
 */
export function rbeta(n: number, alpha: number, beta: number): number[] {
  // Input validation
  if (n <= 0 || !Number.isInteger(n)) {
    throw new Error("Number of samples must be a positive integer")
  }
  if (alpha <= 0 || beta <= 0) {
    throw new Error("Shape parameters must be positive")
  }

  // Sample from Beta distribution using acceptance-rejection method
  function sampleBeta(alpha: number, beta: number): number {
    while (true) {
      const u1 = Math.random()
      const u2 = Math.random()

      const y1 = Math.pow(u1, 1 / alpha)
      const y2 = Math.pow(u2, 1 / beta)

      if (y1 + y2 <= 1) {
        return y1 / (y1 + y2)
      }
    }
  }

  return Array.from({ length: n }, () => sampleBeta(alpha, beta))
}
