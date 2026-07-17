"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

// Keep in sync with the viewport.themeColor export in app/layout.tsx, which
// covers SSR/first paint via prefers-color-scheme media queries.
const THEME_COLORS = { light: "#f9fafb", dark: "#09090b" } as const

/**
 * The viewport themeColor metas only follow the *system* colour scheme, so a
 * manual theme toggle would leave the mobile address bar tinted for the wrong
 * theme. This rewrites the meta content to match the resolved theme.
 */
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", THEME_COLORS[resolvedTheme]))
  }, [resolvedTheme])

  return null
}
