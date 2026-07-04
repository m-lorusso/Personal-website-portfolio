"use client"

import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

/**
 * Returns false during SSR and the hydration render, true afterwards.
 * The React-endorsed replacement for the `useEffect(() => setMounted(true))`
 * pattern — same behaviour, no cascading-render lint violation.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}
