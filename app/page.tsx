"use client"

import { useState, useEffect, useRef } from "react"
import useLocalStorage from "@/hooks/use-local-storage"
import { useWebR } from "@/hooks/use-webr"
import { useFullScreenHandle } from "react-full-screen"
import { FullscreenIcon, RotateCcwIcon } from "lucide-react"

import { Hero } from "@/components/hero"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SettingsSidebarTrigger } from "@/components/sidebar-trigger"
import { DistributionPicker } from "@/components/distribution-picker"
import { WebRError } from "@/components/webr-error"
import { SamplingVisualization } from "@/components/sampling-visualization"

import { DEFAULT_PARAMETERS, MAX_SAMPLES } from "@/lib/constants"
import { draw } from "@/lib/draw"

import { Distribution, Parameters, SpeedSetting } from "@/lib/types"

const App = () => {
  // WebR instance
  const { webR, loading: webRLoading, error: webRError } = useWebR()

  // States
  const [distribution, setDistribution] = useState<Distribution>("normal")
  const [parameters, setParameters] = useState<Parameters>(
    DEFAULT_PARAMETERS.normal
  )
  const [isSampling, setIsSampling] = useState(false)
  const [clearTrigger, setClearTrigger] = useState(0)
  const [allSamples, setAllSamples] = useState<number[]>([])

  const isLoadingRef = useRef(false)

  // Persisted UI Preferences
  const [speed, setSpeed] = useLocalStorage<SpeedSetting>("speed", "normal")
  const [showStats, setShowStats] = useLocalStorage<boolean>("showStats", false)
  const [binCount, setBinCount] = useLocalStorage<number>("binCount", 10)
  const [useSturges, setUseSturges] = useLocalStorage<boolean>(
    "useSturges",
    false
  )
  const [showPdf, setShowPdf] = useLocalStorage<boolean>("showPdf", false)

  // Full screen
  const fullScreenHandle = useFullScreenHandle()
  const [supportsFullscreen, setSupportsFullscreen] = useState(false)

  useEffect(() => {
    // Check if fullscreen API is supported
    setSupportsFullscreen(
      document.fullscreenEnabled ||
        (document as any).webkitFullscreenEnabled ||
        false
    )
  }, [])

  // Fetch samples when sampling starts
  useEffect(() => {
    const fetchSamples = async () => {
      if (!webR || !isSampling || isLoadingRef.current) return

      // Only fetch if we don't have samples already
      if (allSamples.length === 0) {
        isLoadingRef.current = true
        const samples = await draw(webR, MAX_SAMPLES, parameters)
        setAllSamples(samples)
        isLoadingRef.current = false
      }
    }

    fetchSamples()
  }, [isSampling, webR, parameters, allSamples.length])

  // On distribution change - reset state
  const handleDistributionChange = (
    value: Distribution | ((prev: Distribution) => Distribution)
  ) => {
    const newDistribution =
      typeof value === "function" ? value(distribution) : value
    setDistribution(newDistribution)
    setIsSampling(false)
    setParameters(DEFAULT_PARAMETERS[newDistribution])
    setAllSamples([])
    setClearTrigger((prev) => prev + 1)
  }

  // Event handlers
  const handleSampleClick = () => {
    setIsSampling((prev) => !prev)
  }

  const handleClear = () => {
    setIsSampling(false)
    setAllSamples([])
    setClearTrigger((prev) => prev + 1)
  }

  const handleFullscreen = () => {
    fullScreenHandle.enter()
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar
        distribution={distribution}
        setParams={setParameters}
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
      <SidebarInset>
        <div className="w-full px-4 pt-4 md:px-6 md:pt-6">
          <div className="flex justify-between items-center mb-8">
            <SettingsSidebarTrigger />
            <div className="flex gap-2">
              {supportsFullscreen && (
                <Button
                  size="icon"
                  variant="ghost"
                  onPointerDown={handleFullscreen}
                  disabled={!isSampling}
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
                  className="w-32"
                  onPointerDown={handleSampleClick}
                  disabled={webRLoading || !!webRError}
                  aria-label={isSampling ? "Pause" : "Sample"}
                >
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
                  onPointerDown={handleClear}
                  aria-label="Clear all samples"
                >
                  <RotateCcwIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <SamplingVisualization
              isSampling={isSampling}
              setIsSampling={setIsSampling}
              allSamples={allSamples}
              parameters={parameters}
              speed={speed}
              showStats={showStats}
              binCount={binCount}
              useSturges={useSturges}
              showPdf={showPdf}
              distribution={distribution}
              fullScreenHandle={fullScreenHandle}
              clearTrigger={clearTrigger}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
