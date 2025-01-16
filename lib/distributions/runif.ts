/**
 * Generates n random samples from a uniform distribution
 * @param n Number of samples to generate
 * @param min Minimum value of the uniform distribution (inclusive)
 * @param max Maximum value of the uniform distribution (exclusive)
 * @returns Array of n samples from the specified uniform distribution
 */
export function runif(n: number, min: number = 0, max: number = 1): number[] {
  // Input validation
  if (n <= 0 || !Number.isInteger(n)) {
    throw new Error("Number of samples must be a positive integer")
  }
  if (min >= max) {
    throw new Error("Minimum value must be less than maximum value")
  }

  // Generate samples
  return Array.from({ length: n }, () => min + Math.random() * (max - min))
}
