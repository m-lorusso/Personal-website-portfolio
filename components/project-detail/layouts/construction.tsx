"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle2, Ruler } from "lucide-react"
import EnhancedBeforeAfterSlider from "@/components/enhanced-before-after-slider"
import ConstructionSlideshowModal from "@/components/construction-slideshow-modal"
import { ImageGallery } from "@/components/project-detail/image-gallery"
import type { ProjectLayoutProps } from "./types"

// Residential Construction & Renovation (project 1). Owns its slideshow modal —
// the shared lightbox is not used on this page.
export default function ConstructionLayout({ project }: ProjectLayoutProps) {
  const [slideshowOpen, setSlideshowOpen] = useState(false)
  const [slideshowImages, setSlideshowImages] = useState<string[]>([])
  const [slideshowIndex, setSlideshowIndex] = useState(0)
  const [slideshowAltPrefix, setSlideshowAltPrefix] = useState("")

  const openSlideshow = (images: string[], index: number, altPrefix: string) => {
    setSlideshowImages(images)
    setSlideshowIndex(index)
    setSlideshowAltPrefix(altPrefix)
    setSlideshowOpen(true)
  }

  return (
    <div className="space-y-14">
      {/* HERO: open, no card chrome */}
      <section className="py-6 text-center md:py-10">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          {project.title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-foreground/65 md:text-lg">
          Foundation to finish, built alongside engineering.
        </p>

      </section>

      {/* Goal / Challenge / Learnt: simple, personable, no metric filler */}
      <section className="grid grid-cols-1 gap-10 border-y border-border/60 py-10 md:grid-cols-3 md:gap-12 md:divide-x md:divide-border/60 md:py-12">
        {[
          {
            icon: Ruler,
            kicker: "Goal",
            title: "Build a whole house.",
            body: "Frame, roof, electrical, plumbing, kitchen, bath, the finishes. The full thing, not just one trade.",
            accent: "text-sky-400",
          },
          {
            icon: AlertTriangle,
            kicker: "Challenge",
            title: "Do it while studying.",
            body: "Full days on site, nights on coursework. Trades and weather didn't wait, and neither did exams.",
            accent: "text-amber-400",
          },
          {
            icon: CheckCircle2,
            kicker: "Learnt",
            title: "How a build actually goes.",
            body: "How to keep pushing when something goes wrong, and how good it feels to step back and see the whole house finished.",
            accent: "text-emerald-400",
          },
        ].map(({ icon: Icon, kicker, title, body, accent }) => (
          <div key={kicker} className="px-1 md:px-6">
            <div className="mb-4 flex items-center gap-3">
              <Icon className={`h-5 w-5 ${accent}`} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
                {kicker}
              </span>
            </div>
            <h3 className="text-xl font-semibold leading-tight md:text-[1.4rem]">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">{body}</p>
          </div>
        ))}
      </section>

      {/* Before / After: heading + slider, no surrounding box */}
      <section className="space-y-6">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.24em] text-foreground/45">Transformation</div>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">Before and after</h2>
        </div>
        <div className="mx-auto max-w-5xl">
          <EnhancedBeforeAfterSlider
            beforeImage={project.beforeImage || "/placeholder.svg"}
            afterImage={project.image}
            beforeAlt="Before renovation"
            afterAlt="After renovation"
          />
        </div>
      </section>

      {/* Photo Galleries */}
      <div className="space-y-12">
        {project.exteriorGallery && (
          <ImageGallery
            title="Exterior"
            images={project.exteriorGallery}
            onImageClick={openSlideshow}
            altPrefix="Exterior construction photo"
            columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            imageHeight="h-40"
            showNavigation
            unboxed
          />
        )}

        {project.interiorGallery && (
          <ImageGallery
            title="Interior"
            images={project.interiorGallery}
            onImageClick={openSlideshow}
            altPrefix="Interior renovation photo"
            columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            imageHeight="h-40"
            showNavigation
            unboxed
          />
        )}

        {project.finishedProductGallery && (
          <ImageGallery
            title="Finished"
            images={project.finishedProductGallery}
            onImageClick={openSlideshow}
            altPrefix="Finished home photo"
            columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            imageHeight="h-40"
            showNavigation
            unboxed
          />
        )}

        {project.miscellaneousGallery && (
          <ImageGallery
            title="Process"
            images={project.miscellaneousGallery}
            onImageClick={openSlideshow}
            altPrefix="Construction process photo"
            columns="grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            imageHeight="h-32"
            showNavigation
            unboxed
          />
        )}
      </div>

      {/* Construction Slideshow Modal */}
      <ConstructionSlideshowModal
        images={slideshowImages}
        initialIndex={slideshowIndex}
        isOpen={slideshowOpen}
        onClose={() => setSlideshowOpen(false)}
        altPrefix={slideshowAltPrefix}
      />
    </div>
  )
}
