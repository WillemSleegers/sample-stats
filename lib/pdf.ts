import {
  Parameters,
  ParamsNormal,
  ParamsLognormal,
  ParamsUniform,
  ParamsBeta,
  ParamsPert,
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
      // Metalog doesn't have a simple closed-form PDF
      return 0
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
