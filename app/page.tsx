"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { FullScreen, useFullScreenHandle } from "react-full-screen"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Histogram } from "@/components/histogram"
import { ThemeToggle } from "@/components/theme-toggle"
import { DistributionForm } from "@/components/distribution-form"

import { draw } from "@/lib/draw"
import { Parameters } from "@/lib/types"
import { SPEED_SETTINGS, SpeedSetting } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FullscreenIcon } from "lucide-react"

const StatisticalSampling = () => {
  const [parameters, setParameters] = useState<Parameters>({
    distribution: "normal",
    mean: 0,
    sd: 1,
  })
  const [samples, setSamples] = useState<number[]>([])
  const [isSampling, setIsSampling] = useState(false)
  const [stats, setStats] = useState({ p10: 0, p50: 0, p90: 0 })

  const [speed, setSpeed] = useState<SpeedSetting>("normal")
  const [binCount, setBinCount] = useState(20)

  const samplingIntervalRef = useRef<ReturnType<typeof setInterval>>(null)

  const handle = useFullScreenHandle()

  const updateStats = useCallback((newSamples: number[]) => {
    if (newSamples.length === 0) return

    const sorted = [...newSamples].sort((a, b) => a - b)
    const p10Index = Math.floor(sorted.length * 0.1)
    const p50Index = Math.floor(sorted.length * 0.5)
    const p90Index = Math.floor(sorted.length * 0.9)

    setStats({
      p10: sorted[p10Index] || 0,
      p50: sorted[p50Index] || 0,
      p90: sorted[p90Index] || 0,
    })
  }, [])

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
          <div className="bg-card p-4 border rounded-xl flex-grow space-y-4 min-w-48">
            <div className="space-y-2">
              <Label htmlFor="speed">Speed</Label>
              <Select
                onValueChange={(e: SpeedSetting) => {
                  setSpeed(e)
                }}
                defaultValue="normal"
              >
                <SelectTrigger id="speed">
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
                value={binCount}
                onChange={(event) => setBinCount(Number(event.target.value))}
                type="number"
                min={10}
                max={100}
              />
            </div>
          </div>
        </div>

        <div className="border rounded-xl flex flex-col flex-grow justify-between p-4 gap-4">
          <div className="flex justify-between align-middle">
            <div className="text-sm text-muted-foreground text-center">
              Total Samples: {samples.length}
            </div>
            <Button size="icon" variant="ghost" onClick={handle.enter}>
              <FullscreenIcon />
            </Button>
          </div>

          <FullScreen handle={handle} className="h-[450px]">
            <Histogram data={samples} binCount={binCount} />
          </FullScreen>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Label>10th Percentile</Label>
              <div className="text-xl font-bold">{stats.p10.toFixed(2)}</div>
            </div>
            <div>
              <Label>50th Percentile</Label>
              <div className="text-xl font-bold">{stats.p50.toFixed(2)}</div>
            </div>
            <div>
              <Label>90th Percentile</Label>
              <div className="text-xl font-bold">{stats.p90.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticalSampling
