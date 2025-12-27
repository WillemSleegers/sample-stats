"use client"

import { Button } from "@/components/ui/button"

type SamplingButtonProps = {
  isSampling: boolean
  onToggle: () => void
  disabled: boolean
}

export const SamplingButton = ({
  isSampling,
  onToggle,
  disabled,
}: SamplingButtonProps) => {
  return (
    <Button
      className="w-32"
      onClick={onToggle}
      disabled={disabled}
      aria-label={isSampling ? "Pause" : "Sample"}
    >
      {isSampling ? "Pause" : "Sample"}
    </Button>
  )
}
