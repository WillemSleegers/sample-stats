"use client"

import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import { Distribution, Parameters, SpeedSetting } from "@/lib/types"
import FormDistribution from "./forms/form-distribution"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { SelectSpeed } from "./select-speed"
import { SelectTheme } from "./select-theme"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import {
  FieldGroup,
  FieldTitle,
  FieldDescription,
  FieldSeparator,
} from "./ui/field"

type AppSidebarProps = {
  distribution: Distribution
  setParams: Dispatch<SetStateAction<Parameters>>
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

export const AppSidebar = ({
  distribution,
  setParams,
  speed,
  setSpeed,
  showStats,
  setShowStats,
  binCount,
  setBinCount,
  useSturges,
  setUseSturges,
  showPdf,
  setShowPdf,
}: AppSidebarProps) => {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch for localStorage-dependent values
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar>
      <SidebarHeader className="font-semibold text-lg px-6 py-4">
        Settings
      </SidebarHeader>
      <SidebarContent className="px-6 py-4">
        <div className="space-y-6">
          {/* Distribution Parameters Section */}
          <FieldGroup className="gap-3">
            <FieldTitle>Parameters</FieldTitle>
            <FieldDescription>Shape the distribution</FieldDescription>
            <FormDistribution
              distribution={distribution}
              setParams={setParams}
            />
          </FieldGroup>

          <FieldSeparator className="my-0" />

          {/* Visualization Settings Section */}
          <FieldGroup className="gap-3">
            <FieldTitle>Visualization</FieldTitle>
            <FieldDescription>Configure display options</FieldDescription>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="showStats" className="text-sm font-medium">
                  Show statistics
                </Label>
                <Switch
                  id="showStats"
                  checked={mounted ? showStats : false}
                  onCheckedChange={() => {
                    setShowStats((prev) => !prev)
                  }}
                  disabled={!mounted}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showPdf" className="text-sm font-medium">
                  Show theoretical curve
                </Label>
                <Switch
                  id="showPdf"
                  checked={mounted ? showPdf : false}
                  onCheckedChange={setShowPdf}
                  disabled={!mounted}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="binCount" className="text-sm font-medium">
                  Bin count
                </Label>
                <Input
                  id="binCount"
                  type="number"
                  min={1}
                  max={100}
                  value={mounted ? binCount : 10}
                  onChange={(e) => setBinCount(Number(e.target.value))}
                  disabled={!mounted || useSturges}
                  className="w-full bg-background"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="useSturges" className="text-sm font-medium">
                  Auto bin count
                </Label>
                <Switch
                  id="useSturges"
                  checked={mounted ? useSturges : false}
                  onCheckedChange={setUseSturges}
                  disabled={!mounted}
                />
              </div>
            </div>
          </FieldGroup>

          <FieldSeparator className="my-0" />

          {/* Sampling Settings Section */}
          <FieldGroup className="gap-3">
            <FieldTitle>Sampling</FieldTitle>
            <FieldDescription>Control sampling speed</FieldDescription>
            <SelectSpeed speed={speed} setSpeed={setSpeed} mounted={mounted} />
          </FieldGroup>

          <FieldSeparator className="my-0" />

          {/* Appearance Settings Section */}
          <FieldGroup className="gap-3">
            <FieldTitle>Appearance</FieldTitle>
            <FieldDescription>Customize the look</FieldDescription>
            <SelectTheme />
          </FieldGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
