"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play, Route, Timer } from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// Interactive NH35A movement explainer.
// Rotation is driven by SVG <animateTransform> (type="rotate" angle cx cy) so
// every part turns about its true centre/pivot — gears spin in place, the rotor
// and pallet fork swing about their pivots. Pausable + slow-mo + guided tour.
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#f59e0b" // amber-500 — reads on light and dark

type Part = {
  id: string
  num: number
  name: string
  role: string
  marker: [number, number]
  desc: string
}

const PARTS: Part[] = [
  {
    id: "rotor",
    num: 1,
    name: "Automatic rotor",
    role: "Winds the mainspring",
    marker: [330, 92],
    desc: "The half-moon weight on the back swings with every move of your wrist. Seiko's Magic Lever pawl system turns that motion — in both directions — into winding, quietly topping up the mainspring all day long.",
  },
  {
    id: "barrel",
    num: 2,
    name: "Mainspring barrel",
    role: "Stores the energy",
    marker: [140, 300],
    desc: "A flat spring coiled inside the barrel is the fuel tank. Wound tight it holds roughly 41 hours of running time, then releases it gradually as it unwinds — the single source of power for everything downstream.",
  },
  {
    id: "train",
    num: 3,
    name: "Gear train",
    role: "Carries the power",
    marker: [305, 300],
    desc: "Centre, third and fourth wheels pass the barrel's torque along, trading force for speed at every mesh. The same train also carries the seconds, minutes and hours out to the hands.",
  },
  {
    id: "escape",
    num: 4,
    name: "Escape wheel",
    role: "Releases it in beats",
    marker: [470, 300],
    desc: "Here motion becomes time. The escape wheel can only advance when the pallet fork lets it — one tooth, a pause, the next. That start-stop release is the 'tick' you hear.",
  },
  {
    id: "fork",
    num: 5,
    name: "Pallet fork",
    role: "Locks and unlocks",
    marker: [540, 248],
    desc: "A tiny jewelled lever rocking between the escape wheel and the balance. Each swing it frees one tooth and hands the balance a small push to keep it going — lock, impulse, unlock, repeat.",
  },
  {
    id: "balance",
    num: 6,
    name: "Balance & hairspring",
    role: "Keeps the time",
    marker: [612, 300],
    desc: "The beating heart. The balance swings back and forth on its hairspring at 21,600 vibrations an hour — six beats every second. That metronomic rhythm is what divides a day into reliable seconds.",
  },
]

const WM_CSS = `
@keyframes wmBeat { 0%,100% { opacity: .3; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }
@media (prefers-reduced-motion: reduce) { .wm-beat { animation: none !important; } }
`

const rnd = (n: number) => Math.round(n * 100) / 100

// Flat-topped cog outline centred on the origin.
function gearPath(r: number, teeth: number, depth = 0.15): string {
  const rIn = r * (1 - depth)
  const step = (Math.PI * 2) / teeth
  const w = step * 0.5
  const pt = (a: number, rad: number) => `${(Math.cos(a) * rad).toFixed(2)} ${(Math.sin(a) * rad).toFixed(2)}`
  let d = ""
  for (let i = 0; i < teeth; i++) {
    const a = i * step
    d += `${i === 0 ? "M" : "L"} ${pt(a - w * 0.55, rIn)} L ${pt(a - w * 0.26, r)} L ${pt(a + w * 0.26, r)} L ${pt(a + w * 0.55, rIn)} `
  }
  return d + "Z"
}

function escapePath(r: number, teeth: number): string {
  const rIn = r * 0.68
  const step = (Math.PI * 2) / teeth
  const pt = (a: number, rad: number) => `${(Math.cos(a) * rad).toFixed(2)} ${(Math.sin(a) * rad).toFixed(2)}`
  let d = ""
  for (let i = 0; i < teeth; i++) {
    const a = i * step
    d += `${i === 0 ? "M" : "L"} ${pt(a, rIn)} L ${pt(a, r)} L ${pt(a + step * 0.62, r)} `
  }
  return d + "Z"
}

function spiralPath(turns: number, rMax: number): string {
  const steps = Math.round(turns * 36)
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = t * turns * Math.PI * 2
    const rad = rMax * t
    pts.push(`${(Math.cos(a) * rad).toFixed(2)} ${(Math.sin(a) * rad).toFixed(2)}`)
  }
  return "M " + pts.join(" L ")
}

function Cog({ r, teeth, spokes = 5, hub = 0.26 }: { r: number; teeth: number; spokes?: number; hub?: number }) {
  return (
    <g>
      <circle r={r * (1 - 0.15)} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeWidth={1.1} strokeOpacity={0.45} />
      <path d={gearPath(r, teeth)} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeWidth={1.2} strokeOpacity={0.75} />
      {Array.from({ length: spokes }).map((_, i) => {
        const a = (i / spokes) * Math.PI * 2
        return (
          <line
            key={i}
            x1={rnd(Math.cos(a) * r * hub)}
            y1={rnd(Math.sin(a) * r * hub)}
            x2={rnd(Math.cos(a) * r * (1 - 0.22))}
            y2={rnd(Math.sin(a) * r * (1 - 0.22))}
            stroke="currentColor"
            strokeWidth={1.1}
            strokeOpacity={0.45}
          />
        )
      })}
      <circle r={r * hub} fill="currentColor" fillOpacity={0.16} stroke="currentColor" strokeWidth={1.1} strokeOpacity={0.7} />
      <circle r={2.2} fill="currentColor" />
    </g>
  )
}

export default function WatchMovement() {
  const [active, setActive] = useState<string | null>(null)
  const [running, setRunning] = useState(true)
  const [slow, setSlow] = useState(false)
  const [tour, setTour] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  const mult = slow ? 3.4 : 1
  const dur = (base: number) => (base * mult).toFixed(2)

  // Respect reduced-motion on first mount.
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRunning(false)
    }
  }, [])

  // Pause / resume the whole SVG SMIL timeline.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    if (running) svg.unpauseAnimations()
    else svg.pauseAnimations()
  }, [running, slow])

  // Guided power-flow tour.
  useEffect(() => {
    if (!tour) return
    let i = 0
    setActive(PARTS[0].id)
    const t = setInterval(() => {
      i += 1
      if (i >= PARTS.length) {
        setTour(false)
        setActive(null)
        return
      }
      setActive(PARTS[i].id)
    }, 2600)
    return () => clearInterval(t)
  }, [tour])

  // ── SMIL rotation helpers — all rotate about local (0,0) = the part's pivot ──
  const spin = (base: number, reverse = false) => {
    const d = dur(base)
    return (
      <animateTransform
        key={`spin-${d}-${reverse}`}
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="0 0 0"
        to={`${reverse ? -360 : 360} 0 0`}
        dur={`${d}s`}
        repeatCount="indefinite"
      />
    )
  }
  const osc = (base: number, amp: number) => {
    const d = dur(base)
    return (
      <animateTransform
        key={`osc-${d}-${amp}`}
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values={`${-amp} 0 0;${amp} 0 0;${-amp} 0 0`}
        keyTimes="0;0.5;1"
        dur={`${d}s`}
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
      />
    )
  }
  const tick = (base: number, teeth: number, reverse = false) => {
    const d = dur(base)
    const dir = reverse ? -1 : 1
    const vals = Array.from({ length: teeth + 1 }, (_, i) => `${((dir * 360 * i) / teeth).toFixed(2)} 0 0`).join(";")
    const kt = Array.from({ length: teeth + 1 }, (_, i) => (i / teeth).toFixed(4)).join(";")
    return (
      <animateTransform
        key={`tick-${d}`}
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values={vals}
        keyTimes={kt}
        dur={`${d}s`}
        repeatCount="indefinite"
        calcMode="discrete"
      />
    )
  }

  const part = (id: string) => ({
    onMouseEnter: () => !tour && setActive(id),
    onMouseLeave: () => !tour && setActive(null),
    onFocus: () => !tour && setActive(id),
    onClick: () => setActive(id),
    tabIndex: 0,
    role: "button",
    "aria-label": PARTS.find((p) => p.id === id)?.name,
    style: {
      cursor: "pointer",
      outline: "none",
      transition: "opacity .3s ease",
      opacity: active && active !== id ? 0.28 : 1,
      color: active === id ? ACCENT : undefined,
    } as React.CSSProperties,
  })

  const activePart = PARTS.find((p) => p.id === active)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-900/10 bg-stone-50 text-stone-900 shadow-xl shadow-stone-900/[0.05] dark:border-white/10 dark:bg-[#050507] dark:text-white dark:shadow-2xl dark:shadow-black/40">
      <style dangerouslySetInnerHTML={{ __html: WM_CSS }} />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_22%,rgba(217,119,6,0.07),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_50%_22%,rgba(245,158,11,0.09),transparent_55%)]" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(120,113,108,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(120,113,108,0.04)_1px,transparent_1px)] bg-[size:38px_38px] opacity-70 dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.025)_1px,transparent_1px)]" />

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-8 md:py-14">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-amber-700/55 dark:bg-amber-300/55" />
              <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-amber-700 dark:text-amber-200/85">
                Live cutaway
              </span>
            </div>
            <h3 className="font-serif text-[1.7rem] font-medium leading-tight tracking-tight sm:text-[2.1rem]">
              How it actually runs
            </h3>
          </div>

          {/* Beat readout */}
          <div className="flex items-center gap-2.5 rounded-full border border-stone-900/10 bg-white/60 px-3.5 py-2 dark:border-white/10 dark:bg-white/[0.04]">
            <span
              className="wm-beat block h-2.5 w-2.5 rounded-full bg-amber-500"
              style={{
                animationName: "wmBeat",
                animationDuration: `${dur(1.1)}s`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationPlayState: running ? "running" : "paused",
              }}
            />
            <span className="font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-stone-600 dark:text-white/60">
              21,600 vph · 6 beats/sec
            </span>
          </div>
        </div>

        <p className="mb-6 max-w-xl text-[13.5px] leading-[1.65] text-stone-600 dark:text-white/60">
          The NH35A is fully mechanical — no battery. Follow the power from the rotor on your wrist all the way to the
          balance that keeps time. Hover a part to explore it, or take the guided tour.
        </p>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setRunning((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-stone-900/15 bg-white/70 px-4 py-2 text-xs font-medium transition-colors hover:border-amber-500/50 hover:text-amber-700 dark:border-white/15 dark:bg-white/[0.05] dark:hover:text-amber-200"
          >
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {running ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => setSlow((v) => !v)}
            aria-pressed={slow}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              slow
                ? "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-200"
                : "border-stone-900/15 bg-white/70 hover:border-amber-500/50 dark:border-white/15 dark:bg-white/[0.05]"
            }`}
          >
            <Timer className="h-3.5 w-3.5" />
            Slow-mo
          </button>
          <button
            type="button"
            onClick={() => setTour((v) => !v)}
            aria-pressed={tour}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              tour
                ? "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-200"
                : "border-stone-900/15 bg-white/70 hover:border-amber-500/50 dark:border-white/15 dark:bg-white/[0.05]"
            }`}
          >
            <Route className="h-3.5 w-3.5" />
            {tour ? "Touring…" : "Power-flow tour"}
          </button>
        </div>

        {/* Diagram */}
        <div className="overflow-hidden rounded-xl border border-stone-900/10 bg-white/40 dark:border-white/10 dark:bg-black/30">
          <svg
            ref={svgRef}
            viewBox="44 37 656 359"
            className="h-auto w-full text-stone-700 dark:text-white/75"
            role="img"
            aria-label="Interactive cutaway of the Seiko NH35A movement: rotor, mainspring barrel, gear train, escape wheel, pallet fork, and balance wheel."
          >
            {/* power-flow guide line */}
            <path
              d="M 140 300 L 250 300 L 360 300 L 470 300 L 540 270 L 612 300"
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.12}
              strokeWidth={1}
              strokeDasharray="2 6"
            />

            {/* Rotor — swings about its pivot at (330,300) */}
            <g {...part("rotor")}>
              <g transform="translate(330,300)">
                <g className="wm-mover">
                  {osc(4.6, 24)}
                  <path
                    d="M -188 0 A 188 188 0 0 1 188 0 L 162 0 A 162 162 0 0 0 -162 0 Z"
                    fill="currentColor"
                    fillOpacity={0.14}
                    stroke="currentColor"
                    strokeWidth={1.4}
                    strokeOpacity={0.7}
                  />
                  <path d="M -188 0 A 188 188 0 0 1 -150 -113" fill="none" stroke="currentColor" strokeWidth={6} strokeOpacity={0.35} strokeLinecap="round" />
                  <line x1={0} y1={0} x2={0} y2={-175} stroke="currentColor" strokeWidth={1.4} strokeOpacity={0.4} />
                  <circle r={6} fill="currentColor" fillOpacity={0.2} stroke="currentColor" strokeWidth={1.2} strokeOpacity={0.7} />
                </g>
              </g>
            </g>

            {/* Mainspring barrel */}
            <g {...part("barrel")}>
              <g transform="translate(140,300)">
                <g className="wm-mover">
                  {spin(20)}
                  <Cog r={58} teeth={26} spokes={6} />
                  <path d={spiralPath(4.4, 36)} fill="none" stroke="currentColor" strokeWidth={1.3} strokeOpacity={0.5} />
                </g>
              </g>
            </g>

            {/* Gear train (centre + third wheels) */}
            <g {...part("train")}>
              <g transform="translate(250,300)">
                <g className="wm-mover">
                  {spin(12, true)}
                  <Cog r={40} teeth={20} spokes={5} />
                </g>
              </g>
              <g transform="translate(360,300)">
                <g className="wm-mover">
                  {spin(7)}
                  <Cog r={32} teeth={16} spokes={4} />
                </g>
              </g>
            </g>

            {/* Escape wheel — steps tooth by tooth */}
            <g {...part("escape")}>
              <g transform="translate(470,300)">
                <g className="wm-mover">
                  {tick(2.6, 15, true)}
                  <circle r={18} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeWidth={1} strokeOpacity={0.4} />
                  <path d={escapePath(26, 15)} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeWidth={1.2} strokeOpacity={0.8} />
                  {Array.from({ length: 3 }).map((_, i) => {
                    const a = (i / 3) * Math.PI * 2
                    return <line key={i} x1={0} y1={0} x2={rnd(Math.cos(a) * 16)} y2={rnd(Math.sin(a) * 16)} stroke="currentColor" strokeWidth={1.1} strokeOpacity={0.45} />
                  })}
                  <circle r={2.4} fill="currentColor" />
                </g>
              </g>
            </g>

            {/* Pallet fork — rocks about its pivot at (540,270) */}
            <g {...part("fork")}>
              <g transform="translate(540,270)">
                <g className="wm-mover">
                  {osc(1.1, 9)}
                  <path d="M -24 -3.2 L 9 -3.2 L 9 3.2 L -24 3.2 Z" fill="currentColor" fillOpacity={0.14} stroke="currentColor" strokeWidth={1.2} strokeOpacity={0.75} />
                  <path d="M -24 -2 L -34 -13 L -29 -17 L -19 -5 Z" fill="currentColor" fillOpacity={0.18} stroke="currentColor" strokeWidth={1.1} strokeOpacity={0.7} />
                  <path d="M -24 2 L -36 7 L -32 12 L -19 5 Z" fill="currentColor" fillOpacity={0.18} stroke="currentColor" strokeWidth={1.1} strokeOpacity={0.7} />
                  <path d="M 9 -6 L 18 -6 L 18 -1.4 L 12.5 0 L 18 1.4 L 18 6 L 9 6 Z" fill="currentColor" fillOpacity={0.16} stroke="currentColor" strokeWidth={1.1} strokeOpacity={0.7} />
                  <circle r={3} fill="currentColor" fillOpacity={0.2} stroke="currentColor" strokeWidth={1.1} strokeOpacity={0.7} />
                </g>
              </g>
            </g>

            {/* Balance wheel + hairspring */}
            <g {...part("balance")}>
              <g transform="translate(612,300)">
                <g className="wm-mover">
                  {osc(2.2, 30)}
                  <path d={spiralPath(4.2, 22)} fill="none" stroke="currentColor" strokeWidth={1.1} strokeOpacity={0.45} />
                </g>
                <g className="wm-mover">
                  {osc(1.1, 135)}
                  <circle r={52} fill="none" stroke="currentColor" strokeWidth={3.4} strokeOpacity={0.7} />
                  <circle r={46} fill="none" stroke="currentColor" strokeWidth={1} strokeOpacity={0.28} />
                  <line x1={-52} y1={0} x2={52} y2={0} stroke="currentColor" strokeWidth={2.2} strokeOpacity={0.55} />
                  <line x1={0} y1={-52} x2={0} y2={52} stroke="currentColor" strokeWidth={2.2} strokeOpacity={0.55} />
                  {Array.from({ length: 4 }).map((_, i) => {
                    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
                    return <circle key={i} cx={rnd(Math.cos(a) * 52)} cy={rnd(Math.sin(a) * 52)} r={3.4} fill="currentColor" fillOpacity={0.5} />
                  })}
                  <circle r={5.5} fill="currentColor" fillOpacity={0.2} stroke="currentColor" strokeWidth={1.2} strokeOpacity={0.7} />
                </g>
              </g>
            </g>

            {/* Number markers */}
            {PARTS.map((p) => (
              <g key={p.id} style={{ pointerEvents: "none", color: active === p.id ? ACCENT : undefined, transition: "color .3s" }}>
                <circle
                  cx={p.marker[0]}
                  cy={p.marker[1]}
                  r={10.5}
                  fill={active === p.id ? ACCENT : "currentColor"}
                  fillOpacity={active === p.id ? 1 : 0.1}
                  stroke="currentColor"
                  strokeWidth={1.1}
                  strokeOpacity={0.6}
                />
                <text
                  x={p.marker[0]}
                  y={p.marker[1] + 3.5}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={600}
                  fill={active === p.id ? "#ffffff" : "currentColor"}
                  fillOpacity={active === p.id ? 1 : 0.7}
                >
                  {p.num}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Detail + legend */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.1fr]">
          <div className="min-h-[7.5rem] rounded-xl border border-stone-900/10 bg-white/50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            {activePart ? (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-500 text-[11px] font-semibold text-white">
                    {activePart.num}
                  </span>
                  <h4 className="font-serif text-xl font-medium tracking-tight">{activePart.name}</h4>
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-700 dark:text-amber-200/85">
                  {activePart.role}
                </div>
                <p className="mt-3 text-[13.5px] leading-[1.65] text-stone-600 dark:text-white/65">{activePart.desc}</p>
              </>
            ) : (
              <div className="flex h-full items-center text-[13.5px] leading-[1.6] text-stone-500 dark:text-white/45">
                Hover or tap a numbered part — or hit{" "}
                <span className="mx-1 font-medium text-amber-700 dark:text-amber-200">Power-flow tour</span> — to see what
                each piece does.
              </div>
            )}
          </div>

          <ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {PARTS.map((p) => {
              const on = active === p.id
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onMouseEnter={() => !tour && setActive(p.id)}
                    onMouseLeave={() => !tour && setActive(null)}
                    onClick={() => setActive(p.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                      on
                        ? "border-amber-500/50 bg-amber-500/10"
                        : "border-transparent hover:border-stone-900/10 hover:bg-stone-900/[0.03] dark:hover:border-white/10 dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                        on ? "bg-amber-500 text-white" : "bg-stone-900/8 text-stone-600 dark:bg-white/10 dark:text-white/70"
                      }`}
                    >
                      {p.num}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium">{p.name}</span>
                      <span className="block truncate text-[11px] text-stone-500 dark:text-white/45">{p.role}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
