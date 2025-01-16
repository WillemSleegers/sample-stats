"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PauseIcon, PlayIcon, RefreshCwIcon } from "lucide-react"
import { Distribution, Parameters } from "@/lib/types"
import { useState } from "react"
import { Label } from "./ui/label"

type DistributionFormProps = {
  setParameters: React.Dispatch<React.SetStateAction<Parameters>>
  isSampling: boolean
  setIsSampling: React.Dispatch<React.SetStateAction<boolean>>
  resetSampling: () => void
}

export const DistributionForm = ({
  setParameters,
  isSampling,
  setIsSampling,
  resetSampling,
}: DistributionFormProps) => {
  const [error, setError] = useState("")
  const [distribution, setDistribution] = useState<Distribution>("normal")
  const [mean, setMean] = useState("0")
  const [sd, setSd] = useState("1")
  const [meanlog, setMeanlog] = useState("0")
  const [sdlog, setSdlog] = useState("1")
  const [min, setMin] = useState("0")
  const [max, setMax] = useState("1")

  const toggleSampling = () => {
    setIsSampling((prev) => !prev)
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (distribution === "normal") {
      setParameters({
        distribution: distribution,
        mean: Number(mean),
        sd: Number(sd),
      })
    } else if (distribution === "lognormal") {
      setParameters({
        distribution: distribution,
        meanlog: Number(meanlog),
        sdlog: Number(sdlog),
      })
    } else if (distribution === "uniform") {
      if (min > max) {
        setError("Minimum must be smaller than maximum")
        return
      } else {
        setError("")
        setParameters({
          distribution: distribution,
          min: Number(min),
          max: Number(max),
        })
      }
    }

    toggleSampling()
  }

  return (
    <div className="space-y-8 md:max-w-xs border rounded-xl p-3 bg-card">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="distribution">Distribution</Label>
          <Select
            value={distribution}
            onValueChange={(value: Distribution) => setDistribution(value)}
          >
            <SelectTrigger>
              <SelectValue id="distribution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="lognormal">Log-normal</SelectItem>
              <SelectItem value="uniform">Uniform</SelectItem>
              <SelectItem value="beta">Beta</SelectItem>
              <SelectItem value="pert">PERT</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[0.8rem] text-muted-foreground">
            Choose the distribution you want to sample from. This will determine
            which parameters you will need to set.
          </p>
        </div>

        {distribution === "normal" && (
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="mean">Mean</Label>
              <Input
                id="mean"
                value={mean}
                onChange={(e) => setMean(e.target.value)}
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sd">Standard Deviation</Label>
              <Input
                id="sd"
                value={sd}
                onChange={(e) => setSd(e.target.value)}
                type="number"
                min={0}
                step="any"
                required
              />
            </div>
          </div>
        )}

        {distribution === "lognormal" && (
          <div className="flex gap-4 flex-wrap">
            <div className="space-y-2">
              <Label htmlFor="meanlog">Mean (log)</Label>
              <Input
                id="meanlog"
                value={meanlog}
                onChange={(event) => setMeanlog(event.target.value)}
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sdlog">Standard Deviation (log)</Label>
              <Input
                id="sdlog"
                value={sdlog}
                onChange={(event) => setSdlog(event.target.value)}
                type="number"
                min={0}
                step="any"
                required
              />
            </div>
          </div>
        )}

        {distribution === "uniform" && (
          <div className="space-y-2">
            <div className="flex gap-4">
              <div className="space-y-2">
                <Label htmlFor="min">Minimum</Label>
                <Input
                  id="min"
                  value={min}
                  onChange={(event) => setMin(event.target.value)}
                  type="number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Maximum</Label>
                <Input
                  id="max"
                  value={max}
                  onChange={(event) => setMax(event.target.value)}
                  type="number"
                  required
                />
              </div>
            </div>
            {error.length > 0 && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>
        )}

        <div className="flex space-x-2">
          <Button type="submit" className="min-w-32">
            {isSampling ? (
              <PauseIcon className="mr-2 h-4 w-4" />
            ) : (
              <PlayIcon className="mr-2 h-4 w-4" />
            )}
            {isSampling ? "Pause" : "Sample"}
          </Button>
          <Button
            variant="outline"
            onClick={(event) => {
              event.preventDefault()
              resetSampling()
            }}
          >
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </form>
    </div>
  )
}
