import type { Project } from "@/data/projects-data"

// Shared contract for the per-project detail layouts. The parent
// ProjectDetailClient owns the lightbox; layouts open it via this callback.
export interface ProjectLayoutProps {
  project: Project
  openLightbox: (images: string[], index: number, altPrefix: string) => void
}
