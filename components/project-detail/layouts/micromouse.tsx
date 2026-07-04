"use client"

import Image from "next/image"
import { Cpu, Gauge, Monitor, Play, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import GithubIcon from "@/components/icons/github"
import type { ProjectLayoutProps } from "./types"

// Micromouse Maze Navigation Robot (project 2)
export default function MicromouseLayout({ project, openLightbox }: ProjectLayoutProps) {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-xl border bg-[#05070b] text-white">
        <div className="absolute inset-0 micromouse-maze-bg opacity-80" aria-hidden="true" />
        <div className="relative grid grid-cols-1 gap-8 p-5 md:p-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-cyan-300">Maze telemetry</div>
            <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Micromouse maze navigation robot
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
              Autonomous maze-solving robot using LiDAR, IMU, wheel encoders, PID control, and path planning to map and navigate a maze in real time.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { label: "Finish", value: "Top-3" },
                { label: "Planner", value: "BFS" },
                { label: "Control", value: "PID" },
              ].map((item) => (
                <div key={item.label} className="rounded-md border border-white/10 bg-white/[0.06] p-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">{item.label}</div>
                  <div className="mt-1 text-lg font-bold">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.githubUrl && (
                <Button asChild size="sm" className="rounded-md">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <GithubIcon className="mr-2 h-4 w-4" />
                    Source
                  </a>
                </Button>
              )}
              {project.videoGallery?.[0] && (
                <Button asChild size="sm" variant="outline" className="rounded-md border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <a href={`https://www.youtube.com/watch?v=${project.videoGallery[0].id}`} target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-4 w-4" />
                    Demo
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_0.72fr]">
              <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/35">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/micromouse/testing-lab.jpg"
                    alt="Micromouse robot testing inside maze"
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 480" aria-hidden="true">
                    <defs>
                      <path id="micromouse-hero-route" d="M98 388 L98 318 L178 318 L178 246 L264 246 L264 176 L354 176 L354 102 L468 102 L468 172 L544 172" />
                      <filter id="micromouse-route-glow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <path d="M98 388 L98 318 L178 318 L178 246 L264 246 L264 176 L354 176 L354 102 L468 102 L468 172 L544 172" stroke="#67e8f9" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.35" fill="none" />
                    <path className="micromouse-route-dash" d="M98 388 L98 318 L178 318 L178 246 L264 246 L264 176 L354 176 L354 102 L468 102 L468 172 L544 172" stroke="#67e8f9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#micromouse-route-glow)" />
                    <circle r="9" fill="#22c55e" filter="url(#micromouse-route-glow)">
                      <animateMotion dur="5s" repeatCount="indefinite">
                        <mpath href="#micromouse-hero-route" />
                      </animateMotion>
                    </circle>
                  </svg>
                  <div className="absolute bottom-4 left-4 rounded-md border border-cyan-300/25 bg-black/55 px-3 py-2 backdrop-blur">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">Run objective</div>
                    <div className="text-sm font-bold">Map, plan, drive, correct</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="group relative min-h-[260px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] text-left"
                onClick={() => openLightbox(["/images/micromouse/robot.jpg"], 0, "Micromouse robot")}
              >
                <Image
                  src="/images/micromouse/robot.jpg"
                  alt="Micromouse robot close-up"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Robot build</div>
                  <div className="mt-1 text-lg font-bold">Compact sensor stack</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { icon: Monitor, label: "Sense", value: "LiDAR + IMU + encoders" },
          { icon: Cpu, label: "Think", value: "occupancy map + BFS" },
          { icon: Gauge, label: "Control", value: "PID steering" },
          { icon: Zap, label: "Result", value: "Top-3 competition finish" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-lg border bg-muted/10 p-4">
            <Icon className="mb-3 h-5 w-5 text-primary" />
            <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">{label}</div>
            <div className="mt-1 text-sm font-bold leading-snug">{value}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="rounded-xl border bg-muted/10 p-5 md:p-6 lg:col-span-5">
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Navigation stack</div>
          <h2 className="text-2xl font-bold tracking-tight">Small corrections, every cell.</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/65">
            The robot constantly fused distance, heading, and wheel motion so small errors did not compound across the maze.
          </p>
          <div className="mt-6 space-y-3">
            {[
              { step: "01", title: "Read sensors", detail: "LiDAR, IMU, and encoders update the local state." },
              { step: "02", title: "Update map", detail: "The maze representation changes as walls are discovered." },
              { step: "03", title: "Plan route", detail: "Breadth-first search chooses the next useful cell." },
              { step: "04", title: "Drive cleanly", detail: "PID keeps straight runs and turns consistent." },
            ].map((item) => (
              <div key={item.step} className="grid grid-cols-[2.5rem_1fr] gap-3 rounded-md border border-border/70 bg-background/70 p-3">
                <div className="font-mono text-xs font-bold text-primary">{item.step}</div>
                <div>
                  <div className="text-sm font-bold">{item.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-foreground/60">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-muted/10 p-5 md:p-6 lg:col-span-7">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Path planning</div>
              <h2 className="text-2xl font-bold tracking-tight">Route chosen from noisy data</h2>
            </div>
            <span className="rounded-md border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              BFS + PID
            </span>
          </div>
          <button
            type="button"
            className="group relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border/70 bg-background/60"
            onClick={() => openLightbox(["/images/micromouse/algorithm.jpg"], 0, "Micromouse path planning output")}
          >
            <Image
              src="/images/micromouse/algorithm.jpg"
              alt="Micromouse path planning visualisation"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 54vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/15" />
            <div className="absolute bottom-4 left-4 rounded-md border border-white/20 bg-black/55 px-3 py-2 text-left text-white backdrop-blur">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">Planner output</div>
              <div className="text-sm font-bold">Search graph to driveable path</div>
            </div>
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {[
          {
            title: "Prototype wiring",
            image: "/images/micromouse/prototype.jpg",
            alt: "Micromouse prototype wiring",
            text: "Early layout validation before final assembly.",
          },
          {
            title: "Final hardware",
            image: "/images/micromouse/closeup.jpg",
            alt: "Micromouse assembled hardware close-up",
            text: "Sensors, power, and motor wiring packed into the chassis.",
          },
          {
            title: "Competition maze",
            image: "/images/micromouse/testing-lab.jpg",
            alt: "Micromouse testing maze",
            text: "Real testing in the maze exposed drift and tuning issues.",
          },
        ].map((item) => (
          <button
            key={item.title}
            type="button"
            className="group overflow-hidden rounded-xl border bg-muted/10 text-left"
            onClick={() => openLightbox([item.image], 0, item.title)}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-black/5 dark:bg-white/[0.03]">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 31vw"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold">{item.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-foreground/60">{item.text}</p>
            </div>
          </button>
        ))}
      </section>

      {project.videoGallery && (
        <section className="rounded-xl border bg-muted/10 p-5 md:p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Run footage</div>
              <h2 className="text-2xl font-bold tracking-tight">Testing the control loop</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-foreground/60">
              Short demos of maze navigation, accuracy tuning, and straight-line PID behaviour.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {project.videoGallery.map((video) => (
              <div key={video.id} className="overflow-hidden rounded-lg border border-border/70 bg-background/70">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold leading-snug">{video.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-foreground/55">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
