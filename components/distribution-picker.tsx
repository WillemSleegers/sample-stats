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

export const DistributionPicker = ({
  distribution,
  setDistribution,
}: DistributionPickerProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="distribution">Distribution</Label>
        <Select
          value={distribution}
          onValueChange={(value: Distribution) => setDistribution(value)}
        >
          <SelectTrigger className="w-36">
            <SelectValue id="distribution" />
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
    </div>
  )
}
