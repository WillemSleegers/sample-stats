import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SpeedSetting } from "@/lib/types"
import { Dispatch, SetStateAction } from "react"
import { Label } from "./ui/label"

type SelectSpeedProps = {
  speed: SpeedSetting
  setSpeed: Dispatch<SetStateAction<SpeedSetting>>
}

export const SelectSpeed = ({ speed, setSpeed }: SelectSpeedProps) => {
  const handleValueChange = (value: string) => {
    setSpeed(value as SpeedSetting)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="speed">Speed</Label>
      <Select value={speed} onValueChange={handleValueChange}>
        <SelectTrigger id="speed" className="min-w-25 bg-background">
          <SelectValue placeholder="Change speed" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="slow">Slow</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="fast">Fast</SelectItem>
          <SelectItem value="fastest">Fastest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
