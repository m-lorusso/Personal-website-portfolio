import type React from "react"

// Per-project metadata (title, description, OG/Twitter image) is generated in
// page.tsx via generateMetadata, which overrides anything set here. This layout
// intentionally sets no metadata so it can't reintroduce stale, generic tags.
export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
