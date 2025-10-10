"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import { FullscreenIcon, PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react"

import { Hero } from "@/components/hero"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/app-sidebar"
import { Histogram } from "@/components/graphs/histogram"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SettingsSidebarTrigger } from "@/components/sidebar-trigger"
import { DistributionPicker } from "@/components/distribution-picker"

import { draw } from "@/lib/draw"

import { DEFAULT_PARAMETERS, SPEED_SETTINGS, MAX_SAMPLES } from "@/lib/constants"

import {
  Distribution,
  Parameters,
  SpeedSetting,
  Stats,
} from "@/lib/types"
import { calculateAllStats } from "@/lib/utils"
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
  const [binCount, setBinCount] = useState(10)
  const [useSturges, setUseSturges] = useState(false)
  const [showPdf, setShowPdf] = useState(false)

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
    setParameters(DEFAULT_PARAMETERS[distribution])
  }, [distribution])

  // On samples change
  useEffect(() => {
    samplesRef.current = samples
  }, [samples])

  // Event handlers
  const handleClick = () => {
    setIsSampling((prev) => !prev)
  }

  const handleClear = () => {
    setIsSampling(false)
    setSamples([])
    setStats({})
  }

  const handleUpdateParameters = () => {
    setSamples([])
    setStats({})
    setIsSampling(false)
  }

  const updateStats = useCallback(() => {
    const currentSamples = samplesRef.current
    if (currentSamples.length === 0) return

    // Use optimized single-pass calculation
    const newStats = calculateAllStats(currentSamples)

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
    const newSamples = draw(n, parameters)

    setSamples((prevSamples) => {
      // Stop sampling if we've reached the maximum
      if (prevSamples.length >= MAX_SAMPLES) {
        return prevSamples
      }

      const combined = [...prevSamples, ...newSamples]

      // If this batch would exceed the limit, cap at MAX_SAMPLES
      if (combined.length >= MAX_SAMPLES) {
        return combined.slice(0, MAX_SAMPLES)
      }

      return combined
    })
  }, [parameters, speed])

  // Stop sampling when we reach the limit
  useEffect(() => {
    if (samples.length >= MAX_SAMPLES && isSampling) {
      setIsSampling(false)
    }
  }, [samples.length, isSampling])

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
        setParams={setParameters}
        onUpdateParameters={handleUpdateParameters}
        setSpeed={setSpeed}
        setShowStats={setShowStats}
        binCount={binCount}
        setBinCount={setBinCount}
        useSturges={useSturges}
        setUseSturges={setUseSturges}
        showPdf={showPdf}
        setShowPdf={setShowPdf}
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
          <div className="flex flex-col gap-2 items-stretch justify-center max-w-fit mx-auto">
            <DistributionPicker
              distribution={distribution}
              setDistribution={setDistribution}
            />
            <div className="flex flex-row gap-2">
              <Button className="w-32 justify-start" onClick={handleClick}>
                <div className="w-4 h-4 mr-2">
                  {isSampling ? (
                    <PauseIcon className="h-4 w-4" />
                  ) : (
                    <PlayIcon className="h-4 w-4" />
                  )}
                </div>
                {isSampling ? "Pause" : "Sample"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleClear}
                disabled={samples.length === 0}
              >
                <RotateCcwIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {samples.length > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              Total Samples: {samples.length.toLocaleString()}
            </div>
          )}

          <FullScreen
            handle={fullScreenHandle}
            className="h-[400px] max-w-[600px] mx-auto outline-none"
          >
            <Histogram
              data={samples}
              binCount={useSturges ? Math.ceil(Math.log2(samples.length) + 1) : binCount}
              animationDuration={SPEED_SETTINGS[speed].animationDuration}
              showPdf={showPdf}
              parameters={parameters}
            />
          </FullScreen>

          {showStats && <StatisticsSummary stats={stats} />}
        </div>
      </div>
    </SidebarProvider>
  )
}

export default App
