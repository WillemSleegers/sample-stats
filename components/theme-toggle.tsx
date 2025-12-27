"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    const themes = ["light", "dark", "system"] as const
    const currentIndex = themes.indexOf(theme as typeof themes[number])
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <Button variant="ghost" size="icon" onPointerDown={cycleTheme}>
      {theme === "light" && (
        <Sun className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
      )}
      {theme === "dark" && (
        <Moon className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
      )}
      {theme === "system" && (
        <Monitor className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
      )}
      <span className="sr-only">Toggle theme (currently {theme})</span>
    </Button>
  )
}
