"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Github, ArrowRight, Youtube, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type ProjectCard = {
  id: number
  title: string
  description: string
  outcome: string
  image: string
  githubUrl?: string
  youtubeUrl?: string
  imagePosition?: string
}

const technicalProjects: ProjectCard[] = [
  {
    id: 2,
    title: "Micromouse Maze Navigation Robot",
    description:
      "Autonomous maze-solving robot combining LiDAR, IMU, and wheel encoders with BFS path planning and PID control.",
    outcome: "Top-3 finish — solved the maze in under 90 seconds",
    image: "/images/micromouse/robot.jpg",
    githubUrl: "https://github.com/z5360700/micromouse-from2024",
  },
  {
    id: 7,
    title: "5-Motor Robotic Rubik's Cube Solver",
    description:
      "Solo-built rig where an ESP32 drives five stepper motors, fed by a Kociemba solver and a browser-based colour-input UI.",
    outcome: "Solves any scramble — ~20-move plan computed in under 1 second",
    image: "/images/rubiks/cube-front.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=OC9h20jK2XQ",
  },
  {
    id: 3,
    title: "Custom Cooling Funnels for PC Hardware",
    description:
      "Ducted airflow funnels designed in Fusion 360 and 3D-printed across three iterations to feed intake air straight to the GPU.",
    outcome: "7°C cooler under full load",
    image: "/images/cooling/installed.jpg",
  },
  {
    id: 4,
    title: "UR5e Robotic Writing System",
    description:
      "MATLAB program commanding a UR5e industrial arm over RTDE to write digits and solve long-form math on paper.",
    outcome: "Smooth, legible writing with repeatable positioning",
    image: "/images/ur5e/main-setup.jpg",
  },
  {
    id: 5,
    title: "Cat Door Monitoring System",
    description:
      "ESP32 break-beam monitor for a pet door that debounces false triggers and sends timestamped Telegram alerts.",
    outcome: "Detected an intruder cat within 2 days of deployment",
    image: "/images/cat-door/v2-system.jpg",
  },
]

// Thesis Work — when content is ready, define thesisProjects here and render
// a third grid with ProjectCardItem, mirroring the sections below.

const handsOnProjects: ProjectCard[] = [
  {
    id: 1,
    title: "Residential Construction & Renovation",
    description:
      "Full residential build completed alongside my degree — framing, roofing, plumbing, and electrical from foundation to finish.",
    outcome: "Complete house delivered while studying full-time",
    image: "/images/construction/after.jpg",
  },
  {
    id: 6,
    title: "Custom Watch Build",
    description:
      "Mechanical watch hand-assembled from individually sourced components around a Seiko NH35 movement.",
    outcome: "Runs within NH35 spec — clean, dust-free build",
    image: "/images/watch/cover.png",
    imagePosition: "top",
  },
]

function ProjectCardItem({
  project,
  index,
  isInView,
}: {
  project: ProjectCard
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden h-full flex flex-col hover-lift active:scale-[0.99] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
        <div className="relative h-64 md:h-72 w-full overflow-hidden bg-muted">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-300"
            style={{ objectPosition: project.imagePosition || "center" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <CardContent className="flex flex-col flex-grow p-4">
          <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
            {/* Stretched link: covers the whole card, keeps inner buttons clickable via z-10 */}
            <Link
              href={`/projects/${project.id}`}
              className="focus-visible:outline-none after:absolute after:inset-0"
            >
              {project.title}
            </Link>
          </h3>
          <p className="text-foreground/60 text-sm leading-relaxed flex-grow">{project.description}</p>
          <p className="mt-3 flex items-start gap-1.5 text-sm font-medium text-primary">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {project.outcome}
          </p>
          <div className="flex items-center gap-2 pt-4">
            {project.githubUrl && (
              <Button asChild variant="outline" size="sm" className="relative z-10">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github />
                  Code
                </a>
              </Button>
            )}
            {project.youtubeUrl && (
              <Button asChild variant="outline" size="sm" className="relative z-10">
                <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer">
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
          <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
          <p className="max-w-lg mx-auto text-foreground/70 text-sm md:text-base">
            A selection of engineering and hands-on projects I've built.
          </p>
        </div>

        <div ref={ref} className="space-y-10">
          {/* Technical Projects */}
          <div>
            <h3 className="text-base font-semibold text-foreground/50 uppercase tracking-widest mb-4">Technical Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technicalProjects.map((project, index) => (
                <ProjectCardItem key={project.id} project={project} index={index} isInView={isInView} />
              ))}
            </div>
          </div>

          {/* Hands-On Builds */}
          <div>
            <h3 className="text-base font-semibold text-foreground/50 uppercase tracking-widest mb-4">Hands-On Builds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {handsOnProjects.map((project, index) => (
                <ProjectCardItem key={project.id} project={project} index={index} isInView={isInView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
