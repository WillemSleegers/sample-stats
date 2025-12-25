"use client"

import { useState, useEffect } from "react"
import { WebR } from "webr"

export function useWebR() {
  const [webR, setWebR] = useState<WebR | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initWebR = async () => {
      try {
        const instance = new WebR()
        await instance.init()
        setWebR(instance)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    initWebR()
  }, [])

  return { webR, loading, error }
}
