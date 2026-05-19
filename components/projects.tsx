"use client"

import type React from "react"

import { useRef } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Github, ArrowRight, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

type ProjectCard = {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  githubUrl: string
  youtubeUrl?: string
  imagePosition?: string
  comingSoon?: boolean
}

const technicalProjects: ProjectCard[] = [
  {
    id: 2,
    title: "Micromouse Maze Navigation Robot",
    description:
      "Autonomous maze-solving robot navigating a 3.6 × 2.4 m arena in under 90 seconds. Integrated LiDAR, IMU, and wheel encoders with BFS path planning and PID control. Top-3 competition finish.",
    image: "/images/micromouse/robot.jpg",
    tags: ["C/C++", "LiDAR", "IMU", "Path Planning", "Embedded Systems"],
    githubUrl: "https://github.com/z5360700/micromouse-from2024",
  },
  {
    id: 7,
    title: "5-Motor Robotic Rubik's Cube Solver",
    description:
      "Solo-built rig that solves any scrambled 3×3 end-to-end. ESP32 drives 5× NEMA 17 steppers through TMC2209 drivers, fed by a Kociemba two-phase solver and a browser-based colour-input UI.",
    image: "/images/rubiks/cube-front.png",
    tags: ["ESP32", "C++/Arduino", "Python", "Kociemba", "TMC2209", "Fusion 360"],
    githubUrl: "#",
    youtubeUrl: "https://www.youtube.com/watch?v=OC9h20jK2XQ",
  },
  {
    id: 3,
    title: "Custom Cooling Funnels for PC Hardware",
    description:
      "Designed and 3D-printed ducted airflow funnels across 3 design iterations. Achieved 7°C reduction in GPU temperatures under full load.",
    image: "/images/cooling/installed.jpg",
    tags: ["Fusion 360", "3D Printing", "PLA", "Thermal Engineering"],
    githubUrl: "#",
  },
  {
    id: 4,
    title: "UR5e Robotic Writing System",
    description:
      "Programmed a UR5e industrial robot for autonomous handwriting, pick-and-place, and orientation adjustment using MATLAB and the RTDE interface. Developed trajectory planning for smooth pen lifts and legible output.",
    image: "/images/ur5e/main-setup.jpg",
    tags: ["MATLAB", "RTDE", "UR5e", "Robotics", "Coordinate Transforms"],
    githubUrl: "#",
  },
  {
    id: 5,
    title: "Cat Door Monitoring System",
    description:
      "ESP32 break-beam monitor for a pet door. Detects movement, filters false triggers, and sends timestamped Telegram alerts.",
    image: "/images/cat-door/v2-system.png",
    tags: ["ESP32", "IoT", "Embedded C", "Telegram API", "Sensors"],
    githubUrl: "#",
  },
]

// Thesis Work — temporarily disabled, re-enable when content is ready
// const thesisProjects = [
//   {
//     id: 8,
//     title: "PVT Calculator Tool",
//     description:
//       "Thesis project — a PVT calculator tool, built in collaboration with CoolSheet.",
//     image: "/placeholder.svg",
//     tags: [],
//     githubUrl: "https://github.com/m-lorusso/PVT-calculator-tool",
//   },
// ]

const handsOnProjects: ProjectCard[] = [
  {
    id: 1,
    title: "Residential Construction & Renovation",
    description:
      "Full residential build completed alongside engineering degree. Structural framing, roofing, plumbing, and electrical from foundation to finish. Managing real deadlines, tradespeople, and physical work while keeping up with coursework built resilience no classroom could.",
    image: "/images/construction/after.jpg",
    tags: ["Construction Management", "Structural", "Electrical", "Plumbing"],
    githubUrl: "#",
  },
  {
    id: 6,
    title: "Custom Watch Build",
    description:
      "Sourced and hand-assembled individual components around Seiko NH35 movement. Precision assembly requiring dust-free environment, component compatibility verification, and steady hands for hand-setting.",
    image: "/images/watch/cover.png",
    imagePosition: "top",
    tags: ["Horology", "Precision Assembly", "Mechanical Engineering", "Component Sourcing"],
    githubUrl: "#",
  },
]

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const router = useRouter()

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`)
  }

  const handleGithubClick = (e: React.MouseEvent, githubUrl: string) => {
    e.stopPropagation()
    window.open(githubUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="projects" className="py-16">
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
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className="overflow-hidden h-full flex flex-col hover-lift cursor-pointer group"
                    onClick={() => !project.comingSoon && handleProjectClick(project.id)}
                  >
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
                      <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-foreground/60 mb-3 flex-grow text-sm leading-relaxed line-clamp-3">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {project.youtubeUrl ? (
                          <>
                            <a
                              href={project.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors duration-300 font-medium text-sm"
                            >
                              <Youtube size={14} />
                              Watch
                            </a>
                            <div className="ml-auto bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors duration-300 flex items-center gap-1 font-medium text-sm">
                              View Details
                              <ArrowRight size={14} />
                            </div>
                          </>
                        ) : project.id === 3 || project.id === 4 ? (
                          <div className="ml-auto bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors duration-300 flex items-center gap-1 font-medium text-sm">
                            View Details
                            <ArrowRight size={14} />
                          </div>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 bg-transparent text-xs px-2 py-1"
                              onClick={(e) => handleGithubClick(e, project.githubUrl)}
                            >
                              <Github size={14} />
                              Code
                            </Button>
                            <div className="ml-auto bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors duration-300 flex items-center gap-1 font-medium text-sm">
                              View Details
                              <ArrowRight size={14} />
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Thesis Work — temporarily hidden, re-enable when content is ready
          <div>
            <h3 className="text-base font-semibold text-foreground/50 uppercase tracking-widest mb-4">Thesis Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {thesisProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className="overflow-hidden h-full flex flex-col hover-lift cursor-pointer group"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className="relative h-64 md:h-72 w-full overflow-hidden bg-muted">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105 duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <CardContent className="flex flex-col flex-grow p-4">
                      <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-foreground/60 mb-3 flex-grow text-sm leading-relaxed line-clamp-3">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 bg-transparent text-xs px-2 py-1"
                          onClick={(e) => handleGithubClick(e, project.githubUrl)}
                        >
                          <Github size={14} />
                          Code
                        </Button>
                        <div className="ml-auto bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors duration-300 flex items-center gap-1 font-medium text-sm">
                          View Details
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          */}

          {/* Hands-On Builds */}
          <div>
            <h3 className="text-base font-semibold text-foreground/50 uppercase tracking-widest mb-4">Hands-On Builds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {handsOnProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className="overflow-hidden h-full flex flex-col hover-lift cursor-pointer group"
                    onClick={() => handleProjectClick(project.id)}
                  >
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
                      <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-foreground/60 mb-3 flex-grow text-sm leading-relaxed line-clamp-3">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        <div className="ml-auto bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors duration-300 flex items-center gap-1 font-medium text-sm">
                          View Details
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
