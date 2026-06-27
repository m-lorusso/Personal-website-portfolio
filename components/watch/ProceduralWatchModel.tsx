"use client"

import { useEffect, useMemo, useRef } from "react"
import type { MutableRefObject } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { Edges } from "@react-three/drei"
import PartLabel, { type PartId } from "./PartLabel"

// ─────────────────────────────────────────────────────────────────────────────
// Procedural NH35-style mechanical watch, built entirely from Three.js
// primitives — no external .glb / texture / HDR. Each major part is its own
// named group with a base (assembled) position and an exploded offset, so the
// viewer fans the watch out along Z (the depth/layering axis). The face lies in
// the XY plane and is read from an angled front view.
//
// Visual target is a clean engineering explainer (cf. Bartosz Ciechanowski's
// watch article): matte, softly-shaded surfaces with thin dark edge outlines on
// every major part — deliberately not glossy "toy" plastic.
//
// To swap in a real model later, drop /public/models/watch.glb in and replace
// the <group> contents — the explode rig, callouts and controls can stay.
// ─────────────────────────────────────────────────────────────────────────────

const deg = (d: number) => (d * Math.PI) / 180
const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

// Flat annulus (ring) with real thickness along Z.
function makeRing(outerR: number, innerR: number, depth: number, seg = 96) {
  const shape = new THREE.Shape()
  shape.absarc(0, 0, outerR, 0, Math.PI * 2, false)
  const hole = new THREE.Path()
  hole.absarc(0, 0, innerR, 0, Math.PI * 2, true)
  shape.holes.push(hole)
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: seg })
  geo.translate(0, 0, -depth / 2)
  geo.computeVertexNormals()
  return geo
}

// Solid thin disc whose axis is Z.
function disc(r: number, depth: number, seg = 64) {
  const g = new THREE.CylinderGeometry(r, r, depth, seg)
  g.rotateX(Math.PI / 2)
  return g
}

// Bevelled disc: a thin disc with a chamfered rim, for a more machined case look.
function bevelDisc(r: number, depth: number, seg = 96) {
  const shape = new THREE.Shape()
  shape.absarc(0, 0, r, 0, Math.PI * 2, false)
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.45,
    bevelSize: depth * 0.5,
    bevelSegments: 2,
    curveSegments: seg,
  })
  geo.translate(0, 0, -depth / 2)
  geo.computeVertexNormals()
  return geo
}

// Simplified spur gear: trapezoidal teeth, centre bore, thin extrude.
function makeGear(teeth: number, rOut: number, rIn: number, depth: number, holeR: number) {
  const shape = new THREE.Shape()
  const t = (Math.PI * 2) / teeth
  let started = false
  const lineTo = (a: number, r: number) => {
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (!started) {
      shape.moveTo(x, y)
      started = true
    } else shape.lineTo(x, y)
  }
  for (let i = 0; i < teeth; i++) {
    const a = i * t
    lineTo(a, rIn)
    lineTo(a + t * 0.28, rOut)
    lineTo(a + t * 0.5, rOut)
    lineTo(a + t * 0.78, rIn)
  }
  shape.closePath()
  const hole = new THREE.Path()
  hole.absarc(0, 0, holeR, 0, Math.PI * 2, true)
  shape.holes.push(hole)
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 24 })
  geo.translate(0, 0, -depth / 2)
  geo.computeVertexNormals()
  return geo
}

// Semicircular weighted rotor rim (heavy half sits at the bottom at angle 0).
function makeRotor(rOut: number, rIn: number, depth: number) {
  const s = new THREE.Shape()
  s.absarc(0, 0, rOut, Math.PI, Math.PI * 2, false)
  s.lineTo(rIn, 0)
  s.absarc(0, 0, rIn, Math.PI * 2, Math.PI, true)
  s.closePath()
  const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 64 })
  geo.translate(0, 0, -depth / 2)
  geo.computeVertexNormals()
  return geo
}

// Dial disc with a rectangular date aperture cut out at 3 o'clock.
function makeDial(radius: number, depth: number, win: { x: number; y: number; w: number; h: number }) {
  const s = new THREE.Shape()
  s.absarc(0, 0, radius, 0, Math.PI * 2, false)
  const h = new THREE.Path()
  h.moveTo(win.x - win.w / 2, win.y - win.h / 2)
  h.lineTo(win.x - win.w / 2, win.y + win.h / 2)
  h.lineTo(win.x + win.w / 2, win.y + win.h / 2)
  h.lineTo(win.x + win.w / 2, win.y - win.h / 2)
  h.closePath()
  s.holes.push(h)
  const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 96 })
  geo.translate(0, 0, -depth / 2)
  geo.computeVertexNormals()
  return geo
}

// Hand bar that pivots at the centre and extends to +Y (12 o'clock at angle 0).
function handBar(w: number, l: number) {
  const g = new THREE.BoxGeometry(w, l, 0.04)
  g.translate(0, l / 2, 0)
  return g
}

// Per-part rig. base = assembled position, off = exploded direction. Offsets
// follow the requested layering; EXPLODE_SCALE just gives them room to breathe.
const EXPLODE_SCALE = 1.25
const LAYOUT: Record<string, { base: [number, number, number]; off: [number, number, number] }> = {
  bezel: { base: [0, 0, 0.3], off: [0, 0, 0.15] },
  crystal: { base: [0, 0, 0.26], off: [0, 0, 1.3] },
  hands: { base: [0, 0, 0.12], off: [0, 0, 1.0] },
  markers: { base: [0, 0, 0.05], off: [0, 0, 0.8] },
  chapter: { base: [0, 0, 0.04], off: [0, 0, 0.75] },
  dial: { base: [0, 0, 0.0], off: [0, 0, 0.55] },
  dateDisc: { base: [0, 0, -0.1], off: [0, 0, -0.3] },
  mainplate: { base: [0, 0, -0.3], off: [0, 0, -0.5] },
  screws: { base: [0, 0, -0.3], off: [0, 0, -1.0] },
  gears: { base: [0, 0, -0.36], off: [0, 0, -0.85] },
  bridges: { base: [0, 0, -0.42], off: [0, 0, -1.15] },
  rotor: { base: [0, 0, -0.52], off: [0, 0, -1.65] },
  crown: { base: [2.3, 0, -0.02], off: [1.3, 0, 0] },
  stem: { base: [2.0, 0, -0.02], off: [1.0, 0, 0] },
}

const SCREW_POS: [number, number][] = [
  [1.3, 1.0],
  [-1.35, 0.55],
  [-0.95, -1.15],
  [1.15, -1.1],
  [0.05, 1.45],
]

const GEAR_DEFS = [
  { geo: "gearBig", pos: [-0.45, -0.35, 0] as [number, number, number], speed: 0.5 },
  { geo: "gearMed", pos: [0.55, 0.25, 0.02] as [number, number, number], speed: -0.85 },
  { geo: "gearSm", pos: [0.18, 0.85, 0.04] as [number, number, number], speed: 1.3 },
  { geo: "gearSm2", pos: [0.95, -0.55, 0.03] as [number, number, number], speed: -1.7 },
]

// CAD callouts: each label is pinned at a fixed angle around the watch (so they
// never overlap) and a thin leader line tracks its part as it explodes outward.
const LABEL_R = 2.62
const CALLOUTS: { id: PartId; label: string; angle: number; refKey: string }[] = [
  { id: "dateDisc", label: "Date wheel", angle: 6, refKey: "dateDisc" },
  { id: "rotor", label: "Rotor", angle: 46, refKey: "rotor" },
  { id: "crystal", label: "Crystal", angle: 82, refKey: "crystal" },
  { id: "hands", label: "Hands", angle: 116, refKey: "hands" },
  { id: "movement", label: "Movement", angle: 152, refKey: "mainplate" },
  { id: "dial", label: "Dial", angle: 192, refKey: "dial" },
  { id: "gears", label: "Gear train", angle: 232, refKey: "gears" },
  { id: "chapter", label: "Chapter ring", angle: 286, refKey: "chapter" },
  { id: "crown", label: "Crown", angle: 332, refKey: "crown" },
]
const ANCHORS: [number, number, number][] = CALLOUTS.map((c) => [
  Math.cos((c.angle * Math.PI) / 180) * LABEL_R,
  Math.sin((c.angle * Math.PI) / 180) * LABEL_R,
  0,
])

// Matte, lightly-desaturated palette — engineering render, not glossy toy.
const C = {
  case: "#c5c9cf",
  caseDark: "#9b9fa6",
  edge: "#2c2e31",
  crystal: "#dce6f1",
  dial: "#f1ede3",
  chapter: "#cbced3",
  marker: "#2f3338",
  hand: "#202225",
  second: "#33363b",
  plate: "#b8a36c",
  plateEdge: "#6f5f31",
  brass: "#c1a85f",
  brassDark: "#9f8742",
  bridge: "#b1b5bb",
  rotor: "#a9aeb6",
  screw: "#62656b",
}

type MaterialKind = "metal" | "matte" | "glass"

function partMaterialProps(kind: MaterialKind, color: string) {
  if (kind === "glass")
    return { color, metalness: 0.0, roughness: 0.08, transparent: true, opacity: 0.24 }
  if (kind === "matte") return { color, metalness: 0.12, roughness: 0.82 }
  return { color, metalness: 0.45, roughness: 0.55 } // semi-matte brushed metal
}

// A single mesh with optional dark edge outline and hover behaviour: emissive
// glow when its part is hovered, fades back when another part is hovered.
function Surface({
  geometry,
  color,
  kind = "metal",
  highlight,
  dim,
  edges = false,
  ...rest
}: {
  geometry: THREE.BufferGeometry
  color: string
  kind?: MaterialKind
  highlight: boolean
  dim: boolean
  edges?: boolean
} & React.ComponentProps<"mesh">) {
  const base = partMaterialProps(kind, color)
  const transparent = base.transparent || dim
  const opacity = dim ? Math.min(base.opacity ?? 1, 0.18) : base.opacity ?? 1
  return (
    <mesh geometry={geometry} {...rest}>
      <meshStandardMaterial
        color={base.color}
        metalness={base.metalness}
        roughness={base.roughness}
        transparent={transparent}
        opacity={opacity}
        emissive={highlight ? "#c98a3c" : "#000000"}
        emissiveIntensity={highlight ? 0.45 : 0}
      />
      {edges && !dim && <Edges threshold={26} color={C.edge} />}
    </mesh>
  )
}

export default function ProceduralWatchModel({
  explodeRef,
  playingRef,
  hoveredId,
  onHover,
  dateNumber = "27",
}: {
  explodeRef: MutableRefObject<number>
  playingRef: MutableRefObject<boolean>
  hoveredId: PartId | null
  onHover: (id: PartId | null) => void
  dateNumber?: string
}) {
  // Geometry (built once on mount, disposed on unmount).
  const geo = useMemo(
    () => ({
      case: makeRing(2.25, 2.0, 0.82),
      caseChamfer: makeRing(2.27, 2.16, 0.1),
      caseback: bevelDisc(2.03, 0.08),
      bezel: makeRing(2.2, 1.74, 0.13),
      crystal: disc(1.78, 0.1),
      dial: makeDial(1.73, 0.05, { x: 1.22, y: 0, w: 0.34, h: 0.26 }),
      chapter: makeRing(1.78, 1.5, 0.05),
      mainplate: disc(1.7, 0.12),
      dateDisc: disc(1.4, 0.04),
      rotor: makeRotor(1.55, 1.1, 0.08),
      hub: disc(0.22, 0.12),
      spoke: new THREE.BoxGeometry(0.16, 1.2, 0.06),
      gearBig: makeGear(28, 0.62, 0.5, 0.08, 0.12),
      gearMed: makeGear(22, 0.42, 0.33, 0.08, 0.09),
      gearSm: makeGear(18, 0.3, 0.22, 0.08, 0.07),
      gearSm2: makeGear(16, 0.26, 0.19, 0.08, 0.06),
      screw: disc(0.09, 0.2),
      screwSlot: new THREE.BoxGeometry(0.14, 0.025, 0.05),
      tick: new THREE.BoxGeometry(0.026, 0.13, 0.03),
      tickBig: new THREE.BoxGeometry(0.05, 0.22, 0.035),
      hour: handBar(0.12, 0.92),
      minute: handBar(0.08, 1.38),
      second: handBar(0.026, 1.5),
      secondTail: new THREE.BoxGeometry(0.05, 0.4, 0.03),
      bridge1: new THREE.BoxGeometry(1.75, 0.5, 0.1),
      bridge2: new THREE.BoxGeometry(1.3, 0.42, 0.1),
      cap: disc(0.1, 0.22),
      frameH: new THREE.BoxGeometry(0.46, 0.06, 0.06),
      frameV: new THREE.BoxGeometry(0.06, 0.38, 0.06),
      datePlane: new THREE.PlaneGeometry(0.32, 0.24),
      crown: (() => {
        const g = new THREE.CylinderGeometry(0.17, 0.17, 0.22, 28)
        g.rotateZ(Math.PI / 2)
        return g
      })(),
      crownCap: (() => {
        const g = new THREE.CylinderGeometry(0.13, 0.13, 0.06, 24)
        g.rotateZ(Math.PI / 2)
        return g
      })(),
      crownRidge: new THREE.BoxGeometry(0.2, 0.05, 0.03),
      stem: (() => {
        const g = new THREE.CylinderGeometry(0.05, 0.05, 0.55, 16)
        g.rotateZ(Math.PI / 2)
        return g
      })(),
    }),
    [],
  )

  // "27" drawn to a canvas texture (no external font needed).
  const dateTex = useMemo(() => {
    const c = document.createElement("canvas")
    c.width = 160
    c.height = 128
    const x = c.getContext("2d")!
    x.fillStyle = "#efece3"
    x.fillRect(0, 0, 160, 128)
    x.fillStyle = "#1b1c1f"
    x.font = "bold 80px ui-monospace, 'JetBrains Mono', monospace"
    x.textAlign = "center"
    x.textBaseline = "middle"
    x.fillText(dateNumber, 80, 70)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
  }, [dateNumber])

  // One 2-point buffer geometry per callout leader line.
  const lineGeos = useMemo(
    () =>
      CALLOUTS.map(() => {
        const g = new THREE.BufferGeometry()
        g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3))
        return g
      }),
    [],
  )

  useEffect(() => {
    return () => {
      Object.values(geo).forEach((g) => (g as THREE.BufferGeometry).dispose?.())
      lineGeos.forEach((g) => g.dispose())
      dateTex.dispose()
    }
  }, [geo, dateTex, lineGeos])

  // Group refs for the explode rig.
  const refs = {
    bezel: useRef<THREE.Group>(null),
    crystal: useRef<THREE.Group>(null),
    hands: useRef<THREE.Group>(null),
    markers: useRef<THREE.Group>(null),
    chapter: useRef<THREE.Group>(null),
    dial: useRef<THREE.Group>(null),
    dateDisc: useRef<THREE.Group>(null),
    mainplate: useRef<THREE.Group>(null),
    screws: useRef<THREE.Group>(null),
    gears: useRef<THREE.Group>(null),
    bridges: useRef<THREE.Group>(null),
    rotor: useRef<THREE.Group>(null),
    crown: useRef<THREE.Group>(null),
    stem: useRef<THREE.Group>(null),
  }
  const hourRef = useRef<THREE.Group>(null)
  const minuteRef = useRef<THREE.Group>(null)
  const secondRef = useRef<THREE.Group>(null)
  const gearRefs = useRef<(THREE.Mesh | null)[]>([])
  const lineRefs = useRef<(THREE.LineSegments | null)[]>([])
  const shown = useRef(0) // smoothed eased explode

  // Seed the classic 10:08:36 pose once, imperatively, so a hover re-render
  // won't snap the hands back to the start angle mid-animation.
  useEffect(() => {
    if (hourRef.current) hourRef.current.rotation.z = -deg(304.5)
    if (minuteRef.current) minuteRef.current.rotation.z = -deg(54)
    if (secondRef.current) secondRef.current.rotation.z = -deg(36)
  }, [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const target = 1 - Math.pow(1 - clamp01(explodeRef.current), 3)
    shown.current += (target - shown.current) * Math.min(1, dt * 9)
    const e = shown.current

    for (const key of Object.keys(LAYOUT)) {
      const g = refs[key as keyof typeof refs]?.current
      if (!g) continue
      const { base, off } = LAYOUT[key]
      g.position.set(
        base[0] + off[0] * EXPLODE_SCALE * e,
        base[1] + off[1] * EXPLODE_SCALE * e,
        base[2] + off[2] * EXPLODE_SCALE * e,
      )
    }

    if (playingRef.current) {
      if (secondRef.current) secondRef.current.rotation.z -= dt * ((Math.PI * 2) / 6)
      if (minuteRef.current) minuteRef.current.rotation.z -= dt * ((Math.PI * 2) / 6 / 12)
      if (hourRef.current) hourRef.current.rotation.z -= dt * ((Math.PI * 2) / 6 / 144)
      if (refs.rotor.current) refs.rotor.current.rotation.z += dt * 0.5
      gearRefs.current.forEach((m, i) => {
        if (m) m.rotation.z += dt * (GEAR_DEFS[i]?.speed ?? 0.5)
      })
    }

    // Leader lines: from each pinned anchor to its part's live position. They
    // fade in with the explode so the assembled view stays clean.
    const raw = clamp01(explodeRef.current)
    for (let i = 0; i < CALLOUTS.length; i++) {
      const ln = lineRefs.current[i]
      const g = refs[CALLOUTS[i].refKey as keyof typeof refs]?.current
      if (!ln || !g) continue
      const a = ANCHORS[i]
      const arr = lineGeos[i].attributes.position.array as Float32Array
      arr[0] = a[0] * 0.9
      arr[1] = a[1] * 0.9
      arr[2] = 0
      arr[3] = g.position.x
      arr[4] = g.position.y
      arr[5] = g.position.z
      lineGeos[i].attributes.position.needsUpdate = true
      const mat = ln.material as THREE.LineBasicMaterial
      mat.opacity = CALLOUTS[i].id === hoveredId ? 0.95 : Math.min(0.55, raw * 0.9)
    }
  })

  const hl = (id: PartId) => hoveredId === id
  const dm = (id: PartId) => hoveredId !== null && hoveredId !== id
  const over = (id: PartId) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    onHover(id)
  }
  const out = () => onHover(null)

  return (
    <group>
      {/* ── Static frame: case band, chamfer, caseback ── */}
      <Surface geometry={geo.case} color={C.case} highlight={false} dim={hoveredId !== null} edges position={[0, 0, -0.05]} />
      <Surface geometry={geo.caseChamfer} color={C.caseDark} highlight={false} dim={hoveredId !== null} edges position={[0, 0, 0.32]} />
      <Surface geometry={geo.caseback} color={C.caseDark} highlight={false} dim={hoveredId !== null} edges position={[0, 0, -0.44]} />

      {/* ── Bezel ── */}
      <group ref={refs.bezel} onPointerOver={over("crown")} onPointerOut={out}>
        <Surface geometry={geo.bezel} color={C.case} highlight={false} dim={hoveredId !== null} edges />
      </group>

      {/* ── Crystal ── */}
      <group ref={refs.crystal} onPointerOver={over("crystal")} onPointerOut={out}>
        <Surface geometry={geo.crystal} color={C.crystal} kind="glass" highlight={hl("crystal")} dim={dm("crystal")} edges />
      </group>

      {/* ── Hands ── */}
      <group ref={refs.hands} onPointerOver={over("hands")} onPointerOut={out}>
        <group ref={hourRef}>
          <Surface geometry={geo.hour} color={C.hand} kind="matte" highlight={hl("hands")} dim={dm("hands")} />
        </group>
        <group ref={minuteRef}>
          <Surface geometry={geo.minute} color={C.hand} kind="matte" highlight={hl("hands")} dim={dm("hands")} position={[0, 0, 0.05]} />
        </group>
        <group ref={secondRef}>
          <Surface geometry={geo.second} color={C.second} kind="matte" highlight={hl("hands")} dim={dm("hands")} position={[0, 0, 0.1]} />
          <Surface geometry={geo.secondTail} color={C.second} kind="matte" highlight={hl("hands")} dim={dm("hands")} position={[0, -0.2, 0.1]} />
        </group>
        <Surface geometry={geo.cap} color={C.caseDark} highlight={hl("hands")} dim={dm("hands")} position={[0, 0, 0.14]} />
      </group>

      {/* ── Minute markers ── */}
      <group ref={refs.markers} onPointerOver={over("chapter")} onPointerOut={out}>
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2
          const big = i % 5 === 0
          const r = 1.62
          return (
            <mesh key={i} geometry={big ? geo.tickBig : geo.tick} position={[Math.sin(a) * r, Math.cos(a) * r, 0]} rotation={[0, 0, -a]}>
              <meshStandardMaterial color={C.marker} metalness={0.1} roughness={0.7} transparent={dm("chapter")} opacity={dm("chapter") ? 0.18 : 1} />
            </mesh>
          )
        })}
      </group>

      {/* ── Chapter ring ── */}
      <group ref={refs.chapter} onPointerOver={over("chapter")} onPointerOut={out}>
        <Surface geometry={geo.chapter} color={C.chapter} kind="matte" highlight={hl("chapter")} dim={dm("chapter")} edges />
      </group>

      {/* ── Dial (with date aperture + window frame) ── */}
      <group ref={refs.dial} onPointerOver={over("dial")} onPointerOut={out}>
        <Surface geometry={geo.dial} color={C.dial} kind="matte" highlight={hl("dial")} dim={dm("dial")} edges />
        <Surface geometry={geo.frameH} color={C.hand} kind="matte" highlight={hl("dial")} dim={dm("dial")} position={[1.22, 0.16, 0.03]} />
        <Surface geometry={geo.frameH} color={C.hand} kind="matte" highlight={hl("dial")} dim={dm("dial")} position={[1.22, -0.16, 0.03]} />
        <Surface geometry={geo.frameV} color={C.hand} kind="matte" highlight={hl("dial")} dim={dm("dial")} position={[1.05, 0, 0.03]} />
        <Surface geometry={geo.frameV} color={C.hand} kind="matte" highlight={hl("dial")} dim={dm("dial")} position={[1.39, 0, 0.03]} />
      </group>

      {/* ── Date wheel ── */}
      <group ref={refs.dateDisc} onPointerOver={over("dateDisc")} onPointerOut={out}>
        <Surface geometry={geo.dateDisc} color="#ece8df" kind="matte" highlight={hl("dateDisc")} dim={dm("dateDisc")} />
        <mesh geometry={geo.datePlane} position={[1.22, 0, 0.025]}>
          <meshBasicMaterial map={dateTex} toneMapped={false} transparent={dm("dateDisc")} opacity={dm("dateDisc") ? 0.3 : 1} />
        </mesh>
      </group>

      {/* ── Movement: mainplate ── */}
      <group ref={refs.mainplate} onPointerOver={over("movement")} onPointerOut={out}>
        <Surface geometry={geo.mainplate} color={C.plate} highlight={hl("movement")} dim={dm("movement")} edges />
      </group>

      {/* ── Bridges ── */}
      <group ref={refs.bridges} onPointerOver={over("movement")} onPointerOut={out}>
        <Surface geometry={geo.bridge1} color={C.bridge} highlight={hl("movement")} dim={dm("movement")} edges rotation={[0, 0, deg(22)]} position={[0, 0.15, 0]} />
        <Surface geometry={geo.bridge2} color={C.bridge} highlight={hl("movement")} dim={dm("movement")} edges rotation={[0, 0, -deg(52)]} position={[-0.1, -0.5, 0]} />
      </group>

      {/* ── Gear train ── */}
      <group ref={refs.gears} onPointerOver={over("gears")} onPointerOut={out}>
        {GEAR_DEFS.map((g, i) => (
          <mesh
            key={i}
            ref={(m) => {
              gearRefs.current[i] = m
            }}
            geometry={geo[g.geo as "gearBig"]}
            position={g.pos}
          >
            <meshStandardMaterial
              color={i % 2 === 0 ? C.brass : C.brassDark}
              metalness={0.5}
              roughness={0.45}
              transparent={dm("gears")}
              opacity={dm("gears") ? 0.18 : 1}
              emissive={hl("gears") ? "#c98a3c" : "#000000"}
              emissiveIntensity={hl("gears") ? 0.45 : 0}
            />
            {!dm("gears") && <Edges threshold={24} color={C.plateEdge} />}
          </mesh>
        ))}
      </group>

      {/* ── Screws ── */}
      <group ref={refs.screws}>
        {SCREW_POS.map(([x, y], i) => (
          <group key={i} position={[x, y, 0]} rotation={[0, 0, deg(i * 35)]}>
            <Surface geometry={geo.screw} color={C.screw} highlight={false} dim={hoveredId !== null && hoveredId !== "movement"} />
            <Surface geometry={geo.screwSlot} color="#3c3e42" kind="matte" highlight={false} dim={hoveredId !== null && hoveredId !== "movement"} position={[0, 0, 0.11]} />
          </group>
        ))}
      </group>

      {/* ── Rotor ── */}
      <group ref={refs.rotor} onPointerOver={over("rotor")} onPointerOut={out}>
        <Surface geometry={geo.rotor} color={C.rotor} highlight={hl("rotor")} dim={dm("rotor")} edges />
        <Surface geometry={geo.hub} color={C.caseDark} highlight={hl("rotor")} dim={dm("rotor")} />
        <Surface geometry={geo.spoke} color={C.rotor} highlight={hl("rotor")} dim={dm("rotor")} position={[0, -0.6, 0]} />
      </group>

      {/* ── Crown (knurled) + stem ── */}
      <group ref={refs.crown} onPointerOver={over("crown")} onPointerOut={out}>
        <Surface geometry={geo.crown} color={C.case} highlight={hl("crown")} dim={dm("crown")} edges />
        <Surface geometry={geo.crownCap} color={C.caseDark} highlight={hl("crown")} dim={dm("crown")} position={[0.13, 0, 0]} />
        {Array.from({ length: 16 }).map((_, i) => {
          const t = (i / 16) * Math.PI * 2
          return (
            <mesh key={i} geometry={geo.crownRidge} position={[0, Math.cos(t) * 0.175, Math.sin(t) * 0.175]} rotation={[t, 0, 0]}>
              <meshStandardMaterial color={C.caseDark} metalness={0.45} roughness={0.55} transparent={dm("crown")} opacity={dm("crown") ? 0.18 : 1} />
            </mesh>
          )
        })}
      </group>
      <group ref={refs.stem}>
        <Surface geometry={geo.stem} color={C.caseDark} highlight={hl("crown")} dim={dm("crown")} />
      </group>

      {/* ── CAD callouts: leader lines + pinned labels ── */}
      {CALLOUTS.map((c, i) => (
        <lineSegments
          key={`line-${c.id}`}
          ref={(el) => {
            lineRefs.current[i] = el
          }}
          geometry={lineGeos[i]}
        >
          <lineBasicMaterial color="#6b7079" transparent opacity={0} depthTest={false} />
        </lineSegments>
      ))}
      {CALLOUTS.map((c, i) => (
        <PartLabel
          key={`label-${c.id}`}
          id={c.id}
          label={c.label}
          position={ANCHORS[i]}
          explodeRef={explodeRef}
          hoveredId={hoveredId}
          onHover={onHover}
        />
      ))}
    </group>
  )
}
