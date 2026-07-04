"use client"

import { useEffect } from "react"

/**
 * Locks body scroll while `locked` is true (e.g. an open modal/lightbox),
 * restoring the previous overflow value on close/unmount.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}
