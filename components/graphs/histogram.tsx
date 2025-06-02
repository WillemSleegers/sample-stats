import { useCallback } from "react"
import { BarChart, Bar, ResponsiveContainer } from "recharts"

type HistogramProps = {
  data: number[]
  binCount: number
}

export const Histogram = ({ data, binCount }: HistogramProps) => {
  const prepareHistogramData = useCallback(() => {
    if (data.length === 0) return [{ bin: "0", count: 0 }]

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

    // Format bin labels and return data
    return bins.map((bin) => ({
      bin: `${bin.binStart.toFixed(1)} - ${bin.binEnd.toFixed(1)}`,
      count: bin.count,
      tooltipContent: `Range: ${bin.binStart.toFixed(
        2
      )} to ${bin.binEnd.toFixed(2)}\nCount: ${bin.count}`,
    }))
  }, [data, binCount])

  return (
    <ResponsiveContainer width="100%" height="100%" className="bg-background">
      <BarChart data={prepareHistogramData()}>
        <Bar
          dataKey="count"
          fill="#16a34a"
          animationDuration={500}
          animationEasing="ease-in-out"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
