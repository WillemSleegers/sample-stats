import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

import { Distribution } from "@/lib/types"
import { Dispatch, SetStateAction } from "react"

type DistributionPickerProps = {
  distribution: Distribution
  setDistribution: Dispatch<SetStateAction<Distribution>>
}

const getDisplayName = (dist: Distribution): string => {
  const names: Record<Distribution, string> = {
    normal: "Normal",
    lognormal: "Log-normal",
    uniform: "Uniform",
    beta: "Beta",
    pert: "PERT",
    metalog: "Metalog",
  }
  return names[dist]
}

export const DistributionPicker = ({
  distribution,
  setDistribution,
}: DistributionPickerProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="distribution">Distribution</Label>
      <Select
        value={distribution}
        onValueChange={(value: Distribution) => setDistribution(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue id="distribution">
            {getDisplayName(distribution)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="lognormal">Log-normal</SelectItem>
          <SelectItem value="uniform">Uniform</SelectItem>
          <SelectItem value="beta">Beta</SelectItem>
          <SelectItem value="pert">PERT</SelectItem>
          <SelectItem value="metalog">Metalog</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
