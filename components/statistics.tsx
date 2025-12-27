import { Stats } from "@/lib/types"

type StatisticsSummaryProps = {
  stats: Stats
  sampleCount: number
}

export const StatisticsSummary = ({ stats, sampleCount }: StatisticsSummaryProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-4 mb-16">
      <h3 className="text-lg font-semibold text-center">Summary Statistics</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <StatCard label="Samples" value={sampleCount} decimals={0} />
        <StatCard label="Mean" value={stats.mean} />
        <StatCard label="Median" value={stats.p50} />
        <StatCard label="Mode" value={stats.mode} />
        <StatCard label="Std Dev" value={stats.stdDev} />
        <StatCard label="Variance" value={stats.variance} />
        <StatCard label="Skewness" value={stats.skewness} />
        <StatCard label="Kurtosis" value={stats.kurtosis} />
        <StatCard label="Min" value={stats.min} />
        <StatCard label="Max" value={stats.max} />
        <StatCard label="P10" value={stats.p10} />
        <StatCard label="P90" value={stats.p90} />
      </div>
    </div>
  )
}

function StatCard({ label, value, decimals = 2 }: { label: string; value?: number; decimals?: number }) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold tabular-nums">
        {value !== undefined ? (decimals === 0 ? value.toLocaleString() : value.toFixed(decimals)) : "-"}
      </div>
    </div>
  )
}
