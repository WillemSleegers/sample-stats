import { useMemo } from "react"
import {
  Bar,
  ResponsiveContainer,
  Line,
  ComposedChart,
  YAxis,
  XAxis,
} from "recharts"
import { Distribution, Parameters } from "@/lib/types"
import { generatePdfCurve } from "@/lib/pdf"

type HistogramProps = {
  data: number[]
  binCount: number
  animationDuration?: number
  showPdf?: boolean
  distribution?: Distribution
  parameters?: Parameters
}

export const Histogram = ({
  data,
  binCount,
  animationDuration = 500,
  showPdf = false,
  distribution,
  parameters,
}: HistogramProps) => {
  const { histogramData, pdfData, maxY } = useMemo(() => {
    if (data.length === 0) return { histogramData: [], pdfData: [], maxY: 0 }

    const min = Math.min(...data)
    const max = Math.max(...data)
    const binWidth = (max - min) / binCount || 1 // Prevent division by zero

    // Initialize bins with their ranges
    const bins = Array(binCount)
      .fill(0)
      .map((_, i) => ({
        binStart: min + i * binWidth,
        binEnd: min + (i + 1) * binWidth,
        count: 0,
      }))

    // Count samples in each bin
    data.forEach((datum) => {
      const binIndex = Math.min(
        Math.floor((datum - min) / binWidth),
        binCount - 1
      )
      if (binIndex >= 0 && binIndex < binCount) {
        bins[binIndex].count++
      }
    })

    // Calculate histogram density (for comparison with PDF)
    const totalSamples = data.length

    // Create histogram bars - just use raw count for now
    const histogramBars: Array<{
      index: number
      bin: string
      count: number
      pdf?: number
    }> = bins.map((bin, index) => ({
      index,
      bin: `${bin.binStart.toFixed(1)} - ${bin.binEnd.toFixed(1)}`,
      count: bin.count,
    }))

    let maxYValue = Math.max(...histogramBars.map((b) => b.count))

    // Add PDF values to histogram bars if needed
    if (showPdf && distribution && parameters) {
      const pdfValues = bins.map((bin) => {
        const x = (bin.binStart + bin.binEnd) / 2
        return generatePdfCurve(x, x, distribution, parameters, 1)[0]?.y || 0
      })

      const maxPdf = Math.max(...pdfValues)
      const scaleFactor = maxPdf > 0 ? maxYValue / maxPdf : 1

      histogramBars.forEach((bar, i) => {
        bar.pdf = pdfValues[i] * scaleFactor
      })
    }

    return {
      histogramData: histogramBars,
      maxY: maxYValue,
    }
  }, [data, binCount, showPdf, distribution, parameters])

  // Chart data is just the histogram data with optional PDF values
  const chartData = histogramData

  // Calculate bar size based on number of bins
  const barSize = useMemo(() => {
    if (binCount === 0) return 20
    return Math.max(5, Math.floor(400 / binCount)) // Approximate width based on bin count
  }, [binCount])

  // Return null when there's no data to avoid rendering empty chart
  if (data.length === 0) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%" className="bg-background">
      <ComposedChart data={chartData}>
        <XAxis dataKey="index" hide type="number" domain={[0, binCount - 1]} />
        <YAxis hide domain={[0, maxY * 1.1]} />
        {showPdf && (
          <Line
            type="natural"
            dataKey="pdf"
            stroke="hsl(var(--secondary))"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
            activeDot={false}
            legendType="none"
          />
        )}
        <Bar
          dataKey="count"
          fill="#16a34a"
          animationDuration={animationDuration}
          animationEasing="ease-in-out"
          barSize={barSize}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
