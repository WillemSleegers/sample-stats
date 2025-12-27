"use client"

import { useState, useRef, useEffect } from "react"
import { Histogram } from "@/components/graphs/histogram"
import { StatisticsSummary } from "@/components/statistics"
import { FullScreen, FullScreenHandle } from "react-full-screen"
import { Parameters, SpeedSetting, Stats, Distribution } from "@/lib/types"
import { calculateAllStats } from "@/lib/utils"
import { SPEED_SETTINGS, MAX_SAMPLES } from "@/lib/constants"

type SamplingVisualizationProps = {
  isSampling: boolean
  setIsSampling: (value: boolean) => void
  allSamples: number[]
  parameters: Parameters
  speed: SpeedSetting
  showStats: boolean
  binCount: number
  useSturges: boolean
  showPdf: boolean
  distribution: Distribution
  fullScreenHandle: FullScreenHandle
  clearTrigger?: number
}

export const SamplingVisualization = ({
  isSampling,
  setIsSampling,
  allSamples,
  parameters,
  speed,
  showStats,
  binCount,
  useSturges,
  showPdf,
  distribution,
  fullScreenHandle,
  clearTrigger,
}: SamplingVisualizationProps) => {
  const [displayedCount, setDisplayedCount] = useState(0)
  const [stats, setStats] = useState<Stats>({})

  const animationFrameRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)
  const lastStatsUpdateRef = useRef<number>(0)

  // Clear displayed count when clearTrigger changes
  useEffect(() => {
    setDisplayedCount(0)
    setStats({})
  }, [clearTrigger])

  const updateStats = () => {
    if (displayedCount === 0) return

    const currentSamples = allSamples.slice(0, displayedCount)
    const newStats = calculateAllStats(currentSamples)
    setStats(newStats)
  }

  // Progressively display samples using requestAnimationFrame
  useEffect(() => {
    if (!isSampling || allSamples.length === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      return
    }

    const { interval } = SPEED_SETTINGS[speed]
    lastUpdateTimeRef.current = performance.now()
    lastStatsUpdateRef.current = performance.now()

    const animate = (currentTime: number) => {
      const timeSinceLastUpdate = currentTime - lastUpdateTimeRef.current
      const timeSinceLastStats = currentTime - lastStatsUpdateRef.current

      // Update displayed count
      if (timeSinceLastUpdate >= interval) {
        setDisplayedCount((prev) => {
          const next = prev + 1
          if (next >= MAX_SAMPLES) {
            setIsSampling(false)
            return MAX_SAMPLES
          }
          return next
        })
        lastUpdateTimeRef.current = currentTime
      }

      // Update statistics every 1000ms
      if (showStats && timeSinceLastStats >= 1000) {
        updateStats()
        lastStatsUpdateRef.current = currentTime
      }

      if (displayedCount < MAX_SAMPLES) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isSampling, allSamples.length, speed, showStats, displayedCount, setIsSampling])

  const displayedSamples = allSamples.slice(0, displayedCount)

  return (
    <>
      <FullScreen
        handle={fullScreenHandle}
        className="h-100 max-w-150 mx-auto outline-none fullscreen:h-screen fullscreen:max-w-none fullscreen:flex fullscreen:items-center fullscreen:justify-center fullscreen:bg-background"
      >
        <div
          role="img"
          aria-label={`Histogram showing ${displayedCount.toLocaleString()} samples from ${distribution} distribution${
            showPdf ? " with theoretical probability density curve overlay" : ""
          }`}
          className="h-full w-full"
        >
          <Histogram
            data={displayedSamples}
            binCount={
              useSturges ? Math.ceil(Math.log2(displayedCount) + 1) : binCount
            }
            animationDuration={0}
            showPdf={showPdf}
            parameters={parameters}
          />
        </div>
      </FullScreen>

      {displayedCount >= MAX_SAMPLES && (
        <p className="text-center text-sm text-muted-foreground">
          Maximum sample limit reached ({MAX_SAMPLES.toLocaleString()} samples)
        </p>
      )}

      {showStats && displayedCount > 0 && (
        <StatisticsSummary stats={stats} sampleCount={displayedCount} />
      )}
    </>
  )
}
