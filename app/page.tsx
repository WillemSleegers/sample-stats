"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import { FullscreenIcon, PauseIcon, PlayIcon } from "lucide-react"

import { Hero } from "@/components/hero"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/app-sidebar"
import { Histogram } from "@/components/graphs/histogram"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SettingsSidebarTrigger } from "@/components/sidebar-trigger"
import { DistributionPicker } from "@/components/distribution-picker"

import { draw } from "@/lib/draw"

import { DEFAULT_PARAMETERS, SPEED_SETTINGS } from "@/lib/constants"

import { Distribution, Parameters, SpeedSetting, Stats } from "@/lib/types"
import { max, mean, min, quantile } from "@/lib/utils"
import { StatisticsSummary } from "@/components/statistics"

const App = () => {
  // States
  const [distribution, setDistribution] = useState<Distribution>("normal")
  const [parameters, setParameters] = useState<Parameters>(
    DEFAULT_PARAMETERS.normal
  )
  const [isSampling, setIsSampling] = useState(false)
  const [speed, setSpeed] = useState<SpeedSetting>("normal")
  const [samples, setSamples] = useState<number[]>([])
  const [stats, setStats] = useState<Stats>({})
  const [showStats, setShowStats] = useState(false)

  // Refs
  const samplingIntervalRef = useRef<ReturnType<typeof setInterval>>(null)
  const statsIntervalRef = useRef<ReturnType<typeof setInterval>>(null)
  const samplesRef = useRef<number[]>([])

  // Full screen
  const [fullScreenEnabled, setFullScreenEnabled] = useState(true)
  const fullScreenHandle = useFullScreenHandle()

  // Setup
  useEffect(() => {
    setFullScreenEnabled(window.document.fullscreenEnabled)
  }, [])

  // On distribution change
  useEffect(() => {
    setIsSampling(false)
    setSamples([]) // Clear samples
    setParameters(DEFAULT_PARAMETERS[distribution]) // Set default parameters
  }, [distribution])

  // On samples change
  useEffect(() => {
    samplesRef.current = samples
  }, [samples])

  // Event handlers
  const handleClick = () => {
    setIsSampling((prev) => !prev)
  }

  const updateStats = useCallback(() => {
    const currentSamples = samplesRef.current
    const quantiles = quantile(currentSamples, [0.1, 0.5, 0.9])

    const newStats = {
      p10: quantiles[0],
      p50: quantiles[1],
      p90: quantiles[2],
      min: min(currentSamples),
      max: max(currentSamples),
      mean: mean(currentSamples),
    }

    // Set new stats, if one of them has changed
    setStats((prevStats) => {
      const hasChanged =
        prevStats.p10 !== newStats.p10 ||
        prevStats.p50 !== newStats.p50 ||
        prevStats.p90 !== newStats.p90 ||
        prevStats.min !== newStats.min ||
        prevStats.max !== newStats.max ||
        prevStats.mean !== newStats.mean
      return hasChanged ? newStats : prevStats
    })
  }, [])

  const addSamples = useCallback(() => {
    const { n } = SPEED_SETTINGS[speed]
    const newSamples = draw(n, distribution, parameters)

    setSamples((prevSamples) => [...prevSamples, ...newSamples])
  }, [distribution, parameters, speed])

  // Set intervals for drawing samples and updating statistics
  useEffect(() => {
    if (isSampling) {
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

  useEffect(() => {
    if (isSampling && showStats) {
      const interval = 1000
      statsIntervalRef.current = setInterval(updateStats, interval)
    }

    return () => {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current)
        statsIntervalRef.current = null
      }
    }
  }, [isSampling, showStats, updateStats])

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar
        distribution={distribution}
        params={parameters}
        setParams={setParameters}
        setSpeed={setSpeed}
        setShowStats={setShowStats}
      />
      <div className="w-full p-2 mb-16">
        <div className="p-2 flex justify-between">
          <SettingsSidebarTrigger className="size-9" />
          <div className="space-x-2">
            {fullScreenEnabled && (
              <Button
                size="icon"
                variant="ghost"
                onClick={fullScreenHandle.enter}
              >
                <FullscreenIcon />
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
        <div className="space-y-8">
          <Hero />
          <div className="flex flex-row gap-2 items-end justify-center">
            <DistributionPicker
              distribution={distribution}
              setDistribution={setDistribution}
            />
            <Button className="w-32" onClick={handleClick}>
              {isSampling ? (
                <PauseIcon className="mr-2 h-4 w-4" />
              ) : (
                <PlayIcon className="mr-2 h-4 w-4" />
              )}
              {isSampling ? "Pause" : "Sample"}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            Total Samples: {samples.length}
          </div>

          <FullScreen
            handle={fullScreenHandle}
            className="h-[400px] max-w-[600px] mx-auto"
          >
            <Histogram data={samples} binCount={10} />
          </FullScreen>

          {showStats && <StatisticsSummary stats={stats} />}
        </div>
      </div>
    </SidebarProvider>
  )
}

export default App
