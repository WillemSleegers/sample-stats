"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import { FullscreenIcon } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Histogram } from "@/components/histogram"
import { ThemeToggle } from "@/components/theme-toggle"
import { DistributionForm } from "@/components/distribution-form"

import { draw } from "@/lib/draw"
import { max, mean, min, quantile } from "@/lib/utils"

import { SPEED_SETTINGS } from "@/lib/constants"

import { Parameters, SpeedSetting, Stats } from "@/lib/types"

const App = () => {
  const [parameters, setParameters] = useState<Parameters>({
    distribution: "normal",
    mean: 0,
    sd: 1,
  })
  const [samples, setSamples] = useState<number[]>([])
  const [isSampling, setIsSampling] = useState(false)
  const [stats, setStats] = useState<Stats>({})

  const [speed, setSpeed] = useState<SpeedSetting>("normal")
  const [binCount, setBinCount] = useState(20)
  const [extraStats, setExtraStats] = useState(false)

  const [fullScreenEnabled, setFullScreenEnabled] = useState(true)
  const handle = useFullScreenHandle()

  const samplingIntervalRef = useRef<ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    setFullScreenEnabled(window.document.fullscreenEnabled)
  }, [])

  const updateStats = useCallback(
    (newSamples: number[]) => {
      if (newSamples.length === 0) return

      const quantiles = quantile(newSamples, [0.1, 0.5, 0.9])

      if (extraStats) {
        setStats({
          p10: quantiles[0],
          p50: quantiles[1],
          p90: quantiles[2],
          min: min(newSamples),
          max: max(newSamples),
          mean: mean(newSamples),
        })
      } else {
        setStats({
          p10: quantiles[0],
          p50: quantiles[1],
          p90: quantiles[2],
        })
      }
    },
    [extraStats]
  )

  const addSamples = useCallback(() => {
    const { n } = SPEED_SETTINGS[speed]
    const newSamples = draw(n, parameters)

    setSamples((prevSamples) => {
      const updatedSamples = [...prevSamples, ...newSamples]
      updateStats(updatedSamples)
      return updatedSamples
    })
  }, [parameters, updateStats, speed])

  useEffect(() => {
    if (isSampling) {
      addSamples()
      const { interval } = SPEED_SETTINGS[speed]
      samplingIntervalRef.current = setInterval(addSamples, interval)
    }

    return () => {
      if (samplingIntervalRef.current) {
        clearInterval(samplingIntervalRef.current)
        samplingIntervalRef.current = null
      }
    }
  }, [isSampling, addSamples, speed])

  const resetSampling = useCallback(() => {
    setIsSampling(false)
    setSamples([])
    setStats({ p10: 0, p50: 0, p90: 0 })
    if (samplingIntervalRef.current) {
      clearInterval(samplingIntervalRef.current)
      samplingIntervalRef.current = null
    }
  }, [])

  return (
    <div className="my-4 space-y-4 max-w-6xl mx-auto p-4">
      <div className="flex flex-col gap-4 my-8 justify-items-center text-center">
        <div>
          <ThemeToggle />
        </div>

        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
          Sample Stats
        </h1>
        <p className="text-lg font-light text-foreground">
          Watch distributions come alive, one sample at a time
        </p>
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
        <div className="flex flex-col sm:flex-row md:flex-col gap-4">
          <DistributionForm
            setParameters={setParameters}
            isSampling={isSampling}
            setIsSampling={setIsSampling}
            resetSampling={resetSampling}
          />
          <div className="bg-card p-4 border rounded-xl grow space-y-4 min-w-48">
            <div className="space-y-2">
              <Label htmlFor="speed">Speed</Label>
              <Select
                onValueChange={(e: SpeedSetting) => {
                  setSpeed(e)
                }}
                defaultValue="normal"
              >
                <SelectTrigger id="speed" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                  <SelectItem value="faster">Faster</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bins">Bins</Label>
              <Input
                defaultValue={binCount}
                onChange={(event) => setBinCount(Number(event.target.value))}
                type="number"
                min={10}
                max={100}
                className="mt-2"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="extra-stats"
                checked={extraStats}
                onCheckedChange={() => {
                  setExtraStats((prev) => !prev)
                }}
              />
              <Label htmlFor="extra-stats">Extra statistics</Label>
            </div>
          </div>
        </div>

        <div className="border rounded-xl flex flex-col grow justify-between p-4 gap-4">
          <div className="flex justify-between align-middle">
            <div className="text-sm text-muted-foreground text-center">
              Total Samples: {samples.length}
            </div>
            {fullScreenEnabled && (
              <Button size="icon" variant="ghost" onClick={handle.enter}>
                <FullscreenIcon />
              </Button>
            )}
          </div>

          <FullScreen handle={handle} className="h-[450px]">
            <Histogram data={samples} binCount={binCount} />
          </FullScreen>

          <div className="grid grid-cols-3 gap-4 text-center">
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

            {extraStats && (
              <div>
                <Label>Min</Label>
                <div className="text-xl font-bold">
                  {stats.min ? stats.min.toFixed(2) : "-"}
                </div>
              </div>
            )}
            {extraStats && (
              <div>
                <Label>Mean</Label>
                <div className="text-xl font-bold">
                  {stats.mean ? stats.mean.toFixed(2) : "-"}
                </div>
              </div>
            )}
            {extraStats && (
              <div>
                <Label>Max</Label>
                <div className="text-xl font-bold">
                  {stats.max ? stats.max.toFixed(2) : "-"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
