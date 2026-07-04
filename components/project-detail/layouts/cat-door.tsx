"use client"

import Image from "next/image"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProjectLayoutProps } from "./types"

// Cat Door Monitoring System (project 5)
export default function CatDoorLayout({ project, openLightbox }: ProjectLayoutProps) {
  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-xl border bg-[#05070b] text-white">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <button
            type="button"
            className="group relative min-h-[360px] overflow-hidden text-left md:min-h-[480px]"
            onClick={() => openLightbox(["/images/cat-door/v1.jpg"], 0, "Cat door monitor installed")}
          >
            <Image
              src="/images/cat-door/v1.jpg"
              alt="Cat door monitor installed on security door"
              fill
              className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 56vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/35 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 md:left-8 md:max-w-lg">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Armed at pet door
              </div>
              <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                Cat door monitoring system
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/72 md:text-base">
                A compact ESP32 guard that watches the pet door and sends a phone alert when the beam is broken.
              </p>
            </div>
          </button>

          <div className="border-t border-white/10 bg-black/55 p-5 md:p-7 lg:border-l lg:border-t-0">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-primary">Live console</div>
                <h2 className="mt-2 text-xl font-bold">Beam activity</h2>
              </div>
              {project.videoGallery?.[0] && (
                <Button asChild size="sm" className="h-9 rounded-md">
                  <a href={`https://www.youtube.com/watch?v=${project.videoGallery[0].id}`} target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-4 w-4" />
                    Demo
                  </a>
                </Button>
              )}
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="rounded-md border border-cyan-300/25 bg-cyan-300/10 p-3">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/70">Emitter</div>
                  <div className="mt-1 text-sm font-bold text-cyan-100">IR beam</div>
                </div>
                <div className="relative h-2 w-20 overflow-hidden rounded-full bg-cyan-200/20 md:w-28">
                  <div className="cat-door-beam absolute inset-y-0 left-0 w-1/2 rounded-full bg-cyan-200" />
                </div>
                <div className="rounded-md border border-cyan-300/25 bg-cyan-300/10 p-3 text-right">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/70">Receiver</div>
                  <div className="mt-1 text-sm font-bold text-cyan-100">ESP32</div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { time: "05:24", event: "Beam broken", state: "cat detected" },
                  { time: "08:43", event: "Debounced event", state: "valid trigger" },
                  { time: "08:43", event: "Telegram sent", state: "phone alerted" },
                ].map((item) => (
                  <div key={`${item.time}-${item.event}`} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/35 px-3 py-2">
                    <div>
                      <div className="text-sm font-semibold">{item.event}</div>
                      <div className="text-xs text-white/46">{item.state}</div>
                    </div>
                    <span className="font-mono text-xs text-primary">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-emerald-300/25 bg-emerald-400/10 p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/70">Result</div>
              <div className="mt-1 text-2xl font-bold">Intruder detected in 2 days</div>
              <p className="mt-2 text-sm leading-relaxed text-white/62">
                V2 replaced unreliable PIR sensing with a beam break across the opening.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-xl border bg-muted/10 p-5 md:p-6">
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">V1 to V2</div>
          <h2 className="text-2xl font-bold tracking-tight">The sensor choice made the project work.</h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
            <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-red-300">V1 PIR</div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                Triggered on insects and nearby door movement.
              </p>
            </div>
            <div className="hidden items-center text-primary sm:flex">
              <ArrowRight className="h-5 w-5" />
            </div>
            <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-300">V2 beam</div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                Only fires when the pet-door opening is crossed.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="group grid grid-cols-1 overflow-hidden rounded-xl border bg-muted/10 text-left md:grid-cols-[0.78fr_1fr]"
          onClick={() => openLightbox(["/images/cat-door/telegram-notifications.png"], 0, "Telegram alert log")}
        >
          <div className="relative min-h-[260px] bg-black/5 dark:bg-white/[0.03]">
            <Image
              src="/images/cat-door/telegram-notifications.png"
              alt="Telegram notification log"
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 34vw"
            />
          </div>
          <div className="flex flex-col justify-center p-5 md:p-6">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Phone evidence</div>
            <h2 className="text-2xl font-bold tracking-tight">Every detection became a timestamped alert.</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">
              The Telegram bot made the prototype useful immediately: beam break, timestamp, notification.
            </p>
          </div>
        </button>
      </section>

      <section className="rounded-xl border bg-muted/10 p-4 md:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            {
              title: "CAD housing",
              image: "/images/cat-door/cad-design.jpg",
              alt: "Cat door CAD housing design",
            },
            {
              title: "Printed frame",
              image: "/images/cat-door/3d-printed.jpg",
              alt: "3D printed cat door monitor housing",
            },
            {
              title: "Bench validation",
              image: "/images/cat-door/v2-system.jpg",
              alt: "ESP32 break beam bench test",
            },
          ].map((item) => (
            <button
              key={item.title}
              type="button"
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border/70 bg-background/60"
              onClick={() => openLightbox([item.image], 0, item.title)}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              <div className="absolute bottom-3 left-3 text-sm font-bold text-white">{item.title}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
