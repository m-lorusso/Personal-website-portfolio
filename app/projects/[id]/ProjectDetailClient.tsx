"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Cable,
  CheckCircle2,
  CircuitBoard,
  Cpu,
  ExternalLink,
  Gauge,
  Hammer,
  HardHat,
  Monitor,
  Play,
  Zap,
  Droplets,
  Home,
  PaintRoller,
  Layers,
  Lock,
  Maximize2,
  RotateCcw,
  Ruler,
  Timer,
  Wrench,
  AlertTriangle,
  TrendingDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnhancedBeforeAfterSlider from "@/components/enhanced-before-after-slider"
import ImageLightbox from "@/components/image-lightbox"

import { projectsData, type Project } from "@/data/projects-data"
import { ProjectHeader } from "@/components/project-detail/project-header"
import { ImageGallery } from "@/components/project-detail/image-gallery"
import { VideoGallery } from "@/components/project-detail/video-gallery"
import ConstructionSlideshowModal from "@/components/construction-slideshow-modal"
import GithubIcon from "@/components/icons/github"

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

const rubiksMoveTraceUPrime = [
  {
    move: "R'",
    title: "Right face counter-clockwise",
    detail: "The right motor turns its face 90 deg counter-clockwise, viewed from the right side.",
  },
  {
    move: "L'",
    title: "Left face counter-clockwise",
    detail: "The left motor turns its face 90 deg counter-clockwise, viewed from the left side.",
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
    move: "R",
    title: "Right face clockwise",
    detail: "The right motor reverses one quarter turn.",
  },
  {
    move: "L",
    title: "Left face clockwise",
    detail: "The left motor reverses one quarter turn.",
  },
  {
    move: "D'",
    title: "Bottom face counter-clockwise",
    detail: "The bottom motor makes the key turn that substitutes for the missing top motor (in reverse).",
  },
  {
    move: "L",
    title: "Left face clockwise",
    detail: "The left face starts restoring the cube's orientation.",
  },
  {
    move: "R",
    title: "Right face clockwise",
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
    move: "L'",
    title: "Left face counter-clockwise",
    detail: "The left face closes the restore sequence.",
  },
  {
    move: "R'",
    title: "Right face counter-clockwise",
    detail: "The right face closes it. Net result: one top counter-turn, no top motor.",
  },
]

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
    detail: "Counter-clockwise top turn — the same 13-move equivalence run in reverse.",
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

const getInitialRubiksMove = () => {
  if (typeof window === "undefined") return 0

  const requestedMove = Number.parseInt(new URLSearchParams(window.location.search).get("move") || "", 10)

  if (!Number.isNaN(requestedMove) && requestedMove >= 1 && requestedMove <= rubiksMoveTrace.length) {
    return requestedMove - 1
  }

  return 0
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

const PCCoolingScene = dynamic(() => import("@/components/project-detail/pc-cooling-scene"), {
  ssr: false,
  loading: () => (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      style={{ aspectRatio: "4 / 3", minHeight: 280, background: "linear-gradient(180deg, #050810 0%, #0b1220 100%)" }}
    />
  ),
})

type WatchWaveDriftProps = {
  height?: number
  density?: number
  tone?: string
  accentTone?: string
  speed?: "slow" | "fast"
  className?: string
  idPrefix: string
}

function WatchWaveDrift({
  height = 260,
  density = 8,
  tone = "rgba(156, 180, 204, 0.16)",
  accentTone = "rgba(212, 165, 87, 0.28)",
  speed = "slow",
  className = "",
  idPrefix,
}: WatchWaveDriftProps) {
  const lines = Array.from({ length: density })
  const renderLines = (offset = 0) =>
    lines.map((_, index) => {
      const y = (height / (density + 1)) * (index + 1)
      const amplitude = 14 + (index % 3) * 6
      const phase = index % 2 === 0 ? 0 : 60
      const path = `M -40 ${y} C 100 ${y - amplitude}, 240 ${y + amplitude}, 400 ${y} S 720 ${y - amplitude}, 880 ${y} S 1200 ${y + amplitude}, 1640 ${y - amplitude + phase * 0.05}`
      const isAccent = index === Math.floor(density / 2)

      return (
        <path
          key={`${offset}-${index}`}
          d={path}
          fill="none"
          stroke={`url(#${idPrefix}-${isAccent ? "accent" : "fade"})`}
          strokeWidth={isAccent ? 1.4 : 0.9}
          strokeLinecap="round"
          transform={offset ? `translate(${offset} 0)` : undefined}
        />
      )
    })

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <svg
        viewBox={`0 0 1600 ${height}`}
        preserveAspectRatio="none"
        className={`block h-full w-[200%] ${speed === "slow" ? "watch-wave-drift-slow" : "watch-wave-drift-fast"}`}
      >
        <defs>
          <linearGradient id={`${idPrefix}-fade`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={tone} stopOpacity="0" />
            <stop offset="0.18" stopColor={tone} stopOpacity="1" />
            <stop offset="0.78" stopColor={tone} stopOpacity="1" />
            <stop offset="1" stopColor={tone} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-accent`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={accentTone} stopOpacity="0" />
            <stop offset="0.45" stopColor={accentTone} stopOpacity="1" />
            <stop offset="0.65" stopColor={accentTone} stopOpacity="1" />
            <stop offset="1" stopColor={accentTone} stopOpacity="0" />
          </linearGradient>
        </defs>
        {renderLines(0)}
        {renderLines(1600)}
      </svg>
    </div>
  )
}

// ─── Project 6 (Custom Watch Build) helpers ──────────────────────────────
type BuildStepData = {
  icon: React.ComponentType<{ className?: string }>
  kicker: string
  title: string
  body: string
}

const watchBuildSteps: BuildStepData[] = [
  { icon: Layers, kicker: "01", title: "Source", body: "Case, dial, hands, crystal, crown, bracelet — each verified against the NH35 footprint before it ships." },
  { icon: Wrench, kicker: "02", title: "Seat", body: "Movement into case. Dial onto movement. Both under loupe, dust blower close, room sealed." },
  { icon: Hammer, kicker: "03", title: "Press", body: "Hour, minute, second hands pressed individually. Aligned and clear through every full rotation." },
  { icon: CheckCircle2, kicker: "04", title: "Verify", body: "Crystal seated, case back pressed, crown installed. Then it earns the wrist for 24 hours." },
]

const watchTickerTerms = [
  "Caliber NH35A", "21,600 vph", "24 jewels", "41.0 mm case", "Sapphire crystal",
  "Hand-pressed indices", "Dust-free assembly", "Hi-beat regulation", "Hacking seconds",
  "Bidirectional rotor", "Glass press", "Movement holder", "Loupe + Rodico",
]

function WatchSubdial({
  className = "",
  labelTop = "21.6K",
  labelBottom = "VPH",
}: {
  className?: string
  labelTop?: string
  labelBottom?: string
}) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.5" />
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * Math.PI * 2 - Math.PI / 2
          const isMajor = i % 5 === 0
          const inner = isMajor ? 38 : 42
          const outer = 46
          const x1 = 50 + Math.cos(angle) * inner
          const y1 = 50 + Math.sin(angle) * inner
          const x2 = 50 + Math.cos(angle) * outer
          const y2 = 50 + Math.sin(angle) * outer
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="currentColor"
              strokeOpacity={isMajor ? 0.85 : 0.35}
              strokeWidth={isMajor ? 1 : 0.5}
              strokeLinecap="round"
            />
          )
        })}
        <text x="50" y="28" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="5" letterSpacing="0.5" fill="currentColor" opacity="0.55">{labelTop}</text>
        <text x="50" y="80" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4" letterSpacing="0.5" fill="currentColor" opacity="0.45">{labelBottom}</text>
        <g className="watch-subdial-hand">
          <line x1="50" y1="50" x2="50" y2="12" stroke="rgb(245 158 11)" strokeOpacity="0.85" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="50" y1="50" x2="50" y2="56" stroke="rgb(245 158 11)" strokeOpacity="0.6" strokeWidth="1.1" strokeLinecap="round" />
        </g>
        <circle cx="50" cy="50" r="1.6" fill="rgb(245 158 11)" />
      </svg>
    </div>
  )
}

function BezelHalo({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden>
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(245,158,11,0.22)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(245,158,11,0.10)" strokeWidth="0.5" />
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * 360
          const isMajor = i % 5 === 0
          return (
            <g key={i} transform={`rotate(${angle} 100 100)`}>
              <line
                x1="100"
                y1={isMajor ? 4 : 6}
                x2="100"
                y2={isMajor ? 12 : 9}
                stroke={isMajor ? "rgba(245,158,11,0.55)" : "rgba(245,158,11,0.20)"}
                strokeWidth={isMajor ? 1 : 0.4}
                strokeLinecap="round"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function BuildRow({ step }: { step: BuildStepData }) {
  const Icon = step.icon
  return (
    <li className="group relative grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 border-t border-foreground/15 py-7 transition-colors hover:bg-amber-500/[0.03] md:gap-x-10 md:py-9">
      <span className="font-serif text-[2.6rem] leading-[0.85] text-amber-600/85 md:text-[3.4rem]">
        {step.kicker}
      </span>
      <div>
        <div className="flex items-center gap-3">
          <h3 className="font-serif text-[1.4rem] tracking-tight text-foreground/90 md:text-[1.75rem]">
            {step.title}
          </h3>
          <span aria-hidden className="h-px w-6 bg-amber-500/35 md:w-10" />
        </div>
        <p className="mt-1.5 max-w-md text-[13.5px] leading-[1.6] text-foreground/60 md:max-w-lg md:text-[14.5px]">
          {step.body}
        </p>
      </div>
      <Icon className="hidden h-4 w-4 text-amber-600/60 group-hover:text-amber-500 sm:block" />
    </li>
  )
}

function SectionRule({ numeral, label }: { numeral: string; label: string }) {
  return (
    <div className="mx-auto my-16 flex max-w-6xl items-center gap-5 px-4 md:my-20">
      <span aria-hidden className="h-px flex-1 bg-foreground/15" />
      <span className="flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.34em] text-foreground/45">
        <span className="font-serif text-[1.4rem] italic leading-none text-amber-600/80">{numeral}</span>
        {label}
      </span>
      <span aria-hidden className="h-px flex-1 bg-foreground/15" />
    </div>
  )
}

function HorologyMarquee() {
  const all = [...watchTickerTerms, ...watchTickerTerms]
  return (
    <div className="relative overflow-hidden border-y border-foreground/12 bg-foreground/[0.02] py-3" aria-hidden>
      <div className="flex w-max gap-10 whitespace-nowrap watch-marquee-track">
        {all.map((term, i) => (
          <span key={i} className="flex items-center gap-10 font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45">
            {term}
            <span className="block h-1 w-1 rounded-full bg-amber-500/50" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  )
}

function ProjectDetailClient() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeRubiksMove, setActiveRubiksMove] = useState(getInitialRubiksMove)
  const [rubiksPreviewMode, setRubiksPreviewMode] = useState<RubiksPreviewMode>(getInitialRubiksPreviewMode)
  const [rubiksReplayKey, setRubiksReplayKey] = useState(0)
  const [rubiksDirection, setRubiksDirection] = useState<RubiksDirection>(getInitialRubiksDirection)
  const [isRubiksSequencePlaying, setIsRubiksSequencePlaying] = useState(false)
  const [showRubiksVideo, setShowRubiksVideo] = useState(false)
  const [coolingAirflowMode, setCoolingAirflowMode] = useState<"stock" | "ducted">("ducted")

  const activeRubiksObjective = rubiksObjectives[rubiksDirection]
  const activeMoveSequence = activeRubiksObjective.trace
  const safeRubiksMove = Math.min(activeRubiksMove, activeMoveSequence.length - 1)
  const activeRubiksTrace = activeMoveSequence[safeRubiksMove]
  const activeRubiksVisual = getRubiksMoveVisual(activeRubiksTrace.move)
  const isRubiksFinalStep = safeRubiksMove === activeMoveSequence.length - 1
  const shouldHighlightTopFace = isRubiksFinalStep && rubiksPreviewMode !== "start"
  const showRubiksFinalOutcome = isRubiksFinalStep && rubiksPreviewMode === "result"

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxAltPrefix, setLightboxAltPrefix] = useState("")

  // Construction slideshow modal state (project 1 only)
  const [slideshowOpen, setSlideshowOpen] = useState(false)
  const [slideshowImages, setSlideshowImages] = useState<string[]>([])
  const [slideshowIndex, setSlideshowIndex] = useState(0)
  const [slideshowAltPrefix, setSlideshowAltPrefix] = useState("")

  const [exteriorIndex, setExteriorIndex] = useState(0)
  const [interiorIndex, setInteriorIndex] = useState(0)
  const [finishedIndex, setFinishedIndex] = useState(0)
  const [additionalIndex, setAdditionalIndex] = useState(0)

  useEffect(() => {
    const projectId = Array.isArray(id) ? Number.parseInt(id[0]) : Number.parseInt(id as string)
    const foundProject = projectsData.find((p) => p.id === projectId)

    if (foundProject) {
      setProject(foundProject)
      setShowRubiksVideo(false)
    } else {
      console.error(`Project with ID ${projectId} not found`)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    if (!project || lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [project, lightboxOpen])

  useEffect(() => {
    if (!project || !window.location.hash) return

    requestAnimationFrame(() => {
      document.querySelector(window.location.hash)?.scrollIntoView()
    })
  }, [project])

  useEffect(() => {
    if (!project) return

    const requestedMove = Number.parseInt(new URLSearchParams(window.location.search).get("move") || "", 10)

    if (!Number.isNaN(requestedMove) && requestedMove >= 1 && requestedMove <= rubiksMoveTrace.length) {
      setActiveRubiksMove(requestedMove - 1)
    }

    setRubiksDirection(getInitialRubiksDirection())
    setRubiksPreviewMode(getInitialRubiksPreviewMode())
  }, [project])

  useEffect(() => {
    if (!isRubiksSequencePlaying) return

    setRubiksPreviewMode("animate")

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

  // Lightbox functions
  const openLightbox = (images: string[], index: number, altPrefix: string) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxAltPrefix(altPrefix)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  // Construction slideshow handlers
  const openSlideshow = (images: string[], index: number, altPrefix: string) => {
    setSlideshowImages(images)
    setSlideshowIndex(index)
    setSlideshowAltPrefix(altPrefix)
    setSlideshowOpen(true)
  }

  const closeSlideshow = () => {
    setSlideshowOpen(false)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)
  }

  const previousImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)
  }

  // Gallery navigation functions for Construction project
  const navigateExterior = (direction: "prev" | "next") => {
    if (!project?.exteriorGallery) return
    const length = project.exteriorGallery.length
    setExteriorIndex((prev) => (direction === "next" ? (prev + 1) % length : (prev - 1 + length) % length))
  }

  const navigateInterior = (direction: "prev" | "next") => {
    if (!project?.interiorGallery) return
    const length = project.interiorGallery.length
    setInteriorIndex((prev) => (direction === "next" ? (prev + 1) % length : (prev - 1 + length) % length))
  }

  const navigateFinished = (direction: "prev" | "next") => {
    if (!project?.finishedProductGallery) return
    const length = project.finishedProductGallery.length
    setFinishedIndex((prev) => (direction === "next" ? (prev + 1) % length : (prev - 1 + length) % length))
  }

  const navigateAdditional = (direction: "prev" | "next") => {
    if (!project?.miscellaneousGallery) return
    const length = project.miscellaneousGallery.length
    setAdditionalIndex((prev) => (direction === "next" ? (prev + 1) % length : (prev - 1 + length) % length))
  }

  if (loading) {
    return (
      <main className="min-h-dvh bg-background flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </main>
    )
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
    <main className="min-h-dvh bg-background pt-24 pb-8">
      <div className="container mx-auto px-3 max-w-7xl">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        {/* Construction project layout */}
        {project.id === 1 ? (
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
                  selectedIndex={exteriorIndex}
                  onImageClick={openSlideshow}
                  onNavigate={navigateExterior}
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
                  selectedIndex={interiorIndex}
                  onImageClick={openSlideshow}
                  onNavigate={navigateInterior}
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
                  selectedIndex={finishedIndex}
                  onImageClick={openSlideshow}
                  onNavigate={navigateFinished}
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
                  selectedIndex={additionalIndex}
                  onImageClick={openSlideshow}
                  onNavigate={navigateAdditional}
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
              onClose={closeSlideshow}
              altPrefix={slideshowAltPrefix}
            />
          </div>
        ) : project.id === 2 ? (
          /* Micromouse project layout */
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
        ) : project.id === 3 ? (
          /* PC Cooling project with story steps layout */
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

          </div>
        ) : project.id === 4 ? (
          /* UR5e Robotic Writing System */
          <div className="space-y-8">
            <ProjectHeader project={project} />

            {/* Main Project Image */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="relative aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
            </div>

            {/* Project Description */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base">{project.longDescription}</p>
              </div>

              {(project.liveUrl || project.githubUrl) && (
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  {project.liveUrl && (
                    <Button asChild>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button variant="outline" asChild>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <GithubIcon size={16} />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Video Demonstrations */}
            {project.videoGallery && <VideoGallery title="Watch It In Action" videos={project.videoGallery} />}

            {/* Image Gallery */}
            {project.gallery && (
              <ImageGallery
                title="Project Photos"
                images={project.gallery}
                onImageClick={openLightbox}
                altPrefix="UR5e robotic writing system photo"
                columns="grid-cols-1 md:grid-cols-2"
                imageHeight="h-48 md:h-64"
              />
            )}

            {/* What I Learned */}
            <div className="bg-muted/10 rounded-lg p-6 border">
              <h2 className="text-xl font-bold text-center mb-6">What I Learned</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-3 text-primary">Key Skills</h3>
                  <ul className="space-y-2">
                    {project.learnings?.map((learning, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-foreground/80 text-sm">{learning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-3 text-primary">Challenges</h3>
                  <p className="text-foreground/80 leading-relaxed text-sm">{project.challenges}</p>
                </div>
              </div>
            </div>
          </div>
        ) : project.id === 5 ? (
          /* Cat Door project layout */
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
        ) : project.id === 7 ? (
          /* Rubik's Cube Solver layout */
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
                      src={`https://www.youtube.com/embed/${project.videoGallery[0].id}?autoplay=1&rel=0`}
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
        ) : project.id === 6 ? (
          /* Custom Watch Build — editorial / craft layout (redesigned) */
          <div className="relative overflow-hidden pb-20 text-foreground">
            {/* Ambient backdrop washes */}
            <div aria-hidden className="pointer-events-none absolute inset-x-[-12%] top-[-7rem] h-[34rem] bg-[radial-gradient(circle_at_52%_18%,rgba(217,119,6,0.13),transparent_30%),radial-gradient(circle_at_76%_46%,rgba(59,130,246,0.07),transparent_26%)]" />
            <WatchWaveDrift
              idPrefix="watch-amb-a"
              height={520}
              density={10}
              speed="slow"
              tone="rgba(156,180,204,0.10)"
              accentTone="rgba(212,165,87,0.16)"
              className="absolute inset-x-0 top-[34rem] h-[34rem] opacity-[0.40]"
            />

            <div className="relative">
              {/* ============================================================ */}
              {/* HERO                                                          */}
              {/* ============================================================ */}
              <section className="relative overflow-hidden rounded-2xl border border-stone-900/10 bg-stone-50 text-stone-900 shadow-xl shadow-stone-900/[0.05] dark:border-white/10 dark:bg-[#050507] dark:text-white dark:shadow-2xl dark:shadow-black/45">
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(115deg,rgba(217,119,6,0.07),transparent_42%),linear-gradient(90deg,rgba(68,64,60,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(68,64,60,0.03)_1px,transparent_1px)] bg-[size:auto,56px_56px,56px_56px] dark:bg-[linear-gradient(115deg,rgba(217,119,6,0.10),transparent_42%),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
                <WatchWaveDrift
                  idPrefix="watch-hero-light"
                  height={520}
                  density={11}
                  speed="slow"
                  tone="rgba(120,100,80,0.16)"
                  accentTone="rgba(180,130,60,0.28)"
                  className="absolute inset-x-0 top-0 h-full opacity-[0.6] dark:hidden"
                />
                <WatchWaveDrift
                  idPrefix="watch-hero-dark"
                  height={520}
                  density={11}
                  speed="slow"
                  tone="rgba(156,180,204,0.15)"
                  accentTone="rgba(212,165,87,0.30)"
                  className="absolute inset-x-0 top-0 hidden h-full opacity-[0.55] dark:block"
                />
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_54%_48%,rgba(217,119,6,0.07),transparent_48%)] dark:bg-[radial-gradient(ellipse_at_54%_48%,rgba(212,165,87,0.08),transparent_48%)]" />

                {/* Watch ghosted on the right (also clickable to expand) */}
                <button
                  type="button"
                  onClick={() => openLightbox([project.image || "/placeholder.svg"], 0, project.title)}
                  aria-label="Open cover photo full screen"
                  className="group absolute inset-y-0 right-0 w-full cursor-zoom-in md:w-[55%] lg:w-[50%]"
                >
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt=""
                    fill
                    className="object-cover object-top opacity-[0.40] saturate-[0.85] mix-blend-multiply dark:opacity-[0.16] dark:saturate-[1.05] dark:mix-blend-normal md:opacity-[0.55] md:dark:opacity-[0.36]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-50 via-stone-50/72 to-stone-50/22 md:via-stone-50/55 md:to-transparent dark:from-[#050507] dark:via-[#050507]/72 dark:to-[#050507]/22 dark:md:via-[#050507]/55 dark:md:to-transparent" />
                  <span aria-hidden className="pointer-events-none absolute bottom-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-900/20 bg-stone-50/70 text-stone-700 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 dark:border-white/30 dark:bg-black/40 dark:text-white/85">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </span>
                </button>

                {/* Animated subdial — top-right of hero */}
                <div className="absolute right-6 top-6 z-10 hidden h-16 w-16 text-amber-700/85 sm:block md:right-10 md:top-10 md:h-20 md:w-20 dark:text-amber-200/75">
                  <WatchSubdial labelTop="21.6K" labelBottom="VPH" />
                </div>

                <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-16 text-center sm:px-8 md:py-24 lg:py-28">
                  <div className="mb-7 inline-flex rounded-full border border-amber-700/25 bg-amber-100/85 px-4 py-1.5 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.28em] text-amber-800 dark:border-amber-300/25 dark:bg-amber-300/10 dark:text-amber-100/85">
                    Custom Build
                  </div>

                  <h1 className="font-serif text-[2.4rem] font-medium leading-[1.04] tracking-tight sm:text-5xl md:text-[4.5rem] lg:text-[5rem]">
                    A mechanical watch,
                    <br />
                    <span className="italic text-amber-700 dark:text-amber-100">assembled by hand.</span>
                  </h1>

                  <p className="mt-7 max-w-md text-[14px] leading-[1.7] text-stone-600 sm:text-[15px] dark:text-white/65">
                    Built by hand around a Seiko NH35.
                  </p>
                </div>
              </section>

              {/* ============================================================ */}
              {/* THE BUILD — clean editorial plate                            */}
              {/* ============================================================ */}
              <section className="relative mt-10 md:mt-14">
                <div className="relative overflow-hidden rounded-2xl border border-stone-900/10 bg-stone-50 text-stone-900 shadow-xl shadow-stone-900/[0.05] dark:border-white/10 dark:bg-[#050507] dark:text-white dark:shadow-2xl dark:shadow-black/40">
                  <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,rgba(217,119,6,0.07),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_50%_28%,rgba(245,158,11,0.10),transparent_55%)]" />
                  <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(68,64,60,0.04)_1px,transparent_1px),linear-gradient(0deg,rgba(68,64,60,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-60 dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.02)_1px,transparent_1px)] dark:opacity-50" />
                  <WatchWaveDrift
                    idPrefix="watch-banner-wave-light"
                    height={420}
                    density={9}
                    speed="slow"
                    tone="rgba(120,100,80,0.12)"
                    accentTone="rgba(180,130,60,0.20)"
                    className="absolute inset-x-0 top-0 h-full opacity-[0.5] dark:hidden"
                  />
                  <WatchWaveDrift
                    idPrefix="watch-banner-wave-dark"
                    height={420}
                    density={9}
                    speed="slow"
                    tone="rgba(156,180,204,0.10)"
                    accentTone="rgba(212,165,87,0.16)"
                    className="absolute inset-x-0 top-0 hidden h-full opacity-[0.4] dark:block"
                  />

                  <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20 lg:py-24">
                    {/* Top register */}
                    <div className="mb-10 flex items-baseline justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.32em] md:mb-14">
                      <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-200/85">
                        <span aria-hidden className="block h-1 w-1 rounded-full bg-amber-600 dark:bg-amber-300/80" />
                        The finished build
                      </div>
                      <div className="text-stone-500 dark:text-white/40">NH35A — 41 mm</div>
                    </div>

                    {/* Magazine spread: photo left, type right */}
                    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.55fr_1fr] md:gap-12 lg:gap-16">
                      <button
                        type="button"
                        onClick={() => openLightbox(["/images/watch/grand-seiko.jpg"], 0, project.title)}
                        aria-label="Open finished build photo full screen"
                        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl"
                      >
                        <Image
                          src="/images/watch/grand-seiko.jpg"
                          alt={project.title}
                          width={1400}
                          height={1280}
                          className="h-auto w-full object-contain transition-transform ease-out group-hover:scale-[1.012] [transition-duration:800ms]"
                          priority
                        />
                        {/* Expand affordance */}
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/55 via-black/15 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-4">
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/85">
                            Tap to expand
                          </span>
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur-sm sm:h-8 sm:w-8">
                            <Maximize2 className="h-3.5 w-3.5" />
                          </span>
                        </span>
                      </button>

                      <div className="relative">
                        <div className="mb-6 flex items-center gap-3 md:mb-7">
                          <span aria-hidden className="h-px w-10 bg-amber-700/55 dark:bg-amber-300/55" />
                          <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-amber-700 dark:text-amber-200/85">
                            Reference 001
                          </span>
                        </div>

                        <h2 className="font-serif text-[2rem] font-medium leading-[1.06] tracking-tight sm:text-[2.6rem] md:text-[3rem] lg:text-[3.5rem]">
                          Off the bench,
                          <br />
                          <span className="italic text-amber-700 dark:text-amber-100/95">onto the wrist.</span>
                        </h2>

                        <dl className="mt-8 divide-y divide-stone-900/10 border-y border-stone-900/10 text-[13px] dark:divide-white/10 dark:border-white/10">
                          {[
                            ["Caliber", "Seiko NH35A"],
                            ["Beat rate", "21,600 vph"],
                            ["Reserve", "41 hours"],
                            ["Diameter", "41.0 mm"],
                          ].map(([k, v]) => (
                            <div key={k} className="grid grid-cols-[7rem_1fr] items-baseline gap-4 py-2.5">
                              <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone-500 dark:text-white/45">{k}</dt>
                              <dd className="font-serif text-stone-800 dark:text-white/85">{v}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ============================================================ */}
              {/* CHALLENGES & LEARNINGS                                        */}
              {/* ============================================================ */}
              <section className="mx-auto mt-16 max-w-6xl px-4 md:mt-20">
                <div className="mb-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 border-b border-foreground/15 pb-5 font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/45 md:text-[11px] md:tracking-[0.34em]">
                  <span>Sourcing</span>
                  <span aria-hidden className="text-foreground/20">·</span>
                  <span>Hand setting</span>
                  <span aria-hidden className="text-foreground/20">·</span>
                  <span>Sealed bench</span>
                  <span aria-hidden className="text-foreground/20">·</span>
                  <span>Steady hands</span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[
                    { icon: Layers, kicker: "Challenge", title: "Sourcing", body: "Most parts marketed for the NH35 aren't. Each one verified before it shipped." },
                    { icon: Wrench, kicker: "Challenge", title: "Hand setting", body: "Press too hard, scratch the dial. Press too soft, the hand slips at six." },
                    { icon: CheckCircle2, kicker: "Learnt", title: "Patience pays", body: "Small tolerances reward slow hands. Rushing always meant starting over." },
                  ].map(({ icon: Icon, kicker, title, body }) => (
                    <div key={title} className="group rounded-xl border border-border/60 bg-background/45 p-5 shadow-lg shadow-black/[0.03] transition-colors hover:border-amber-500/35 hover:bg-amber-500/[0.045]">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">{kicker}</div>
                        <div className="grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-background/70 text-amber-500 transition-colors group-hover:border-amber-500/40">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <h3 className="font-serif text-2xl font-medium tracking-tight">{title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/62">{body}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quiet divider */}
              <div className="mx-auto my-16 flex max-w-4xl items-center gap-4 px-4 md:my-20">
                <span aria-hidden className="h-px flex-1 bg-foreground/15" />
                <span aria-hidden className="block h-1 w-1 rounded-full bg-amber-500/60" />
                <span aria-hidden className="h-px flex-1 bg-foreground/15" />
              </div>

              {/* ============================================================ */}
              {/* VIDEO                                                         */}
              {/* ============================================================ */}
              {project.videoGallery && project.videoGallery[0] && (
                <section className="mx-auto max-w-5xl px-4">
                  <div className="mb-5 flex items-baseline justify-between gap-4 px-1 font-mono text-[10px] uppercase tracking-[0.30em] text-foreground/45">
                    <div className="flex items-center gap-2.5">
                      <span aria-hidden className="relative inline-block h-2 w-2">
                        <span className="absolute inset-0 rounded-full bg-amber-500/85" />
                        <span className="absolute inset-0 rounded-full bg-amber-500/85 watch-pulse" />
                      </span>
                      Rec
                    </div>
                    <div className="text-foreground/35">2:14 · build</div>
                  </div>
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/35">
                    <iframe
                      src={`https://www.youtube.com/embed/${project.videoGallery[0].id}`}
                      title={project.videoGallery[0].title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                    <span aria-hidden className="absolute left-3 top-3 h-3 w-3 border-l border-t border-amber-200/45" />
                    <span aria-hidden className="absolute right-3 top-3 h-3 w-3 border-r border-t border-amber-200/45" />
                    <span aria-hidden className="absolute left-3 bottom-3 h-3 w-3 border-l border-b border-amber-200/45" />
                    <span aria-hidden className="absolute right-3 bottom-3 h-3 w-3 border-r border-b border-amber-200/45" />
                  </div>
                </section>
              )}

              {/* End mark */}
              <div className="mx-auto mt-16 flex max-w-xs items-center gap-3 px-4 md:mt-20">
                <span aria-hidden className="h-px flex-1 bg-foreground/20" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-600/70">Fin</span>
                <span aria-hidden className="h-px flex-1 bg-foreground/20" />
              </div>
            </div>
          </div>
        ) : (
          /* Default project layout for any other projects */
          <div className="space-y-8">
            <ProjectHeader project={project} />

            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="relative aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
            </div>

            <div className="bg-muted/10 rounded-lg p-6 border">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base">{project.longDescription}</p>
              </div>

              {(project.liveUrl || project.githubUrl) && (
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  {project.liveUrl && (
                    <Button asChild>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button variant="outline" asChild>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <GithubIcon size={16} />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="bg-muted/10 rounded-lg p-6 border">
              <Tabs defaultValue="features" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="features">Key Features</TabsTrigger>
                  <TabsTrigger value="technologies">Technologies</TabsTrigger>
                  <TabsTrigger value="challenges">Challenges</TabsTrigger>
                </TabsList>
                <TabsContent value="features" className="mt-4">
                  <h2 className="text-lg font-bold mb-4">Key Features</h2>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="technologies" className="mt-4">
                  <h2 className="text-lg font-bold mb-4">Technologies Used</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(project.technologies).map(([category, items]) => (
                      <div key={category}>
                        <h3 className="font-bold mb-2 capitalize text-sm">
                          {category.replace(/([A-Z])/g, " $1").trim()}
                        </h3>
                        <ul className="space-y-1">
                          {items.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-primary">•</span>
                              <span className="text-xs">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="challenges" className="mt-4">
                  <h2 className="text-lg font-bold mb-4">Challenges & Solutions</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-sm">{project.challenges}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

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
