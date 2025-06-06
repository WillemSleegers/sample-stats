import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Distribution, FormHandle, Parameters, SpeedSetting } from "@/lib/types"
import FormDistribution from "./forms/form-distributions"
import { Dispatch, forwardRef, SetStateAction } from "react"
import { SelectSpeed } from "./select-speed"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"

type AppSidebarProps = {
  distribution: Distribution
  params: Parameters
  setParams: Dispatch<SetStateAction<Parameters>>
  setSpeed: Dispatch<SetStateAction<SpeedSetting>>
  setShowStats: Dispatch<SetStateAction<boolean>>
}

export const AppSidebar = forwardRef<FormHandle, AppSidebarProps>(
  ({ distribution, setParams, setSpeed, setShowStats }, ref) => {
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
              ref={ref}
              distribution={distribution}
              setParams={setParams}
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
          </div>
        </SidebarContent>
        <SidebarFooter className="text-sm">Made by me</SidebarFooter>
      </Sidebar>
    )
  }
)

AppSidebar.displayName = "AppSidebar"
