/**
 * Generates n random samples from a normal distribution
 * Uses the Box-Muller transform to convert uniform random numbers to normal distribution
 * @param n Number of samples to generate
 * @param mean Mean of the normal distribution
 * @param sd Standard deviation of the normal distribution
 * @returns Array of n samples from the specified normal distribution
 */
export function rnorm(n: number, mean: number = 0, sd: number = 1): number[] {
  // Input validation
  if (n <= 0 || !Number.isInteger(n)) {
    throw new Error("Number of samples must be a positive integer")
  }
  if (sd <= 0) {
    throw new Error("Standard deviation must be positive")
  }

  const samples: number[] = []

  // Box-Muller transform
  const generatePair = (): [number, number] => {
    const u1 = Math.random()
    const u2 = Math.random()

    const radius = Math.sqrt(-2 * Math.log(u1))
    const theta = 2 * Math.PI * u2

    const z1 = radius * Math.cos(theta)
    const z2 = radius * Math.sin(theta)

    return [z1, z2]
  }

  // Generate samples
  for (let i = 0; i < n; i += 2) {
    const [z1, z2] = generatePair()
    samples.push(mean + sd * z1)

    // Only add second sample if we still need more numbers
    if (i + 1 < n) {
      samples.push(mean + sd * z2)
    }
  }

  return samples
}
