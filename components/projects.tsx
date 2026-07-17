"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Github, ArrowRight, Youtube, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { projectsData, type Project } from "@/data/projects-data"

// Card content (title, cardDescription, outcome, image, githubUrl) lives in
// data/projects-data.ts. Only the presentation decisions stay here: which
// projects are featured, their order, and which card links a demo video.

// Flagship pair: one machine built end-to-end, one real-world build delivered —
// together they cover the breadth recruiters scan for.
const featuredIds = [7, 1]
const moreIds = [2, 3, 4, 5, 6]

// Cards that link straight to a demo video (only the Rubik's solver today).
// The video itself comes from the project's videoGallery in projects-data.ts.
const cardVideoIds = new Set([7])

// Thesis Work — when content is ready, add a thesisIds list here and render
// a third grid with ProjectCardItem, mirroring the sections below.

const cardsFor = (ids: number[]): Project[] =>
  ids
    .map((id) => projectsData.find((p) => p.id === id))
    .filter((p): p is Project => p !== undefined)

const featuredProjects = cardsFor(featuredIds)
const moreProjects = cardsFor(moreIds)

function ProjectCardItem({
  project,
  index,
  isInView,
  featured = false,
}: {
  project: Project
  index: number
  isInView: boolean
  featured?: boolean
}) {
  const cardVideo = cardVideoIds.has(project.id) ? project.videoGallery?.[0] : undefined
  const youtubeUrl = cardVideo ? `https://www.youtube.com/watch?v=${cardVideo.id}` : undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="group relative overflow-hidden h-full flex flex-col hover-lift active:scale-[0.99] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
        <div className={`relative w-full overflow-hidden bg-muted ${featured ? "h-72 md:h-96" : "h-52 md:h-60"}`}>
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-300"
            style={{ objectPosition: project.imagePosition || "center" }}
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          />
        </div>
        <CardContent className={`flex flex-col flex-grow ${featured ? "p-5" : "p-4"}`}>
          <h3
            className={`font-semibold mb-2 group-hover:text-primary transition-colors duration-300 ${
              featured ? "text-lg md:text-xl" : "text-base"
            }`}
          >
            {/* Stretched link: covers the whole card, keeps inner buttons clickable via z-10 */}
            <Link
              href={`/projects/${project.id}`}
              className="focus-visible:outline-none after:absolute after:inset-0"
            >
              {project.title}
            </Link>
          </h3>
          <p className="text-foreground/60 text-sm leading-relaxed flex-grow">
            {project.cardDescription ?? project.description}
          </p>
          {project.outcome && (
            <p className="mt-3 flex items-start gap-1.5 text-sm font-medium text-primary">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {project.outcome}
            </p>
          )}
          <div className="flex items-center gap-2 pt-4">
            {project.githubUrl && (
              <Button asChild variant="outline" size="sm" className="relative z-10">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github />
                  Code
                </a>
              </Button>
            )}
            {youtubeUrl && (
              <Button asChild variant="outline" size="sm" className="relative z-10">
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                  <Youtube />
                  Watch
                </a>
              </Button>
            )}
            <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
              View details
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Projects</h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-16 h-1 bg-primary mx-auto mb-4 origin-center"
          />
          <p className="max-w-lg mx-auto text-foreground/70 text-sm md:text-base">
            A selection of engineering and hands-on projects I&apos;ve built.
          </p>
        </div>

        <div ref={ref} className="space-y-10">
          {/* Featured — the two strongest projects, larger treatment */}
          <div>
            <h3 className="text-base font-semibold text-foreground/50 uppercase tracking-widest mb-4">Featured</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCardItem key={project.id} project={project} index={index} isInView={isInView} featured />
              ))}
            </div>
          </div>

          {/* More Projects */}
          <div>
            <h3 className="text-base font-semibold text-foreground/50 uppercase tracking-widest mb-4">More Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moreProjects.map((project, index) => (
                <ProjectCardItem key={project.id} project={project} index={index} isInView={isInView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
