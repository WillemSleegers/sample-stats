import { rnorm } from "@/lib/distributions/rnorm"

/**
 * Generates n random samples from a log-normal distribution
 * @param n Number of samples to generate
 * @param meanlog Mean of the normal distribution on the log scale
 * @param sdlog Standard deviation of the normal distribution on the log scale
 * @returns Array of n samples from the specified log-normal distribution
 */
export function rlnorm(
  n: number,
  meanlog: number = 0,
  sdlog: number = 1
): number[] {
  // Input validation
  if (n <= 0 || !Number.isInteger(n)) {
    throw new Error("Number of samples must be a positive integer")
  }
  if (sdlog <= 0) {
    throw new Error("Standard deviation must be positive")
  }

  // First generate normal samples
  const normalSamples = rnorm(n, meanlog, sdlog)

  // Transform to log-normal by exponentiating
  return normalSamples.map((x) => Math.exp(x))
}
