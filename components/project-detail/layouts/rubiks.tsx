"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import {
  ArrowRight,
  Cable,
  CheckCircle2,
  CircuitBoard,
  Cpu,
  Gauge,
  Lock,
  Monitor,
  Play,
  RotateCcw,
  Timer,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResultsSection } from "@/components/project-detail/results-section"
import type { ProjectLayoutProps } from "./types"

// 5-Motor Robotic Rubik's Cube Solver (project 7). Owns the interactive
// top-turn demo: its constants, state machine, and the 3D cube preview.

const rubiksNavItems = [
  { label: "Demo", href: "#rubiks-demo" },
  { label: "Overview", href: "#rubiks-overview" },
  { label: "Pipeline", href: "#rubiks-pipeline" },
  { label: "Top turn", href: "#rubiks-trace" },
  { label: "Build", href: "#rubiks-build" },
  { label: "Stack", href: "#rubiks-stack" },
]

const rubiksMetricCards = [
  { icon: CircuitBoard, label: "Motors", value: "5", detail: "R, L, F, B, D" },
  { icon: RotateCcw, label: "Solver moves", value: "~20", detail: "near-optimal Kociemba plan" },
  { icon: Timer, label: "Solve time", value: "<1s", detail: "local Python compute" },
  { icon: Gauge, label: "Physical", value: "~55", detail: "5-axis motor commands" },
]

const rubiksPipelineSteps = [
  {
    icon: Monitor,
    stage: "Input",
    title: "Paint the cube state",
    description: "The browser checks colour counts before solving.",
    image: "/images/rubiks/ui-filled.png",
  },
  {
    icon: Cpu,
    stage: "Solve",
    title: "Kociemba plans the solve",
    description: "Python computes a near-optimal plan of roughly 20 moves in under 1 second.",
    image: "/images/rubiks/ui-solved.png",
  },
  {
    icon: Cable,
    stage: "Stream",
    title: "Serial talks to ESP32",
    description: "The plan expands to roughly 55 physical motor commands for the 5-axis rig.",
    image: "/images/rubiks/motor-diagram.jpg",
  },
  {
    icon: Wrench,
    stage: "Actuate",
    title: "The chassis does the work",
    description: "Five steppers turn the gripped faces.",
    image: "/images/rubiks/final-design.jpg",
  },
]

const rubiksNotationLegend = [
  { symbol: "R", label: "Right face clockwise" },
  { symbol: "L", label: "Left face clockwise" },
  { symbol: "F2 / B2", label: "Front or back half-turn" },
  { symbol: "D", label: "Bottom face clockwise" },
  { symbol: "'", label: "Prime: turn counter-clockwise" },
]

const rubiksMoveTrace = [
  {
    move: "R",
    title: "Right face clockwise",
    detail: "The right motor turns its face 90 deg clockwise, viewed from the right side.",
  },
  {
    move: "L",
    title: "Left face clockwise",
    detail: "The left motor turns its face 90 deg clockwise, viewed from the left side.",
  },
  {
    move: "F2",
    title: "Front face 180",
    detail: "The front motor makes a half-turn, equal to two quarter turns.",
  },
  {
    move: "B2",
    title: "Back face 180",
    detail: "The back motor makes the matching half-turn.",
  },
  {
    move: "R'",
    title: "Right face counter-clockwise",
    detail: "The right motor reverses one quarter turn.",
  },
  {
    move: "L'",
    title: "Left face counter-clockwise",
    detail: "The left motor reverses one quarter turn.",
  },
  {
    move: "D",
    title: "Bottom face clockwise",
    detail: "The bottom motor makes the key turn that substitutes for the missing top motor.",
  },
  {
    move: "L'",
    title: "Left face counter-clockwise",
    detail: "The left face starts restoring the cube's orientation.",
  },
  {
    move: "R'",
    title: "Right face counter-clockwise",
    detail: "The right face continues the restore step.",
  },
  {
    move: "B2",
    title: "Back face 180",
    detail: "The back face returns with another half-turn.",
  },
  {
    move: "F2",
    title: "Front face 180",
    detail: "The front face returns with another half-turn.",
  },
  {
    move: "L",
    title: "Left face clockwise",
    detail: "The left face closes the restore sequence.",
  },
  {
    move: "R",
    title: "Right face clockwise",
    detail: "The right face closes it. Net result: one top turn, no top motor.",
  },
]

// U' is the same 13-move equivalence with every move inverted in place
// (half-turns are their own inverse), so its trace is derived from the U trace
// rather than maintained as a second hand-written copy.
const invertMove = (move: string) =>
  move.endsWith("2") ? move : move.endsWith("'") ? move.slice(0, -1) : `${move}'`

const swapTurnDirections = (text: string) =>
  text.replace(/counter-clockwise|clockwise/g, (m) => (m === "clockwise" ? "counter-clockwise" : "clockwise"))

const rubiksMoveTraceUPrime = rubiksMoveTrace.map((step, index) => {
  let detail = swapTurnDirections(step.detail)
  if (step.move === "D") detail = detail.replace(/\.$/, " (in reverse).")
  if (index === rubiksMoveTrace.length - 1) detail = detail.replace("one top turn", "one top counter-turn")

  return {
    move: invertMove(step.move),
    title: swapTurnDirections(step.title),
    detail,
  }
})

const rubiksBuildPhotos = [
  {
    src: "/images/rubiks/final-design.jpg",
    label: "Final 5-motor cube grip",
    span: "col-span-12 md:col-span-7",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/rubiks/motor-diagram.jpg",
    label: "Final 4-motor circuit",
    caption: "Circuit layout used for the completed 4-motor prototype.",
    span: "col-span-12 md:col-span-5",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/rubiks/motor-design.jpg",
    label: "Early 5-motor CAD",
    span: "col-span-12 md:col-span-5",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/rubiks/motor-design-final.jpg",
    label: "Scrapped 4-motor chassis",
    caption: "This direction was abandoned because four motors could not solve every possible cube state.",
    span: "col-span-12 md:col-span-7",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/rubiks/single-motor-bracket.jpg",
    label: "Motor and bracket detail",
    span: "col-span-6 md:col-span-4",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/rubiks/motor-with-adapter.jpg",
    label: "Adapter issue",
    caption: "The tolerances were too tight, so heat and other removal methods were needed to free the plastic.",
    span: "col-span-6 md:col-span-4",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/rubiks/motor-design-2.jpg",
    label: "Fitment iteration",
    span: "col-span-12 md:col-span-4",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/rubiks/breadboard-wiring.jpg",
    label: "4-motor stepper driver wiring",
    caption: "Driver wiring for the earlier 4-motor design only.",
    span: "col-span-12",
    aspect: "aspect-[16/9]",
  },
]

const rubiksFaceTiles = [
  "#f8fafc",
  "#ef4444",
  "#22c55e",
  "#facc15",
  "#3b82f6",
  "#f97316",
  "#e2e8f0",
  "#ef4444",
  "#22c55e",
]

type RubiksFaceId = "u" | "l" | "f" | "r" | "b" | "d"
type RubiksTurnDirection = "clockwise" | "prime" | "half"

const rubiksPreviewModes = [
  { id: "animate", label: "Play" },
  { id: "start", label: "Before" },
  { id: "result", label: "Result" },
] as const

const rubiksObjectives = {
  cw: {
    symbol: "U",
    label: "U move",
    detail: "Replicated by 13 physical moves on the surrounding faces (no top-face motor).",
    trace: rubiksMoveTrace,
  },
  ccw: {
    symbol: "U'",
    label: "U' move",
    detail: "Counter-clockwise top turn, the same 13-move equivalence run in reverse.",
    trace: rubiksMoveTraceUPrime,
  },
} as const

type RubiksDirection = keyof typeof rubiksObjectives

type RubiksPreviewMode = (typeof rubiksPreviewModes)[number]["id"]

const getRubiksMoveVisual = (move: string) => {
  const face = move[0].toLowerCase() as RubiksFaceId
  const turn: RubiksTurnDirection = move.includes("2") ? "half" : move.includes("'") ? "prime" : "clockwise"
  const turnLabel = turn === "half" ? "180 degree turn" : turn === "prime" ? "counter-clockwise" : "clockwise"

  return {
    face,
    turn,
    turnLabel,
  }
}

const getInitialRubiksPreviewMode = (): RubiksPreviewMode => {
  if (typeof window === "undefined") return "start"

  const requestedFrame = new URLSearchParams(window.location.search).get("frame")
  const requestedMode = rubiksPreviewModes.find((mode) => mode.id === requestedFrame)

  return requestedMode?.id || "start"
}

const getInitialRubiksDirection = (): RubiksDirection => {
  if (typeof window === "undefined") return "cw"

  return new URLSearchParams(window.location.search).get("direction") === "ccw" ? "ccw" : "cw"
}

const RubiksPhysicalCube = dynamic(() => import("@/components/project-detail/rubiks-physical-cube"), {
  ssr: false,
  loading: () => <div className="rubiks-three-cube" />,
})

export default function RubiksLayout({ project, openLightbox }: ProjectLayoutProps) {
  const [activeRubiksMove, setActiveRubiksMove] = useState(0)
  const [rubiksPreviewMode, setRubiksPreviewMode] = useState<RubiksPreviewMode>("start")
  const [rubiksReplayKey, setRubiksReplayKey] = useState(0)
  const [rubiksDirection, setRubiksDirection] = useState<RubiksDirection>("cw")
  const [isRubiksSequencePlaying, setIsRubiksSequencePlaying] = useState(false)
  const [showRubiksVideo, setShowRubiksVideo] = useState(false)

  const activeRubiksObjective = rubiksObjectives[rubiksDirection]
  const activeMoveSequence = activeRubiksObjective.trace
  const safeRubiksMove = Math.min(activeRubiksMove, activeMoveSequence.length - 1)
  const activeRubiksTrace = activeMoveSequence[safeRubiksMove]
  const activeRubiksVisual = getRubiksMoveVisual(activeRubiksTrace.move)
  const isRubiksFinalStep = safeRubiksMove === activeMoveSequence.length - 1
  const shouldHighlightTopFace = isRubiksFinalStep && rubiksPreviewMode !== "start"
  const showRubiksFinalOutcome = isRubiksFinalStep && rubiksPreviewMode === "result"

  /* eslint-disable react-hooks/set-state-in-effect -- one-time sync of demo
     state from URL query params; it must run post-hydration so the prerendered
     markup stays stable. */
  useEffect(() => {
    const requestedMove = Number.parseInt(new URLSearchParams(window.location.search).get("move") || "", 10)

    if (!Number.isNaN(requestedMove) && requestedMove >= 1 && requestedMove <= rubiksMoveTrace.length) {
      setActiveRubiksMove(requestedMove - 1)
    } else {
      setActiveRubiksMove(0)
    }

    setRubiksDirection(getInitialRubiksDirection())
    setRubiksPreviewMode(getInitialRubiksPreviewMode())
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Advances the demo one move at a time while playing. Preview mode is set to
  // "animate" by playRubiksFullSequence (the only place playback starts).
  useEffect(() => {
    if (!isRubiksSequencePlaying) return

    const timer = window.setTimeout(() => {
      setActiveRubiksMove((current) => {
        const currentStep = Math.min(current, activeMoveSequence.length - 1)

        if (currentStep >= activeMoveSequence.length - 1) {
          setIsRubiksSequencePlaying(false)
          setRubiksPreviewMode("result")
          return currentStep
        }

        setRubiksReplayKey((key) => key + 1)
        return currentStep + 1
      })
    }, 1130)

    return () => window.clearTimeout(timer)
  }, [activeMoveSequence.length, isRubiksSequencePlaying, safeRubiksMove])

  const replayRubiksAnimation = () => {
    setIsRubiksSequencePlaying(false)
    setRubiksPreviewMode("animate")
    setRubiksReplayKey((current) => current + 1)
  }
  const resetRubiksDemo = () => {
    setIsRubiksSequencePlaying(false)
    setActiveRubiksMove(0)
    setRubiksPreviewMode("start")
    setRubiksReplayKey((current) => current + 1)
  }
  const goToRubiksMove = (moveIndex: number) => {
    setIsRubiksSequencePlaying(false)
    setActiveRubiksMove(Math.min(Math.max(moveIndex, 0), activeMoveSequence.length - 1))
    setRubiksReplayKey((current) => current + 1)
  }
  const playRubiksFullSequence = () => {
    setActiveRubiksMove(0)
    setRubiksPreviewMode("animate")
    setRubiksReplayKey((current) => current + 1)
    setIsRubiksSequencePlaying(true)
  }
  const setRubiksDirectionAndReset = (direction: RubiksDirection) => {
    if (direction === rubiksDirection) return
    setIsRubiksSequencePlaying(false)
    setRubiksDirection(direction)
    setActiveRubiksMove(0)
    setRubiksPreviewMode("start")
    setRubiksReplayKey((current) => current + 1)
  }

  return (
    <div className="relative w-[calc(100vw-3rem)] pb-4 sm:w-full">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[-6rem] bottom-[-2rem] -z-10 overflow-hidden">
        <div className="absolute inset-0 rubiks-blueprint-bg" />
        <div className="absolute inset-x-0 top-0 h-2 rubiks-color-ribbon" />
      </div>

      <section id="rubiks-demo" className="scroll-mt-28 grid min-w-0 grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2">
        <div className="min-w-0 lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <h1 className="max-w-[21rem] break-words text-3xl sm:max-w-xl sm:text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight">
              A 5-motor robot that solves a Rubik&apos;s cube end-to-end.
            </h1>
            <p className="max-w-[21rem] break-words text-sm sm:max-w-xl md:text-base leading-relaxed text-foreground/70">
              Browser input, local solving, serial commands, and ESP32-driven stepper motion in one compact pipeline.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" className="rounded-md">
              <a href="#rubiks-pipeline">
                See pipeline
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-md bg-background/70">
              <a href="#rubiks-trace">
                Top-turn trick
                <Play className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7 space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border/70 bg-black shadow-2xl shadow-primary/10">
            {showRubiksVideo && project.videoGallery && project.videoGallery[0] ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${project.videoGallery[0].id}?autoplay=1&rel=0`}
                title={project.videoGallery[0].title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <button
                type="button"
                aria-label="Play Rubik's Cube solver demo"
                className="group relative h-full w-full"
                onClick={() => setShowRubiksVideo(true)}
              >
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
                <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-lg border border-white/20 bg-black/55 px-4 py-3 text-left text-white backdrop-blur-md">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">Watch the solve</span>
                    <span className="block text-xs text-white/70">Loads the demo video here</span>
                  </span>
                </div>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {rubiksMetricCards.map(({ icon: Icon, label, value, detail }) => (
              <div key={label} className="min-w-0 rubiks-panel rounded-lg border border-border/70 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">{label}</span>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-bold leading-none">{value}</div>
                <div className="mt-1 text-[11px] text-foreground/55">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav className="sticky top-20 z-30 my-10 max-w-full overflow-x-auto rounded-lg border border-border/70 bg-background/85 px-2 py-2 backdrop-blur-xl">
        <div className="flex min-w-max items-center justify-center gap-1">
          {rubiksNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-xs font-medium text-foreground/65 transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="space-y-14 md:space-y-20">
        <section id="rubiks-overview" className="scroll-mt-32 rubiks-panel rounded-xl border border-border/70 p-6 md:p-10">
          <div className="grid min-w-0 grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="min-w-0 lg:col-span-4 space-y-6">
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">Overview</div>
                <h2 className="max-w-[18rem] break-words text-2xl md:text-3xl font-bold leading-tight sm:max-w-none">5 motors. Open top. Full solve.</h2>
              </div>
              <div className="grid w-36 grid-cols-3 gap-1.5 rounded-lg border border-border/70 bg-foreground/10 p-2">
                {rubiksFaceTiles.map((color, index) => (
                  <div
                    key={`${color}-${index}`}
                    className="aspect-square rounded-sm border border-black/15 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="min-w-0 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                  Python runs Kociemba locally: a fast two-phase solver used in speed-solving software to compute a near-optimal solution of roughly 20 moves in under 1 second.
                </p>
                <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                  Kociemba assumes all six faces can turn. This robot keeps the top open, so U and U&apos; moves are expanded into a workaround using the surrounding motors.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                  The ESP32 still follows the same solve plan, but top-face requests are expanded for the 5-axis configuration, producing roughly 55 physical motor commands.
                </p>
                <div className="overflow-x-auto rounded-md border border-border/70 bg-background/70 p-3 font-mono text-xs md:text-sm text-foreground/80">
                  U = R L F2 B2 R&apos; L&apos; D L&apos; R&apos; B2 F2 L R
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="rubiks-pipeline" className="scroll-mt-32">
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">Pipeline</div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">From colour input to physical motion</h2>
            </div>
            <p className="max-w-lg text-sm text-foreground/60">
              Click the images to inspect each stage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {rubiksPipelineSteps.map((step, index) => {
              const Icon = step.icon

              return (
                <div key={step.stage} className="group">
                  <button
                    type="button"
                    className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/70 bg-muted/10 text-left"
                    onClick={() => openLightbox([step.image], 0, step.title)}
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-90" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-background/90 px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm">
                      <Icon className="h-4 w-4 text-primary" />
                      {step.stage}
                    </div>
                  </button>
                  <div className="mt-4 flex gap-3">
                    <span className="mt-1 font-mono text-xs text-primary/75">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-semibold leading-snug">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/60">{step.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section id="rubiks-trace" className="scroll-mt-32 rubiks-panel rounded-xl border border-border/70 p-5 md:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8">
            <div className="lg:col-span-4 space-y-3">
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">Interactive</div>
                <h2 className="text-2xl font-bold tracking-tight">What is a U move?</h2>
              </div>
              <p className="text-sm leading-relaxed text-foreground/65">
                U rotates the upper face. This robot has no top motor, so the cube below carries 13 physical turns
                forward until the same top-turn outcome appears.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rubiksNotationLegend.map((item) => (
                  <div key={item.symbol} className="rounded-md border border-border/70 bg-background/70 px-2.5 py-2">
                    <div className="font-mono text-xs text-primary/80">{item.symbol}</div>
                    <div className="mt-1 text-xs text-foreground/65">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5">
              <div className="rounded-lg border border-border/70 bg-background/75 p-4 md:p-5">
                <div className="mb-3 flex flex-col items-start justify-between gap-3 border-b border-border/60 pb-3 sm:flex-row sm:items-center">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                      Objective
                    </div>
                    <div className="mt-0.5 flex items-baseline gap-2">
                      <span className="text-lg font-semibold">{activeRubiksObjective.label}</span>
                      <span className="font-mono text-xs text-primary/80">
                        {activeRubiksObjective.symbol}
                      </span>
                    </div>
                  </div>
                  <div className="flex rounded-md border border-border/70 bg-background/80 p-1">
                    {([
                      { id: "cw" as const, label: "Clockwise" },
                      { id: "ccw" as const, label: "Counter" },
                    ]).map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={rubiksDirection === option.id}
                        onClick={() => setRubiksDirectionAndReset(option.id)}
                        className={`w-20 rounded px-2.5 py-1 text-center text-xs font-medium transition-colors ${
                          rubiksDirection === option.id
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/60 hover:text-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-2 hidden text-[11px] text-foreground/55 sm:block">
                  {activeRubiksObjective.detail}
                </div>
                <div className="mb-4 space-y-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                      {showRubiksFinalOutcome ? "Result" : `Step ${safeRubiksMove + 1} / ${activeMoveSequence.length}`}
                    </div>
                    <div className="mt-0.5 flex items-baseline gap-2">
                      <span className="text-sm font-semibold">
                        {showRubiksFinalOutcome ? `${activeRubiksObjective.symbol} achieved` : activeRubiksTrace.title}
                      </span>
                      <span className="font-mono text-xs text-primary/80">
                        {showRubiksFinalOutcome ? activeRubiksObjective.symbol : activeRubiksTrace.move}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      className="h-8 rounded-md"
                      disabled={isRubiksSequencePlaying}
                      onClick={playRubiksFullSequence}
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      {isRubiksSequencePlaying ? "Playing" : "Play full sequence"}
                    </Button>
                    <div className="flex rounded-md border border-border/70 bg-background/80 p-1">
                      {rubiksPreviewModes.map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          aria-pressed={rubiksPreviewMode === mode.id}
                          onClick={() => {
                            setIsRubiksSequencePlaying(false)
                            setRubiksPreviewMode(mode.id)
                            if (mode.id === "animate") {
                              setRubiksReplayKey((current) => current + 1)
                            }
                          }}
                          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                            rubiksPreviewMode === mode.id
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground/60 hover:text-foreground"
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" className="h-8 rounded-md bg-background/80" onClick={replayRubiksAnimation}>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Replay
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="h-8 rounded-md bg-background/80" onClick={resetRubiksDemo}>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset
                    </Button>
                  </div>
                </div>

                {rubiksPreviewMode === "start" && (
                  <div className="rubiks-cube-intent" aria-hidden="true">
                    <div className="rubiks-cube-intent-item">
                      <span className="rubiks-cube-intent-kicker">Target</span>
                      <span className="rubiks-cube-intent-value">
                        Top face {rubiksDirection === "cw" ? "clockwise" : "anticlockwise"}
                      </span>
                    </div>
                    <div className="rubiks-cube-intent-divider" />
                    <div className="rubiks-cube-intent-item">
                      <span className="rubiks-cube-intent-kicker">Constraint</span>
                      <span className="rubiks-cube-intent-value">
                        <Lock className="h-3.5 w-3.5" />
                        No top motor
                      </span>
                    </div>
                  </div>
                )}
                <div className="relative">
                  {showRubiksFinalOutcome && (
                    <div className="rubiks-goal-complete" aria-hidden="true">
                      <span className="rubiks-goal-complete-icon">
                        <CheckCircle2 className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-[10px] uppercase tracking-[0.18em] text-emerald-200/75">
                          Goal complete
                        </span>
                        <span className="font-semibold text-white">
                          {activeRubiksObjective.symbol} rotation achieved
                        </span>
                      </span>
                    </div>
                  )}
                  <RubiksPhysicalCube
                    activeFace={activeRubiksVisual.face}
                    turn={activeRubiksVisual.turn}
                    stepIndex={safeRubiksMove}
                    moveSequence={activeMoveSequence}
                    direction={rubiksDirection}
                    previewMode={rubiksPreviewMode}
                    replayKey={rubiksReplayKey}
                    moveLabel={activeRubiksTrace.move}
                    moveTitle={activeRubiksTrace.title}
                    highlightTopFace={shouldHighlightTopFace}
                  />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-foreground/10" aria-label={`Step ${safeRubiksMove + 1} of ${activeMoveSequence.length}`}>
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${((safeRubiksMove + 1) / activeMoveSequence.length) * 100}%` }}
                  />
                </div>
                {showRubiksFinalOutcome && (
                  <div className="mt-4 rounded-lg border border-emerald-400/35 bg-emerald-400/10 px-4 py-3 text-sm leading-relaxed text-foreground/75">
                    <span className="font-semibold text-foreground">{activeRubiksObjective.symbol} achieved.</span>{" "}
                    The highlighted top face is the final rotation produced by chaining the surrounding motors instead of using a top-face motor.
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {activeMoveSequence.map((item, index) => (
                  <button
                    key={`${item.move}-${index}`}
                    type="button"
                    onClick={() => goToRubiksMove(index)}
                    className={`rounded-md border px-3 py-2 font-mono text-xs transition-all ${
                      safeRubiksMove === index && !showRubiksFinalOutcome
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "border-border/70 bg-background/70 text-foreground/70 hover:border-primary/60 hover:text-foreground"
                    }`}
                  >
                    {item.move}
                  </button>
                ))}
              </div>

              <div className="rounded-lg border border-border/70 bg-background/75 p-5">
                <div className="mb-2 text-xs font-mono text-primary/80">
                  {showRubiksFinalOutcome ? "Result" : `Step ${safeRubiksMove + 1} of ${activeMoveSequence.length}`}
                </div>
                <h3 className="text-lg font-semibold">
                  {showRubiksFinalOutcome ? `${activeRubiksObjective.symbol} achieved` : activeRubiksTrace.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                  {showRubiksFinalOutcome
                    ? "The top face reached the target rotation by chaining the surrounding face motors."
                    : activeRubiksTrace.detail}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-md bg-background/80"
                    disabled={safeRubiksMove === 0}
                    onClick={() => goToRubiksMove(safeRubiksMove - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-md"
                    onClick={() => {
                      setIsRubiksSequencePlaying(false)
                      setActiveRubiksMove((current) => (current + 1) % activeMoveSequence.length)
                      setRubiksReplayKey((current) => current + 1)
                    }}
                  >
                    Next move
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="rubiks-build" className="scroll-mt-32">
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">Build</div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Mechanical iteration gallery</h2>
            </div>
            <p className="max-w-md text-sm text-foreground/60">
              Click any image to inspect the chassis, wiring, and fitment details.
            </p>
          </div>
          <div className="grid grid-cols-12 gap-3 md:gap-4">
            {rubiksBuildPhotos.map((photo) => (
              <button
                key={photo.src}
                type="button"
                className={`${photo.span} relative ${photo.aspect} overflow-hidden rounded-lg border border-border/70 bg-muted/10 text-left group`}
                onClick={() =>
                  openLightbox(
                    project.hardwareGallery || [],
                    Math.max((project.hardwareGallery || []).indexOf(photo.src), 0),
                    "Build",
                  )
                }
              >
                <Image
                  src={photo.src}
                  alt={photo.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-4 text-white opacity-95">
                  <div className="text-sm font-semibold">{photo.label}</div>
                  {"caption" in photo && photo.caption && (
                    <div className="mt-1 max-w-xl text-xs font-medium leading-snug text-white/78">
                      {photo.caption}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        <ResultsSection
          results={project.results}
          heading="How V1 landed"
          className="rubiks-panel rounded-xl border border-border/70 p-6 md:p-8"
        />

        <section id="rubiks-stack" className="scroll-mt-32 rubiks-panel rounded-xl border border-border/70 p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="mb-5 text-[11px] uppercase tracking-[0.25em] text-primary/80">Stack</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(project.technologies).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="mb-2 text-xs font-semibold capitalize text-foreground/85">
                      {category.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <ul className="space-y-1">
                      {items.map((item) => (
                        <li key={item} className="text-[12px] leading-snug text-foreground/60">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 rounded-lg border border-border/70 bg-background/75 p-5">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Next steps</div>
              <ul className="space-y-3 text-sm leading-relaxed text-foreground/65">
                <li>A cleaner manual-input interface where the cube state is entered on-screen, then solved and executed from one button.</li>
                <li>Computer-vision colour capture to remove manual state entry.</li>
                <li>A 6th U-face mechanism for shorter physical solutions.</li>
                <li>A custom PCB design to replace the breadboard wiring with a cleaner, more reliable electronics stack.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
