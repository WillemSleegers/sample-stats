"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import useLocalStorage from "@/hooks/use-local-storage"
import { useWebR } from "@/hooks/use-webr"
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import {
  FullscreenIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
} from "lucide-react"

import { Hero } from "@/components/hero"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/app-sidebar"
import { Histogram } from "@/components/graphs/histogram"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SettingsSidebarTrigger } from "@/components/sidebar-trigger"
import { DistributionPicker } from "@/components/distribution-picker"
import { WebRError } from "@/components/webr-error"

import { draw } from "@/lib/draw"

import {
  DEFAULT_PARAMETERS,
  SPEED_SETTINGS,
  MAX_SAMPLES,
} from "@/lib/constants"

import { Distribution, Parameters, SpeedSetting, Stats } from "@/lib/types"
import { calculateAllStats } from "@/lib/utils"
import { StatisticsSummary } from "@/components/statistics"

const App = () => {
  // WebR instance
  const { webR, loading: webRLoading, error: webRError } = useWebR()

  // States
  const [distribution, setDistribution] = useState<Distribution>("normal")
  const [parameters, setParameters] = useState<Parameters>(
    DEFAULT_PARAMETERS.normal
  )
  const [isSampling, setIsSampling] = useState(false)
  const [samples, setSamples] = useState<number[]>([])
  const [stats, setStats] = useState<Stats>({})
  const [fullScreenEnabled] = useState(
    typeof window !== "undefined" ? window.document.fullscreenEnabled : false
  )

  // Persisted UI Preferences
  const [speed, setSpeed] = useLocalStorage<SpeedSetting>("speed", "normal")
  const [showStats, setShowStats] = useLocalStorage<boolean>("showStats", false)
  const [binCount, setBinCount] = useLocalStorage<number>("binCount", 10)
  const [useSturges, setUseSturges] = useLocalStorage<boolean>(
    "useSturges",
    false
  )
  const [showPdf, setShowPdf] = useLocalStorage<boolean>("showPdf", false)

  // Refs
  const samplingIntervalRef = useRef<ReturnType<typeof setInterval>>(null)
  const statsIntervalRef = useRef<ReturnType<typeof setInterval>>(null)
  const samplesRef = useRef<number[]>([])

  // Full screen
  const fullScreenHandle = useFullScreenHandle()

  // On distribution change - reset state
  const handleDistributionChange = useCallback((value: Distribution | ((prev: Distribution) => Distribution)) => {
    const newDistribution = typeof value === "function" ? value(distribution) : value
    setDistribution(newDistribution)
    setIsSampling(false)
    setSamples([])
    setParameters(DEFAULT_PARAMETERS[newDistribution])
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
    // Parameters updated - no need to clear samples
    // New samples will be drawn from the updated distribution
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

  const addSamples = useCallback(async () => {
    if (!webR) return

    const { n } = SPEED_SETTINGS[speed]
    const newSamples = await draw(webR, n, parameters)

    setSamples((prevSamples) => {
      // Stop sampling if we've reached the maximum
      if (prevSamples.length >= MAX_SAMPLES) {
        // Stop sampling by clearing the interval
        setIsSampling(false)
        return prevSamples
      }

      const combined = [...prevSamples, ...newSamples]

      // If this batch would exceed the limit, cap at MAX_SAMPLES and stop
      if (combined.length >= MAX_SAMPLES) {
        setIsSampling(false)
        return combined.slice(0, MAX_SAMPLES)
      }

      return combined
    })
  }, [webR, parameters, speed])

  // Set intervals for drawing samples and updating statistics
  useEffect(() => {
    if (isSampling && webR) {
      const { interval } = SPEED_SETTINGS[speed]
      samplingIntervalRef.current = setInterval(() => {
        addSamples()
      }, interval)
    }

    return () => {
      if (samplingIntervalRef.current) {
        clearInterval(samplingIntervalRef.current)
        samplingIntervalRef.current = null
      }
    }
  }, [isSampling, addSamples, speed, webR])

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
        speed={speed}
        setSpeed={setSpeed}
        showStats={showStats}
        setShowStats={setShowStats}
        binCount={binCount}
        setBinCount={setBinCount}
        useSturges={useSturges}
        setUseSturges={setUseSturges}
        showPdf={showPdf}
        setShowPdf={setShowPdf}
      />
      <div className="w-full p-4 md:p-6">
        <div className="flex justify-between items-center mb-8">
          <SettingsSidebarTrigger />
          <div className="flex gap-2">
            {fullScreenEnabled && (
              <Button
                size="icon"
                variant="ghost"
                onClick={fullScreenHandle.enter}
                aria-label="Enter fullscreen mode"
              >
                <FullscreenIcon className="text-muted-foreground" />
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
        <div className="space-y-12">
          <Hero />
          {webRError && <WebRError />}
          <div className="flex flex-col gap-2 items-stretch justify-center max-w-fit mx-auto">
            <DistributionPicker
              distribution={distribution}
              setDistribution={handleDistributionChange}
            />
            <div className="flex flex-row gap-2">
              <Button
                className="w-32 justify-start"
                onClick={handleClick}
                disabled={webRLoading || !!webRError}
                aria-label={
                  isSampling
                    ? "Pause sampling"
                    : "Start sampling from distribution"
                }
              >
                <div className="w-4 h-4 mr-2">
                  {isSampling ? (
                    <PauseIcon className="h-4 w-4" />
                  ) : (
                    <PlayIcon className="h-4 w-4" />
                  )}
                </div>
                {webRLoading
                  ? "Loading..."
                  : webRError
                  ? "Error"
                  : isSampling
                  ? "Pause"
                  : "Sample"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleClear}
                disabled={samples.length === 0}
                aria-label="Clear all samples"
              >
                <RotateCcwIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <FullScreen
            handle={fullScreenHandle}
            className="h-100 max-w-150 mx-auto outline-none"
          >
            <div
              role="img"
              aria-label={`Histogram showing ${samples.length.toLocaleString()} samples from ${distribution} distribution${
                showPdf
                  ? " with theoretical probability density curve overlay"
                  : ""
              }`}
            >
              <Histogram
                data={samples}
                binCount={
                  useSturges
                    ? Math.ceil(Math.log2(samples.length) + 1)
                    : binCount
                }
                animationDuration={SPEED_SETTINGS[speed].animationDuration}
                showPdf={showPdf}
                parameters={parameters}
              />
            </div>
          </FullScreen>

          {samples.length >= MAX_SAMPLES && (
            <p className="text-center text-sm text-muted-foreground">
              Maximum sample limit reached ({MAX_SAMPLES.toLocaleString()} samples)
            </p>
          )}

          {showStats && samples.length > 0 && (
            <StatisticsSummary stats={stats} sampleCount={samples.length} />
          )}
        </div>
      </div>
    </SidebarProvider>
  )
}

export default App
