"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "next-themes"
import { Label } from "./ui/label"

export const SelectTheme = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-2">
      <Label htmlFor="theme">Theme</Label>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger id="theme" className="min-w-25 bg-background">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
