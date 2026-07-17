import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeColorSync } from "@/components/theme-color-sync"
import { Suspense } from "react"
import { NavigationHandler } from "@/components/navigation-handler"
import Navbar from "@/components/navbar"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { EMAIL, GITHUB_URL, LINKEDIN_URL, SITE_NAME, getSiteUrl } from "@/lib/site"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const siteUrl = getSiteUrl()

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: siteUrl,
  jobTitle: "Mechatronics Engineering Student",
  affiliation: { "@type": "CollegeOrUniversity", name: "UNSW Sydney" },
  address: { "@type": "PostalAddress", addressLocality: "Sydney", addressCountry: "AU" },
  email: `mailto:${EMAIL}`,
  sameAs: [LINKEDIN_URL, GITHUB_URL],
}

// Tints the mobile browser chrome (address bar) to match the active theme.
// Covers SSR/system theme; ThemeColorSync corrects it after a manual toggle.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Michael Lo Russo | Engineering Portfolio",
  description: "Engineering portfolio of Michael Lo Russo: design, prototyping, embedded systems, and hands-on builds.",
  // Pages that define their own metadata (e.g. project pages) must also set
  // their own canonical — alternates is replaced, not merged, per segment.
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icon-32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Michael Lo Russo | Engineering Portfolio",
    description: "Engineering portfolio of Michael Lo Russo: design, prototyping, embedded systems, and hands-on builds.",
    type: "website",
    url: siteUrl,
    siteName: "Michael Lo Russo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael Lo Russo | Engineering Portfolio",
    description: "Engineering portfolio of Michael Lo Russo: design, prototyping, embedded systems, and hands-on builds.",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ThemeColorSync />
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
