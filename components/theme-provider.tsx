"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
import { MotionConfig } from "framer-motion"

function ThemeProviderComponent({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {/* reducedMotion="user" disables framer-motion transforms for users with prefers-reduced-motion */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  )
}

export { ThemeProviderComponent as ThemeProvider }
