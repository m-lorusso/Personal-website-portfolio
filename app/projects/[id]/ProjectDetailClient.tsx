"use client"

import type { ComponentType } from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ImageLightbox from "@/components/image-lightbox"

import { projectsData, type Project } from "@/data/projects-data"
import WatchBuild from "@/components/project-detail/watch-build"
import type { ProjectLayoutProps } from "@/components/project-detail/layouts/types"
import ConstructionLayout from "@/components/project-detail/layouts/construction"
import MicromouseLayout from "@/components/project-detail/layouts/micromouse"
import CoolingLayout from "@/components/project-detail/layouts/cooling"
import Ur5eLayout from "@/components/project-detail/layouts/ur5e"
import CatDoorLayout from "@/components/project-detail/layouts/cat-door"
import RubiksLayout from "@/components/project-detail/layouts/rubiks"
import DefaultLayout from "@/components/project-detail/layouts/default-layout"

// Each project has its own bespoke layout component; anything without one
// falls back to DefaultLayout (data-driven template). Project 6 (Custom Watch
// Build) is handled separately — it is a self-contained full-page design.
const projectLayouts: Record<number, ComponentType<ProjectLayoutProps>> = {
  1: ConstructionLayout,
  2: MicromouseLayout,
  3: CoolingLayout,
  4: Ur5eLayout,
  5: CatDoorLayout,
  7: RubiksLayout,
}

// ─── Prev/Next project navigation (all detail pages) ─────────────────────
const visibleProjects = projectsData.filter((p) => !p.hidden)

function ProjectFooterNav({ currentId }: { currentId: number }) {
  const index = visibleProjects.findIndex((p) => p.id === currentId)
  if (index === -1) return null

  const previous = visibleProjects[(index - 1 + visibleProjects.length) % visibleProjects.length]
  const next = visibleProjects[(index + 1) % visibleProjects.length]

  return (
    <nav aria-label="More projects" className="mt-14 border-t border-border/60 pt-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href={`/projects/${previous.id}`}
          className="group flex items-center gap-4 rounded-lg border bg-muted/10 p-4 transition-[colors,transform] active:scale-[0.99] hover:border-primary/40 hover:bg-muted/20"
        >
          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image src={previous.image} alt="" fill className="object-cover" sizes="80px" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground/45">
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              Previous project
            </div>
            <div className="mt-1 truncate text-sm font-semibold transition-colors group-hover:text-primary">
              {previous.title}
            </div>
          </div>
        </Link>

        <Link
          href={`/projects/${next.id}`}
          className="group flex items-center gap-4 rounded-lg border bg-muted/10 p-4 transition-[colors,transform] active:scale-[0.99] hover:border-primary/40 hover:bg-muted/20 sm:flex-row-reverse sm:text-right"
        >
          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image src={next.image} alt="" fill className="object-cover" sizes="80px" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground/45 sm:justify-end">
              Next project
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </div>
            <div className="mt-1 truncate text-sm font-semibold transition-colors group-hover:text-primary">
              {next.title}
            </div>
          </div>
        </Link>
      </div>
    </nav>
  )
}

function ProjectDetailClient() {
  const { id } = useParams()
  const projectId = Number.parseInt(Array.isArray(id) ? id[0] : (id as string), 10)
  // Resolved synchronously (not in an effect) so the prerendered HTML contains
  // the full page content rather than a loading state.
  const project: Project | null = projectsData.find((p) => p.id === projectId) ?? null

  // Lightbox state — shared by all layouts via the openLightbox callback.
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxAltPrefix, setLightboxAltPrefix] = useState("")

  useEffect(() => {
    if (!project || !window.location.hash) return

    requestAnimationFrame(() => {
      document.querySelector(window.location.hash)?.scrollIntoView()
    })
  }, [project])

  const openLightbox = (images: string[], index: number, altPrefix: string) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxAltPrefix(altPrefix)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)
  }

  const previousImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)
  }

  if (!project) {
    return (
      <main className="min-h-dvh bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
    )
  }

  // Project 6 (Custom Watch Build) is a self-contained, full-page dark design.
  if (project.id === 6) {
    return <WatchBuild />
  }

  const Layout = projectLayouts[project.id] ?? DefaultLayout

  return (
    <main className="min-h-dvh bg-background pt-24 pb-8">
      <div className="container mx-auto px-3 max-w-7xl">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        <Layout project={project} openLightbox={openLightbox} />

        {/* Prev/Next project navigation */}
        <ProjectFooterNav currentId={project.id} />

        {/* Image Lightbox */}
        <ImageLightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrevious={previousImage}
          altPrefix={lightboxAltPrefix}
        />
      </div>
    </main>
  )
}

export default ProjectDetailClient
