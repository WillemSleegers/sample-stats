import { useState, useRef } from "react"

function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize with value from localStorage if available (client-side only)
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Track if this is the first render to avoid writing during SSR hydration
  const isFirstRender = useRef(true)

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      // Only save to localStorage after the first render (client-side only)
      if (typeof window !== "undefined" && !isFirstRender.current) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }

      // Mark that we've completed the first render
      isFirstRender.current = false
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

export default useLocalStorage