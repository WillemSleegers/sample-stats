import { rbeta } from "@/lib/distributions/rbeta"

/**
 * Generates n random samples from a PERT (Project Evaluation and Review Technique) distribution
 * The PERT distribution is a special case of the Beta distribution, shaped by minimum, most likely, and maximum values
 *
 * @param n Number of samples to generate
 * @param min Minimum (optimistic) value
 * @param likely Most likely (modal) value
 * @param max Maximum (pessimistic) value
 * @returns Array of n samples from the specified PERT distribution
 */
export function rpert(
  n: number,
  min: number,
  likely: number,
  max: number
): number[] {
  // Input validation
  if (n <= 0 || !Number.isInteger(n)) {
    throw new Error("Number of samples must be a positive integer")
  }
  if (min > likely || likely > max) {
    throw new Error("Values must satisfy: min <= likely <= max")
  }

  // Calculate PERT Beta distribution parameters
  const lambda = 4 // Default shape parameter
  const mu = (min + lambda * likely + max) / (lambda + 2)
  const alpha1 =
    ((mu - min) * (2 * likely - min - max)) / ((likely - mu) * (max - min))
  const alpha2 = (alpha1 * (max - mu)) / (mu - min)

  // Generate samples using the Beta distribution
  const betaSamples = rbeta(n, alpha1, alpha2)

  // Transform from Beta to PERT scale
  return betaSamples.map((x) => min + (max - min) * x)
}
