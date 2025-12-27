import { SettingsIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useSidebar } from "./ui/sidebar"
import { cn } from "@/lib/utils"

export function SettingsSidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    toggleSidebar()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault() // Prevent mousedown from firing after touch
    toggleSidebar()
  }

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onMouseDown={handleClick}
      onTouchStart={handleTouchStart}
      {...props}
    >
      <SettingsIcon className="text-muted-foreground" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
