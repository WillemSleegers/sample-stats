import {
  Parameters,
  ParamsNormal,
  ParamsLognormal,
  ParamsUniform,
  ParamsBeta,
  ParamsPert,
  ParamsMetalog,
} from "./types"

// Helper function for gamma function (approximation)
function gamma(z: number): number {
  // Lanczos approximation
  const g = 7
  const C = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ]

  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z))
  }

  z -= 1
  let x = C[0]
  for (let i = 1; i < g + 2; i++) {
    x += C[i] / (z + i)
  }

  const t = z + g + 0.5
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
}

// Normal distribution PDF
function normalPdf(x: number, params: ParamsNormal): number {
  const { mean, sd } = params
  const variance = sd * sd
  return (
    (1 / Math.sqrt(2 * Math.PI * variance)) *
    Math.exp(-Math.pow(x - mean, 2) / (2 * variance))
  )
}

// Lognormal distribution PDF
function lognormalPdf(x: number, params: ParamsLognormal): number {
  if (x <= 0) return 0
  const { meanlog, sdlog } = params
  const variance = sdlog * sdlog
  return (
    (1 / (x * Math.sqrt(2 * Math.PI * variance))) *
    Math.exp(-Math.pow(Math.log(x) - meanlog, 2) / (2 * variance))
  )
}

// Uniform distribution PDF
function uniformPdf(x: number, params: ParamsUniform): number {
  const { min, max } = params
  if (x < min || x > max) return 0
  return 1 / (max - min)
}

// Beta distribution PDF
function betaPdf(x: number, params: ParamsBeta): number {
  if (x <= 0 || x >= 1) return 0
  const { alpha, beta } = params
  const betaFunction = (gamma(alpha) * gamma(beta)) / gamma(alpha + beta)
  return (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) / betaFunction
}

// PERT distribution PDF (simplified beta distribution)
function pertPdf(x: number, params: ParamsPert): number {
  const { min, mode, max } = params
  if (x < min || x > max) return 0

  // Transform to [0,1] range
  const range = max - min
  const xNorm = (x - min) / range
  const modeNorm = (mode - min) / range

  // Calculate alpha and beta for PERT
  const alpha = 1 + 4 * modeNorm
  const beta = 1 + 4 * (1 - modeNorm)

  const betaFunction = (gamma(alpha) * gamma(beta)) / gamma(alpha + beta)
  const pdfValue = (Math.pow(xNorm, alpha - 1) * Math.pow(1 - xNorm, beta - 1)) / betaFunction

  // Scale back to original range
  return pdfValue / range
}

// Metalog distribution quantile function
function metalogQuantile(p: number, params: ParamsMetalog): number {
  const { p10, p50, p90, lower, upper } = params

  // Create quantile pairs
  const quantilePairs = [
    { p: 0.1, x: p10 },
    { p: 0.5, x: p50 },
    { p: 0.9, x: p90 }
  ]

  // Sort quantile pairs by probability
  const sortedPairs = [...quantilePairs].sort((a, b) => a.p - b.p)

  // Determine boundedness and transform variables
  let boundedness: "u" | "sl" | "su" | "b" = "u"
  let lowerBound = -Infinity
  let upperBound = Infinity

  if (lower !== undefined && upper !== undefined) {
    boundedness = "b"
    lowerBound = lower
    upperBound = upper
  } else if (lower !== undefined) {
    boundedness = "sl"
    lowerBound = lower
  } else if (upper !== undefined) {
    boundedness = "su"
    upperBound = upper
  }

  // Build Y matrix for the quantile pairs
  const Y = sortedPairs.map((pair) => {
    const prob = pair.p
    const logit = Math.log(prob / (1 - prob))
    return [1, logit, (prob - 0.5) * logit]
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
  const det = (m: number[][]) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])

  const detA = det(Y)
  const a = new Array(3).fill(0).map((_, i) => {
    const Yi = Y.map((row, j) => row.map((val, k) => (k === i ? z[j] : val)))
    return det(Yi) / detA
  })

  // Calculate quantile for given probability p
  const logit = Math.log(p / (1 - p))
  const y2 = logit
  const y3 = (p - 0.5) * logit

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
}

// Metalog distribution PDF using numerical differentiation
function metalogPdf(x: number, params: ParamsMetalog): number {
  const { lower, upper } = params

  // Check bounds
  if (lower !== undefined && x <= lower) return 0
  if (upper !== undefined && x >= upper) return 0

  // Use numerical differentiation to find PDF from quantile function
  // PDF(x) = 1 / (d/dp Q(p)) where Q(p) is the quantile function

  // First, we need to find p such that Q(p) ≈ x
  // Use binary search to find the probability p corresponding to x
  let pLow = 0.001
  let pHigh = 0.999
  let p = 0.5
  const tolerance = 1e-6
  const maxIterations = 50

  for (let i = 0; i < maxIterations; i++) {
    const qp = metalogQuantile(p, params)
    if (Math.abs(qp - x) < tolerance) break

    if (qp < x) {
      pLow = p
    } else {
      pHigh = p
    }
    p = (pLow + pHigh) / 2
  }

  // Now compute the derivative dQ/dp using numerical differentiation
  const h = 0.001 // Small step for numerical differentiation
  const pPlus = Math.min(0.999, p + h)
  const pMinus = Math.max(0.001, p - h)

  const qPlus = metalogQuantile(pPlus, params)
  const qMinus = metalogQuantile(pMinus, params)

  const dQdp = (qPlus - qMinus) / (pPlus - pMinus)

  // PDF = 1 / (dQ/dp)
  return dQdp > 0 ? 1 / dQdp : 0
}

// Main PDF function
export function calculatePdf(x: number, params: Parameters): number {
  switch (params.type) {
    case "normal":
      return normalPdf(x, params)
    case "lognormal":
      return lognormalPdf(x, params)
    case "uniform":
      return uniformPdf(x, params)
    case "beta":
      return betaPdf(x, params)
    case "pert":
      return pertPdf(x, params)
    case "metalog":
      return metalogPdf(x, params)
  }
}

// Generate PDF curve data points
export function generatePdfCurve(
  min: number,
  max: number,
  params: Parameters,
  points = 100
): Array<{ x: number; y: number }> {
  const step = (max - min) / points
  const curve: Array<{ x: number; y: number }> = []

  for (let i = 0; i <= points; i++) {
    const x = min + i * step
    const y = calculatePdf(x, params)
    curve.push({ x, y })
  }

  return curve
}
