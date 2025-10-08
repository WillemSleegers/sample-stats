import { Stats } from "@/lib/types"

type StatisticsSummaryProps = {
  stats: Stats
}

export const StatisticsSummary = ({ stats }: StatisticsSummaryProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h3 className="text-lg font-semibold text-center">Summary Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label="Mean" value={stats.mean} />
        <StatCard label="Min" value={stats.min} />
        <StatCard label="Max" value={stats.max} />
        <StatCard label="P10" value={stats.p10} />
        <StatCard label="Median" value={stats.p50} />
        <StatCard label="P90" value={stats.p90} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value?: number }) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 border border-border">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold tabular-nums">
        {value !== undefined ? value.toFixed(2) : "-"}
      </div>
    </div>
  )
}
