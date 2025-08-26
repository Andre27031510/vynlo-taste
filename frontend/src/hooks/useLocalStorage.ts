import { useState, useEffect, useCallback } from 'react'

interface UseLocalStorageOptions<T> {
  defaultValue: T
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
  expiration?: number
}

export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T>
) {
  const {
    defaultValue,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    expiration
  } = options

  const getStoredValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key)
      if (item === null) return defaultValue
      const parsed = deserialize(item)
      if (expiration && (parsed as any).timestamp) {
        const now = Date.now()
        if (now - (parsed as any).timestamp > expiration) {
          window.localStorage.removeItem(key)
          return defaultValue
        }
        return (parsed as any).data
      }
      return parsed
    } catch {
      return defaultValue
    }
  }, [key, defaultValue, deserialize, expiration])

  const writeStoredValue = useCallback((value: T) => {
    try {
      let valueToStore: any = value
      if (expiration) valueToStore = { data: value, timestamp: Date.now() }
      window.localStorage.setItem(key, serialize(valueToStore))
    } catch {}
  }, [key, serialize, expiration])

  const [storedValue, setStoredValue] = useState<T>(getStoredValue)

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      writeStoredValue(valueToStore)
      setStoredValue(valueToStore)
    } catch {}
  }, [storedValue, writeStoredValue])

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(defaultValue)
    } catch {}
  }, [key, defaultValue])

  const clearExpired = useCallback(() => {
    if (!expiration) return
    try {
      const keys = Object.keys(window.localStorage)
      keys.forEach(storageKey => {
        try {
          const item = window.localStorage.getItem(storageKey)
          if (item) {
            const parsed = deserialize(item)
            if ((parsed as any).timestamp && Date.now() - (parsed as any).timestamp > expiration) {
              window.localStorage.removeItem(storageKey)
            }
          }
        } catch {}
      })
    } catch {}
  }, [expiration, deserialize])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserialize(e.newValue)
          if (expiration && (newValue as any).timestamp) {
            if (Date.now() - (newValue as any).timestamp <= expiration) {
              setStoredValue((newValue as any).data)
            }
          } else {
            setStoredValue(newValue)
          }
        } catch {}
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, deserialize, expiration])

  useEffect(() => {
    if (!expiration) return
    const interval = setInterval(clearExpired, 60000)
    return () => clearInterval(interval)
  }, [clearExpired, expiration])

  return { value: storedValue, setValue, removeValue, clearExpired }
}