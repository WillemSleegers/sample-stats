"use client"

import { useState, useEffect, useRef } from "react"
import { WebR } from "webr"

let webRInstance: WebR | null = null
let initializationPromise: Promise<WebR> | null = null

/**
 * Initialize the global webR instance (singleton pattern)
 * This ensures we only create one webR instance across the entire app
 */
async function getWebR(): Promise<WebR> {
  if (webRInstance) {
    return webRInstance
  }

  if (!initializationPromise) {
    initializationPromise = (async () => {
      const webR = new WebR()
      await webR.init()
      webRInstance = webR
      return webR
    })()
  }

  return initializationPromise
}

/**
 * Hook to access the webR instance
 * Returns the webR instance and a loading state
 */
export function useWebR() {
  const [webR, setWebR] = useState<WebR | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    getWebR()
      .then((instance) => {
        if (mountedRef.current) {
          setWebR(instance)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mountedRef.current) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      mountedRef.current = false
    }
  }, [])

  return { webR, loading, error }
}
