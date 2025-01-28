import {
  assertPositive,
  assertPositiveInteger,
} from "@/lib/distributions/validation"

/**
 * Generates a pair of independent standard normal random variables using the Box–Muller transform.
 * The transform converts uniform random variables to normally distributed ones by using
 * polar coordinates and the inverse transform sampling method.
 *
 * @returns A tuple [z1, z2] where both z1 and z2 are independent N(0,1) random variables
 * @see https://en.wikipedia.org/wiki/Box-Muller_transform
 */
const generateBoxMullerPair = (): [number, number] => {
  const u1 = Math.random()
  const u2 = Math.random()

  const radius = Math.sqrt(-2 * Math.log(u1))
  const theta = 2 * Math.PI * u2

  const z1 = radius * Math.cos(theta)
  const z2 = radius * Math.sin(theta)

  return [z1, z2]
}

/**
 * Generates random samples from a normal (Gaussian) distribution.
 *
 * Uses the Box-Muller transform to generate pairs of independent standard normal
 * random variables, which are then scaled and shifted to match the desired
 * mean and standard deviation.
 *
 * @param n Number of samples to generate (must be positive)
 * @param mean Mean (μ) of the normal distribution (default: 0)
 * @param sd Standard deviation (σ) of the normal distribution (default: 1, must be positive integer)
 * @returns Array of n independent samples from N(mean, sd²)
 * @throws Will throw an error if n is not positive or if sd is not a positive integer
 *
 * @example
 * // Generate 1000 samples from N(0,1)
 * const standardNormal = rnorm(1000)
 *
 * @example
 * // Generate 500 samples from N(10,4), where 4 is the variance (sd²=4, so sd=2)
 * const samples = rnorm(500, 10, 2)
 */
export function rnorm(n: number, mean: number = 0, sd: number = 1): number[] {
  // Input validation
  assertPositiveInteger(n)
  assertPositive(sd)

  // Pre-allocate array and calculate number of complete pairs
  const samples = new Array(n)
  const pairs = Math.floor(n / 2)
  let index = 0

  // Generate pairs of normal random variables
  for (let i = 0; i < pairs; i++) {
    const [z1, z2] = generateBoxMullerPair()
    samples[index++] = mean + sd * z1
    samples[index++] = mean + sd * z2
  }

  // Handle odd n by generating one extra sample
  if (n % 2 === 1) {
    const [z1] = generateBoxMullerPair()
    samples[index] = mean + sd * z1
  }

  return samples
}
