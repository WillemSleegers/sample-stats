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
import { useEffect, useState } from "react"
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
  const [distribution, setDistribution] = useState<Distribution>("normal")
  const [params, setParams] = useState<Parameters>({
    distribution: "normal",
    mean: 0,
    sd: 1,
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (distribution === "normal") {
      setParams({
        distribution: "normal",
        mean: 0,
        sd: 1,
      })
      return
    }

    if (distribution === "lognormal") {
      setParams({
        distribution: "lognormal",
        meanlog: 0,
        sdlog: 1,
      })
      return
    }

    if (distribution === "uniform") {
      setParams({
        distribution: "uniform",
        min: 0,
        max: 1,
      })
      return
    }

    if (distribution === "beta") {
      setParams({
        distribution: "beta",
        alpha: 1,
        beta: 1,
      })
      return
    }

    if (distribution === "pert") {
      setParams({
        distribution: "pert",
        min: 5,
        mode: 10,
        max: 20,
      })
      return
    }

    if (distribution === "metalog") {
      setParams({
        distribution: "metalog",
        p10: 5,
        p50: 10,
        p90: 20,
      })
      return
    }
  }, [distribution])

  const toggleSampling = () => {
    setIsSampling((prev) => !prev)
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (params.distribution === "normal") {
      setParameters(params)
    } else if (params.distribution === "lognormal") {
      setParameters(params)
    } else if (params.distribution === "uniform") {
      if (params.min > params.max) {
        setError("Minimum must be smaller than maximum")
        return
      } else {
        setParameters(params)
      }
    } else if (params.distribution === "beta") {
      setParameters(params)
    } else if (params.distribution === "pert") {
      if (!(params.min < params.mode && params.mode < params.max)) {
        setError(
          "Minimum must be smaller than mode and mode must be smaller than maximum"
        )
        return
      } else {
        setParameters(params)
      }
    } else if (params.distribution === "metalog") {
      if (params.p10 >= params.p50) {
        setError(
          "The value for the 10th percentile must be smaller than the value for the 50th percentile"
        )
        return
      }
      if (params.p90 <= params.p50) {
        setError(
          "The value for the 90th percentile must be larger than the value for the 50th percentile"
        )
        return
      }
      if (params.lower) {
        if (params.lower >= params.p10) {
          setError(
            "Lower bound must be smaller than the value for the 10th percentile"
          )
          return
        }
      }
      if (params.upper) {
        if (params.upper <= params.p90) {
          setError(
            "Upper bound must be larger than the value for the 90th percentile"
          )
          return
        }
      }
      setParameters(params)
    }

    setError("")
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
              <SelectItem value="metalog">Metalog</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[0.8rem] text-muted-foreground">
            This will determine which parameters you will need to set.
          </p>
        </div>

        {params.distribution === "normal" && (
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="normalMean">Mean</Label>
              <Input
                id="normalMean"
                defaultValue={params.mean}
                onChange={(e) =>
                  setParams({
                    ...params,
                    mean: Number(e.target.value),
                  })
                }
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="normalSd">Standard Deviation</Label>
              <Input
                id="normalSd"
                defaultValue={params.sd}
                onChange={(e) =>
                  setParams({
                    ...params,
                    sd: Number(e.target.value),
                  })
                }
                type="number"
                min={0}
                step="any"
                required
              />
            </div>
          </div>
        )}

        {params.distribution === "lognormal" && (
          <div className="flex gap-4 flex-wrap">
            <div className="space-y-2">
              <Label htmlFor="lognormalMeanlog">Mean (log)</Label>
              <Input
                id="lognormalMeanlog"
                defaultValue={params.meanlog}
                onChange={(e) =>
                  setParams({
                    ...params,
                    meanlog: Number(e.target.value),
                  })
                }
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lognormalSdlog">Standard Deviation (log)</Label>
              <Input
                id="lognormalSdlog"
                defaultValue={params.sdlog}
                onChange={(e) =>
                  setParams({
                    ...params,
                    sdlog: Number(e.target.value),
                  })
                }
                type="number"
                min={0}
                step="any"
                required
              />
            </div>
          </div>
        )}

        {params.distribution === "uniform" && (
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="uniformMin">Minimum</Label>
              <Input
                id="uniformMin"
                defaultValue={params.min}
                onChange={(e) =>
                  setParams({
                    ...params,
                    min: Number(e.target.value),
                  })
                }
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uniformMax">Maximum</Label>
              <Input
                id="uniformMax"
                defaultValue={params.max}
                onChange={(e) =>
                  setParams({
                    ...params,
                    max: Number(e.target.value),
                  })
                }
                type="number"
                required
              />
            </div>
          </div>
        )}

        {params.distribution === "beta" && (
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="betaAlpha">Alpha</Label>
              <Input
                id="betaAlpha"
                defaultValue={params.alpha}
                onChange={(e) =>
                  setParams({
                    ...params,
                    alpha: Number(e.target.value),
                  })
                }
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="betaBeta">Beta</Label>
              <Input
                id="betaBeta"
                defaultValue={params.beta}
                onChange={(e) =>
                  setParams({
                    ...params,
                    beta: Number(e.target.value),
                  })
                }
                type="number"
                required
              />
            </div>
          </div>
        )}

        {params.distribution === "pert" && (
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="pertMin">Min</Label>
              <Input
                id="pertMin"
                defaultValue={params.min}
                onChange={(e) =>
                  setParams({
                    ...params,
                    min: Number(e.target.value),
                  })
                }
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pertMode">Mode</Label>
              <Input
                id="pertMode"
                defaultValue={params.mode}
                onChange={(e) =>
                  setParams({
                    ...params,
                    mode: Number(e.target.value),
                  })
                }
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pertMax">Max</Label>
              <Input
                id="pertMax"
                defaultValue={params.max}
                onChange={(e) =>
                  setParams({
                    ...params,
                    max: Number(e.target.value),
                  })
                }
                type="number"
                required
              />
            </div>
          </div>
        )}

        {params.distribution === "metalog" && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="space-y-2">
                <Label htmlFor="metalogP10">P10</Label>
                <Input
                  id="metalogP10"
                  defaultValue={params.p10}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      p10: Number(e.target.value),
                    })
                  }
                  type="number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metalogP50">P50</Label>
                <Input
                  id="metalogP50"
                  defaultValue={params.p50}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      p50: Number(e.target.value),
                    })
                  }
                  type="number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metalogP90">P90</Label>
                <Input
                  id="metalogP90"
                  defaultValue={params.p90}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      p90: Number(e.target.value),
                    })
                  }
                  type="number"
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="space-y-2">
                <Label htmlFor="metalogLower">Lower bound</Label>
                <Input
                  id="metalogLower"
                  onChange={(e) =>
                    setParams({
                      ...params,
                      lower: Number(e.target.value),
                    })
                  }
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metalogUpper">Upper bound</Label>
                <Input
                  id="metalogUpper"
                  onChange={(e) =>
                    setParams({
                      ...params,
                      upper: Number(e.target.value),
                    })
                  }
                  type="number"
                />
              </div>
            </div>
          </div>
        )}

        {error.length > 0 && (
          <div className="text-sm text-destructive">{error}</div>
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
              setError("")
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
