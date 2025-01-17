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

  const [param1, setParam1] = useState("0")
  const [param2, setParam2] = useState("1")
  const [param3, setParam3] = useState("1")

  const [error, setError] = useState("")

  useEffect(() => {
    if (distribution === "normal") {
      setParam1("0")
      setParam2("1")
      return
    }

    if (distribution === "lognormal") {
      setParam1("0")
      setParam2("1")
      return
    }

    if (distribution === "uniform") {
      setParam1("0")
      setParam2("1")
      return
    }

    if (distribution === "beta") {
      setParam1("1")
      setParam2("1")
      return
    }

    if (distribution === "pert") {
      setParam1("-1")
      setParam2("0")
      setParam3("1")
      return
    }
  }, [distribution, param1, param2, param3])

  const toggleSampling = () => {
    setIsSampling((prev) => !prev)
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (distribution === "normal") {
      setParameters({
        distribution: distribution,
        mean: Number(param1),
        sd: Number(param2),
      })
    } else if (distribution === "lognormal") {
      setParameters({
        distribution: distribution,
        meanlog: Number(param1),
        sdlog: Number(param2),
      })
    } else if (distribution === "uniform") {
      if (Number(param1) > Number(param2)) {
        setError("Minimum must be smaller than maximum")
        return
      } else {
        setParameters({
          distribution: distribution,
          min: Number(param1),
          max: Number(param2),
        })
      }
    } else if (distribution === "beta") {
      setParameters({
        distribution: distribution,
        alpha: Number(param1),
        beta: Number(param2),
      })
    } else if (distribution === "pert") {
      if (
        !(Number(param1) < Number(param2) && Number(param2) < Number(param3))
      ) {
        setError(
          "Minimum must be smaller than mode and mode must be smaller than maximum"
        )
        return
      } else {
        setParameters({
          distribution: distribution,
          min: Number(param1),
          mode: Number(param2),
          max: Number(param3),
        })
      }
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
            </SelectContent>
          </Select>
          <p className="text-[0.8rem] text-muted-foreground">
            This will determine which parameters you will need to set.
          </p>
        </div>

        {distribution === "normal" && (
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="normalMean">Mean</Label>
              <Input
                id="normalMean"
                value={param1}
                onChange={(e) => setParam1(e.target.value)}
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="normalSd">Standard Deviation</Label>
              <Input
                id="normalSd"
                value={param2}
                onChange={(e) => setParam2(e.target.value)}
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
              <Label htmlFor="lognormalMeanlog">Mean (log)</Label>
              <Input
                id="lognormalMeanlog"
                value={param1}
                onChange={(event) => setParam1(event.target.value)}
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lognormalSdlog">Standard Deviation (log)</Label>
              <Input
                id="lognormalSdlog"
                value={param2}
                onChange={(event) => setParam2(event.target.value)}
                type="number"
                min={0}
                step="any"
                required
              />
            </div>
          </div>
        )}

        {distribution === "uniform" && (
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="uniformMin">Minimum</Label>
              <Input
                id="uniformMin"
                value={param1}
                onChange={(event) => setParam1(event.target.value)}
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uniformMax">Maximum</Label>
              <Input
                id="uniformMax"
                value={param2}
                onChange={(event) => setParam2(event.target.value)}
                type="number"
                required
              />
            </div>
          </div>
        )}

        {distribution === "beta" && (
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="betaAlpha">Alpha</Label>
              <Input
                id="betaAlpha"
                value={param1}
                onChange={(event) => setParam1(event.target.value)}
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="betaBeta">Beta</Label>
              <Input
                id="betaBeta"
                value={param2}
                onChange={(event) => setParam2(event.target.value)}
                type="number"
                required
              />
            </div>
          </div>
        )}

        {distribution === "pert" && (
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label htmlFor="pertMin">Min</Label>
              <Input
                id="pertMin"
                value={param1}
                onChange={(event) => setParam1(event.target.value)}
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pertMode">Mode</Label>
              <Input
                id="pertMode"
                value={param2}
                onChange={(event) => setParam2(event.target.value)}
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pertMax">Max</Label>
              <Input
                id="pertMax"
                value={param3}
                onChange={(event) => setParam3(event.target.value)}
                type="number"
                required
              />
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
