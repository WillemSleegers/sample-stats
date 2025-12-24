import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function WebRError() {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto">
      <AlertTitle>Failed to load WebR</AlertTitle>
      <AlertDescription>
        Please check your internet connection and refresh the page.
      </AlertDescription>
    </Alert>
  )
}
