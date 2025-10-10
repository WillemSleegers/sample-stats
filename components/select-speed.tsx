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

const SelectSpeed = ({ speed, setSpeed }: SelectSpeedProps) => {
  const handleValueChange = (value: string) => {
    setSpeed(value as SpeedSetting)
  }

  return (
    <div className="space-y-2">
      <Label>Speed</Label>
      <Select value={speed} onValueChange={handleValueChange}>
        <SelectTrigger className="min-w-[100px]">
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

export default SelectSpeed
