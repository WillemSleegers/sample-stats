import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type WebRErrorProps = {
  error: Error
}

export function WebRError({ error }: WebRErrorProps) {
  console.log(error)
  return (
    <Alert variant="destructive" className="max-w-md mx-auto">
      <AlertTitle>Failed to load WebR</AlertTitle>
      <AlertDescription>
        Please check your internet connection and refresh the page.
      </AlertDescription>
    </Alert>
  )
}
