import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Distribution, Parameters, SpeedSetting } from "@/lib/types"
import FormDistribution from "./forms/form-distributions"
import { Dispatch, SetStateAction } from "react"
import { SelectSpeed } from "./select-speed"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Input } from "./ui/input"

type AppSidebarProps = {
  distribution: Distribution
  setParams: Dispatch<SetStateAction<Parameters>>
  onUpdateParameters: () => void
  setSpeed: Dispatch<SetStateAction<SpeedSetting>>
  setShowStats: Dispatch<SetStateAction<boolean>>
  binCount: number
  setBinCount: Dispatch<SetStateAction<number>>
  useSturges: boolean
  setUseSturges: Dispatch<SetStateAction<boolean>>
  showPdf: boolean
  setShowPdf: Dispatch<SetStateAction<boolean>>
}

export const AppSidebar = ({ distribution, setParams, onUpdateParameters, setSpeed, setShowStats, binCount, setBinCount, useSturges, setUseSturges, showPdf, setShowPdf }: AppSidebarProps) => {
  return (
    <Sidebar>
      <SidebarHeader className="font-semibold text-lg">
        Settings
      </SidebarHeader>
      <SidebarContent className="p-4 space-y-2">
        <div className="space-y-2">
          <div>
            <div className="font-semibold text-base">Parameters</div>
            <div className="text-muted-foreground text-sm">
              Set the parameters to shape the distribution
            </div>
          </div>
          <FormDistribution
            distribution={distribution}
            setParams={setParams}
            onUpdate={onUpdateParameters}
          />
        </div>
          <div className="space-y-4">
            <div className="font-semibold text-base">Additional settings</div>
            <SelectSpeed setSpeed={setSpeed} />
            <div className="flex items-center space-x-2">
              <Switch
                id="showStats"
                onCheckedChange={() => {
                  setShowStats((prev) => !prev)
                }}
              />
              <Label htmlFor="showStats">Show statistics</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showPdf"
                checked={showPdf}
                onCheckedChange={setShowPdf}
              />
              <Label htmlFor="showPdf">Show probability density overlay</Label>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="useSturges"
                  checked={useSturges}
                  onCheckedChange={setUseSturges}
                />
                <Label htmlFor="useSturges">Use Sturges&apos; method</Label>
              </div>
              <div className="space-y-1">
                <Label htmlFor="binCount">Bin count</Label>
                <Input
                  id="binCount"
                  type="number"
                  min={1}
                  max={100}
                  value={binCount}
                  onChange={(e) => setBinCount(Number(e.target.value))}
                  disabled={useSturges}
                />
              </div>
            </div>
          </div>
        </SidebarContent>
        <SidebarFooter className="text-sm">Made by me</SidebarFooter>
      </Sidebar>
    )
}
