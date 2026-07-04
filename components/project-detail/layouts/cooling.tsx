"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { AlertTriangle, ArrowRight, TrendingDown, Wrench } from "lucide-react"
import EnhancedBeforeAfterSlider from "@/components/enhanced-before-after-slider"
import { ResultsSection } from "@/components/project-detail/results-section"
import type { ProjectLayoutProps } from "./types"

const PCCoolingScene = dynamic(() => import("@/components/project-detail/pc-cooling-scene"), {
  ssr: false,
  loading: () => (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      style={{ aspectRatio: "4 / 3", minHeight: 280, background: "linear-gradient(180deg, #050810 0%, #0b1220 100%)" }}
    />
  ),
})

// Custom Cooling Funnels for PC Hardware (project 3)
export default function CoolingLayout({ project, openLightbox }: ProjectLayoutProps) {
  const [coolingAirflowMode, setCoolingAirflowMode] = useState<"stock" | "ducted">("ducted")

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-xl border bg-muted/10">
        <div className="absolute inset-0 cooling-flow-bg" aria-hidden="true" />
        <div className="relative grid grid-cols-1 gap-7 p-5 md:p-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-primary">Thermal airflow retrofit</div>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Custom cooling funnels for PC hardware
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/72 md:text-base">
              A 3D-printed ducting system that channels front-intake airflow directly into the GPU instead of letting it disperse through the case.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground/75">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6">
            <button
              type="button"
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/70 bg-background/70"
              onClick={() => openLightbox(["/images/cooling/installed.jpg"], 0, "Cooling funnel installed")}
            >
              <Image
                src="/images/cooling/installed.jpg"
                alt="Custom cooling funnel installed in PC case"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-gradient-to-br from-muted/15 via-muted/5 to-muted/15 p-5 md:p-7">
        <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {/* Problem */}
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-red-500/15 text-red-300">
                <AlertTriangle size={16} />
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-300/85">
                Problem
              </div>
            </div>
            <p className="text-base font-semibold leading-snug">Air scattered inside the case.</p>
            <p className="mt-1.5 text-xs leading-relaxed text-foreground/55">
              Front intake disperses before it reaches the GPU.
            </p>
          </div>

          <div className="hidden self-center text-foreground/30 md:block">
            <ArrowRight size={22} />
          </div>

          {/* Fix */}
          <div className="rounded-lg border border-primary/35 bg-primary/[0.08] p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-primary">
                <Wrench size={16} />
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/85">
                Fix
              </div>
            </div>
            <p className="text-base font-semibold leading-snug">Duct the intake to the GPU.</p>
            <p className="mt-1.5 text-xs leading-relaxed text-foreground/55">
              3D-printed shroud channels air straight to the bottom-fan inlet.
            </p>
          </div>

          <div className="hidden self-center text-foreground/30 md:block">
            <ArrowRight size={22} />
          </div>

          {/* Result */}
          <div className="rounded-lg border border-emerald-500/35 bg-emerald-500/[0.07] p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-emerald-500/15 text-emerald-300">
                <TrendingDown size={16} />
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300/85">
                Result
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight">7°C</span>
              <span className="text-sm font-medium text-foreground/65">lower under load</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-foreground/55">
              Higher sustained boost clocks. Quieter fans.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 rounded-lg border bg-muted/10 p-5 md:p-6 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Airflow lab</div>
          <h2 className="text-2xl font-bold tracking-tight">From intake to GPU.</h2>
          <div className="mt-5 inline-flex rounded-md border border-border/70 bg-background/80 p-1">
            {[
              { id: "stock", label: "Stock" },
              { id: "ducted", label: "Ducted" },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                aria-pressed={coolingAirflowMode === mode.id}
                onClick={() => setCoolingAirflowMode(mode.id as "stock" | "ducted")}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                  coolingAirflowMode === mode.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground/65">
            {coolingAirflowMode === "ducted"
              ? "The lower intake air is captured by the printed duct and delivered into the GPU cooler."
              : "Without the duct, intake air disperses through the case and heat lingers around the GPU."}
          </p>
          <div className="mt-5 max-w-sm rounded-lg border border-border/70 bg-background/70 p-4">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 text-xs text-foreground/70">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
              <span>Blue particles show useful intake air.</span>
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]" />
              <span>Red haze shows heat that is not being cleared quickly.</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8">
          <div className="relative overflow-hidden rounded-lg border border-border/70">
            <PCCoolingScene mode={coolingAirflowMode} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="rounded-lg border bg-muted/10 p-5 md:p-6 lg:col-span-8">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Before / After</div>
              <h2 className="text-2xl font-bold tracking-tight">Airflow redirected to the GPU</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-foreground/60">
              Slide between the open case and the installed ducting to see the final airflow path.
            </p>
          </div>
          <EnhancedBeforeAfterSlider
            beforeImage="/images/cooling/without-ducting.jpg"
            afterImage="/images/cooling/installed.jpg"
            beforeAlt="PC without cooling ducting"
            afterAlt="PC with custom cooling ducting installed"
          />
        </div>

        <div className="rounded-lg border bg-muted/10 p-5 md:p-6 lg:col-span-4">
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Why it worked</div>
          <h2 className="text-xl font-bold tracking-tight">Less wasted airflow inside the case.</h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-foreground/70">
            <p>
              The stock case airflow entered from the front, then spread into empty internal volume before reaching the GPU.
            </p>
            <p>
              The funnel creates a controlled path from intake fans to the GPU cooler, reducing recirculation and improving thermal consistency.
            </p>
          </div>
        </div>
      </section>

      {/* Story Steps */}
      <div className="rounded-lg border bg-muted/10 p-5 md:p-7">
        <div className="mb-8">
          <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Timeline</div>
          <h2 className="text-2xl font-bold tracking-tight">Project development story</h2>
        </div>
        <div className="relative space-y-8 before:absolute before:left-3 before:top-2 before:hidden before:h-[calc(100%-1rem)] before:w-px before:bg-border md:before:block lg:before:left-1/2">
          {project.storySteps?.map((step, index) => {
            const textPanel = (
              <div className="rounded-lg border border-border/70 bg-background/70 p-4 md:p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-lg font-bold leading-tight">{step.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-foreground/75">{step.description}</p>
                {step.highlight && (
                  <div className="mt-4 rounded-md border border-primary/25 bg-primary/10 px-3 py-2.5">
                    <p className="text-xs font-medium leading-relaxed text-primary">{step.highlight}</p>
                  </div>
                )}
              </div>
            )
            const imagePanel = (
              <button
                type="button"
                className="group relative block w-full overflow-hidden rounded-lg border border-border/70 bg-background/80 p-3 text-left shadow-sm transition-colors hover:border-primary/45"
                onClick={() => openLightbox([step.image], 0, `Step ${index + 1}`)}
              >
                <div className={`relative ${step.aspectRatio || "aspect-video"} min-h-[240px] overflow-hidden rounded-md bg-black/5 dark:bg-white/[0.03]`}>
                  <Image
                    src={step.image || "/placeholder.svg"}
                    alt={step.title}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </button>
            )

            return (
              <div key={index} className="relative grid grid-cols-1 gap-4 pl-10 md:pl-12 lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] lg:items-center lg:gap-6 lg:pl-0">
                <div className="absolute left-0 top-5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-primary/40 bg-background text-[10px] font-bold text-primary lg:left-1/2 lg:-translate-x-1/2">
                  {index + 1}
                </div>
                <div className={index % 2 === 0 ? "lg:col-start-1" : "lg:col-start-3"}>
                  {textPanel}
                </div>
                <div className="hidden lg:col-start-2 lg:block" aria-hidden="true" />
                <div className={index % 2 === 0 ? "lg:col-start-3" : "lg:col-start-1 lg:row-start-1"}>
                  {imagePanel}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Temperature Comparison Results */}
      <section className="rounded-lg border bg-muted/10 p-5 md:p-7">
        <div className="mb-7 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-primary">Measured evidence</div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Temperature test results</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/65">
              Same GPU workload, same case, same benchmark style. The ducted airflow reduced load temperature by 7°C.
            </p>
          </div>
          <div className="rounded-lg border border-primary/35 bg-primary/10 p-4 lg:col-span-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary/75">Result delta</div>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight">7°C</span>
              <span className="pb-1 text-sm font-semibold text-foreground/70">cooler under load</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full w-[72%] rounded-full bg-primary" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {[
            {
              title: "Baseline",
              subtitle: "Without ducting",
              image: "/images/cooling/gpu-test-without.png",
              alt: "GPU temperature test without ducting",
              state: "Hotter GPU load temperature",
              tone: "border-red-400/35 bg-red-500/10 text-red-300",
              lightTone: "text-red-700 dark:text-red-300",
              lightSubtone: "text-red-600 dark:text-red-400",
            },
            {
              title: "Ducted airflow",
              subtitle: "With cooling funnel",
              image: "/images/cooling/gpu-test-with.png",
              alt: "GPU temperature test with ducting",
              state: "7°C lower GPU temperature",
              tone: "border-emerald-400/35 bg-emerald-500/10 text-emerald-300",
              lightTone: "text-emerald-700 dark:text-emerald-300",
              lightSubtone: "text-emerald-600 dark:text-emerald-400",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border/70 bg-background/70 p-4">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/45">{item.title}</div>
                  <h3 className="text-lg font-semibold">{item.subtitle}</h3>
                </div>
                <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${item.tone}`}>
                  {item.state}
                </span>
              </div>
              <button
                type="button"
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-md border border-border/70 bg-black/5 dark:bg-white/[0.03]"
                onClick={() => openLightbox([item.image], 0, item.alt)}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-border/70 bg-background/70 p-4 text-sm leading-relaxed text-foreground/70">
          The result matters because a lower sustained GPU temperature helps the card hold boost clocks longer while reducing how hard the fans need to work.
        </div>
      </section>

      <ResultsSection results={project.results} heading="Beyond the temperature drop" />
    </div>
  )
}
