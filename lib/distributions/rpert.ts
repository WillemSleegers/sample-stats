/**
 * Generates a random draw from a Gamma(alpha, 1) distribution
 * Uses Marsaglia and Tsang's method
 */
function gammaRandom(alpha: number): number {
  if (alpha < 1) {
    // For alpha < 1, use alpha + 1 and take power
    const r = gammaRandom(alpha + 1)
    const p = Math.pow(Math.random(), 1 / alpha)
    return r * p
  }

  // Marsaglia and Tsang's method
  const d = alpha - 1 / 3
  const c = 1 / Math.sqrt(9 * d)

  let accepted = false
  let result = 0

  while (!accepted) {
    // Generate valid candidate
    let x: number, v: number
    do {
      x = randn()
      v = 1 + c * x
    } while (v <= 0)

    v = v * v * v
    const u = Math.random()

    // Check acceptance conditions
    if (u < 1 - 0.0331 * x * x * x * x) {
      result = d * v
      accepted = true
    } else if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
      result = d * v
      accepted = true
    }
    // If neither condition met, loop continues
  }

  return result
}

/**
 * Generates a standard normal random variable using
 * Marsaglia polar method
 */
function randn(): number {
  let u: number, v: number, s: number
  do {
    u = 2 * Math.random() - 1
    v = 2 * Math.random() - 1
    s = u * u + v * v
  } while (s >= 1 || s === 0)

  return u * Math.sqrt((-2 * Math.log(s)) / s)
}

/**
 * Generates random draws from a PERT distribution using direct gamma sampling
 */
export function rpert(
  n: number,
  min: number,
  mode: number,
  max: number
): number[] {
  // Input validation
  if (min > max || mode < min || mode > max) {
    throw new Error("Invalid parameters: must satisfy min <= mode <= max")
  }
  if (n <= 0) {
    throw new Error("Number of draws must be positive")
  }

  const range = max - min
  if (range === 0) return Array(n).fill(min)

  // PERT shape parameters for Beta distribution
  const alpha1 = 1 + (4 * (mode - min)) / range
  const alpha2 = 1 + (4 * (max - mode)) / range

  // Generate n random draws
  const result = new Array(n)
  for (let i = 0; i < n; i++) {
    // Generate two gamma variates and take their ratio to get Beta
    const g1 = gammaRandom(alpha1)
    const g2 = gammaRandom(alpha2)
    const beta = g1 / (g1 + g2)

    // Transform Beta to PERT
    result[i] = min + beta * range
  }

  return result
}
