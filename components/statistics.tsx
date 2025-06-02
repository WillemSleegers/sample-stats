import { Stats } from "@/lib/types"
import { Label } from "./ui/label"

type StatisticsSummaryProps = {
  stats: Stats
}

export const StatisticsSummary = ({ stats }: StatisticsSummaryProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 text-center max-w-xl mx-auto">
      <div>
        <Label>10th Percentile</Label>
        <div className="text-xl font-bold">
          {stats.p10 ? stats.p10.toFixed(2) : "-"}
        </div>
      </div>
      <div>
        <Label>50th Percentile</Label>
        <div className="text-xl font-bold">
          {stats.p50 ? stats.p50.toFixed(2) : "-"}
        </div>
      </div>
      <div>
        <Label>90th Percentile</Label>
        <div className="text-xl font-bold">
          {stats.p90 ? stats.p90.toFixed(2) : "-"}
        </div>
      </div>

      <div>
        <Label>Min</Label>
        <div className="text-xl font-bold">
          {stats.min ? stats.min.toFixed(2) : "-"}
        </div>
      </div>

      <div>
        <Label>Mean</Label>
        <div className="text-xl font-bold">
          {stats.mean ? stats.mean.toFixed(2) : "-"}
        </div>
      </div>
      <div>
        <Label>Max</Label>
        <div className="text-xl font-bold">
          {stats.max ? stats.max.toFixed(2) : "-"}
        </div>
      </div>
    </div>
  )
}
