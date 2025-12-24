import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  YAxis,
  XAxis,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Parameters } from "@/lib/types"
import { calculatePdfValues } from "@/lib/pdf"
import { useWebR } from "@/hooks/use-webr"

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
  const { webR } = useWebR()
  const [pdfValues, setPdfValues] = useState<number[]>([])

  const hasData = data.length > 0

  const min = hasData ? Math.min(...data) : 0
  const max = hasData ? Math.max(...data) : 0
  const binWidth = hasData ? (max - min) / binCount || 1 : 1

  // Initialize and populate bins
  const bins = hasData
    ? Array(binCount)
        .fill(0)
        .map(() => 0)
    : []

  if (hasData) {
    data.forEach((datum) => {
      const binIndex = Math.min(
        Math.floor((datum - min) / binWidth),
        binCount - 1
      )
      if (binIndex >= 0 && binIndex < binCount) {
        bins[binIndex]++
      }
    })
  }

  // Calculate PDF values when parameters change
  useEffect(() => {
    if (!showPdf || !parameters || !webR || !hasData) {
      setPdfValues([])
      return
    }

    const numPoints = Math.max(50, binCount * 4)
    const step = (max - min) / (numPoints - 1)
    const xValues = Array.from({ length: numPoints }, (_, i) => min + i * step)

    calculatePdfValues(webR, xValues, parameters)
      .then((values) => setPdfValues(values))
      .catch((error) => {
        console.error("Failed to calculate PDF values:", error)
        setPdfValues([])
      })
  }, [showPdf, parameters, webR, hasData, min, max, binCount])

  const histogramBars = bins.map((count, index) => ({
    index,
    count,
  }))

  const maxY = Math.max(...bins, 0)

  const pdfChartData =
    showPdf && pdfValues.length > 0
      ? pdfValues.map((pdfValue, i) => ({
          index: (i / (pdfValues.length - 1)) * (binCount - 1),
          pdf: pdfValue * binWidth * data.length,
        }))
      : []

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
    pdf: {
      label: "Theoretical curve",
      color: "hsl(var(--secondary))",
    },
  }

  // Early return after all hooks
  if (!hasData) {
    return null
  }

  return (
    <div className="relative h-full w-full">
      {/* Histogram bars */}
      <ChartContainer
        config={chartConfig}
        className="h-full w-full bg-background outline-none [&_svg]:outline-none [&_svg]:focus:outline-none"
      >
        <BarChart data={histogramBars}>
          <XAxis dataKey="index" hide />
          <YAxis hide domain={[0, maxY * 1.1]} />
          <Bar
            dataKey="count"
            fill="var(--primary)"
            animationDuration={animationDuration}
            animationEasing="ease-in-out"
          />
        </BarChart>
      </ChartContainer>

      {/* PDF overlay - positioned on top */}
      {showPdf && pdfChartData.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full bg-transparent outline-none [&_svg]:outline-none [&_svg]:focus:outline-none"
          >
            <LineChart data={pdfChartData}>
              <XAxis
                dataKey="index"
                type="number"
                domain={[0, binCount - 1]}
                hide
              />
              <YAxis hide domain={[0, maxY * 1.1]} />
              <Line
                type="monotone"
                dataKey="pdf"
                stroke="var(--secondary)"
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
                activeDot={false}
                legendType="none"
              />
            </LineChart>
          </ChartContainer>
        </div>
      )}
    </div>
  )
}
