import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { NavigationHandler } from "@/components/navigation-handler"
import Navbar from "@/components/navbar"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Michael Lo Russo — Engineering Portfolio",
  description: "Engineering portfolio of Michael Lo Russo — design, prototyping, embedded systems, and hands-on builds.",
  icons: {
    icon: "/Favicon - ML.png",
    shortcut: "/Favicon - ML.png",
    apple: "/Favicon - ML.png",
  },
  openGraph: {
    title: "Michael Lo Russo — Engineering Portfolio",
    description: "Engineering portfolio of Michael Lo Russo — design, prototyping, embedded systems, and hands-on builds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael Lo Russo — Engineering Portfolio",
    description: "Engineering portfolio of Michael Lo Russo — design, prototyping, embedded systems, and hands-on builds.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="dns-prefetch" href="//vercel.live" />
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NavigationHandler />
            <Navbar />
            {children}
          </ThemeProvider>
        </Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
