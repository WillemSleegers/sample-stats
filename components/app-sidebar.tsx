import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Distribution, Parameters, SpeedSetting } from "@/lib/types"
import FormDistribution from "./forms/form-distributions"
import { Dispatch, SetStateAction } from "react"
import SelectSpeed from "./select-speed"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { FieldGroup, FieldTitle, FieldDescription } from "./ui/field"

type AppSidebarProps = {
  distribution: Distribution
  setParams: Dispatch<SetStateAction<Parameters>>
  onUpdateParameters: () => void
  speed: SpeedSetting
  setSpeed: Dispatch<SetStateAction<SpeedSetting>>
  showStats: boolean
  setShowStats: Dispatch<SetStateAction<boolean>>
  binCount: number
  setBinCount: Dispatch<SetStateAction<number>>
  useSturges: boolean
  setUseSturges: Dispatch<SetStateAction<boolean>>
  showPdf: boolean
  setShowPdf: Dispatch<SetStateAction<boolean>>
}

export const AppSidebar = ({ distribution, setParams, onUpdateParameters, speed, setSpeed, showStats, setShowStats, binCount, setBinCount, useSturges, setUseSturges, showPdf, setShowPdf }: AppSidebarProps) => {
  return (
    <Sidebar>
      <SidebarHeader className="font-semibold text-lg px-6 py-4 border-b">
        Settings
      </SidebarHeader>
      <SidebarContent className="px-6 py-4">
        <FieldGroup>
          {/* Distribution Parameters Section */}
          <FieldGroup>
            <FieldTitle>Parameters</FieldTitle>
            <FieldDescription>
              Set the parameters to shape the distribution
            </FieldDescription>
            <FormDistribution
              distribution={distribution}
              setParams={setParams}
              onUpdate={onUpdateParameters}
            />
          </FieldGroup>

          {/* Visualization Settings Section */}
          <FieldGroup>
            <FieldTitle>Visualization</FieldTitle>
            <FieldDescription>
              Configure how data is displayed
            </FieldDescription>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showStats" className="text-sm font-medium">Show statistics</Label>
                <Switch
                  id="showStats"
                  checked={showStats}
                  onCheckedChange={() => {
                    setShowStats((prev) => !prev)
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showPdf" className="text-sm font-medium">Show theoretical curve</Label>
                <Switch
                  id="showPdf"
                  checked={showPdf}
                  onCheckedChange={setShowPdf}
                />
              </div>
            </div>
          </FieldGroup>

          {/* Histogram Settings Section */}
          <FieldGroup>
            <FieldTitle>Histogram</FieldTitle>
            <FieldDescription>
              Control histogram appearance
            </FieldDescription>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="useSturges" className="text-sm font-medium">Auto bin count</Label>
                <Switch
                  id="useSturges"
                  checked={useSturges}
                  onCheckedChange={setUseSturges}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="binCount" className="text-sm font-medium">Bin count</Label>
                <Input
                  id="binCount"
                  type="number"
                  min={1}
                  max={100}
                  value={binCount}
                  onChange={(e) => setBinCount(Number(e.target.value))}
                  disabled={useSturges}
                  className="w-full"
                />
              </div>
            </div>
          </FieldGroup>

          {/* Sampling Settings Section */}
          <FieldGroup>
            <FieldTitle>Sampling</FieldTitle>
            <FieldDescription>
              Control sampling speed
            </FieldDescription>
            <SelectSpeed speed={speed} setSpeed={setSpeed} />
          </FieldGroup>
        </FieldGroup>
        </SidebarContent>
      </Sidebar>
    )
}
