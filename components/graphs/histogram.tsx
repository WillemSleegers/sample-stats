import { useMemo } from "react"
import {
  Bar,
  Line,
  ComposedChart,
  YAxis,
  XAxis,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Parameters } from "@/lib/types"
import { generatePdfCurve } from "@/lib/pdf"

type HistogramProps = {
  data: number[]
  binCount: number
  animationDuration?: number
  showPdf?: boolean
  parameters?: Parameters
}

export const Histogram = ({
  data,
  binCount,
  animationDuration = 500,
  showPdf = false,
  parameters,
}: HistogramProps) => {
  const { histogramData, maxY } = useMemo(() => {
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

    const maxYValue = Math.max(...histogramBars.map((b) => b.count))

    // Add PDF values to histogram bars if needed
    if (showPdf && parameters) {
      const pdfValues = bins.map((bin) => {
        const x = (bin.binStart + bin.binEnd) / 2
        return generatePdfCurve(x, x, parameters, 1)[0]?.y || 0
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
  }, [data, binCount, showPdf, parameters])

  // Chart data is just the histogram data with optional PDF values
  const chartData = histogramData

  // Return null when there's no data to avoid rendering empty chart
  if (data.length === 0) {
    return null
  }

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
    pdf: {
      label: "Theoretical curve",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="h-full w-full bg-background outline-none [&_svg]:outline-none [&_svg]:focus:outline-none"
    >
      <ComposedChart data={chartData} barCategoryGap="5%">
        <XAxis dataKey="index" hide />
        <YAxis hide domain={[0, maxY * 1.1]} />
        {showPdf && (
          <Line
            type="natural"
            dataKey="pdf"
            stroke="var(--color-pdf)"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
            activeDot={false}
            legendType="none"
          />
        )}
        <Bar
          dataKey="count"
          fill="var(--color-count)"
          animationDuration={animationDuration}
          animationEasing="ease-in-out"
        />
      </ComposedChart>
    </ChartContainer>
  )
}
