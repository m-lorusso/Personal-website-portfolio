"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function NavigationHandler() {
  const router = useRouter()

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        // getElementById rather than querySelector — a hash need not be a valid CSS selector
        const element = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }

    // Handle initial load with hash
    let initialHashTimer: ReturnType<typeof setTimeout> | null = null
    if (window.location.hash) {
      initialHashTimer = setTimeout(handleHashChange, 100)
    }

    // Handle browser back/forward navigation
    window.addEventListener("hashchange", handleHashChange)
    window.addEventListener("popstate", handleHashChange)

    return () => {
      if (initialHashTimer) clearTimeout(initialHashTimer)
      window.removeEventListener("hashchange", handleHashChange)
      window.removeEventListener("popstate", handleHashChange)
    }
  }, [router])

  return null
}
