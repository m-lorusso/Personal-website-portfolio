"use client"

import { useRef } from "react"
import type { MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"

export type PartId =
  | "crystal"
  | "hands"
  | "dial"
  | "chapter"
  | "dateDisc"
  | "crown"
  | "gears"
  | "rotor"
  | "movement"

// A drei <Html> chip glued to a part group, so it travels with the part as the
// view explodes. Opacity is driven imperatively from the explode ref each frame
// (labels stay subtle when assembled, fade in as parts separate) which keeps
// slider dragging off the React render path entirely.
export default function PartLabel({
  position,
  label,
  id,
  explodeRef,
  hoveredId,
  onHover,
}: {
  position: [number, number, number]
  label: string
  id: PartId
  explodeRef: MutableRefObject<number>
  hoveredId: PartId | null
  onHover: (id: PartId | null) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useFrame(() => {
    const el = ref.current
    if (!el) return
    const e = explodeRef.current
    const active = hoveredId === id
    // Subtle when assembled, clearly readable once the user starts exploding (>0.25).
    el.style.opacity = (active ? 1 : Math.min(1, 0.12 + e * 1.7)).toFixed(2)
    el.style.transform = `scale(${active ? 1.08 : 1})`
    el.style.borderColor = active ? "#c4894e" : "rgba(0,0,0,0.16)"
    el.style.color = active ? "#7a4a1d" : "#2b2d31"
  })

  return (
    <Html position={position} center zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
      <div
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(id)
        }}
        onPointerOut={() => onHover(null)}
        style={{
          pointerEvents: "auto",
          cursor: "default",
          whiteSpace: "nowrap",
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#2b2d31",
          background: "rgba(255,255,255,0.86)",
          border: "1px solid rgba(0,0,0,0.16)",
          borderRadius: 999,
          padding: "3px 9px",
          boxShadow: "0 2px 7px rgba(0,0,0,0.1)",
          transition: "transform 0.15s ease, border-color 0.15s ease, color 0.15s ease",
          backdropFilter: "blur(2px)",
          userSelect: "none",
        }}
      >
        {label}
      </div>
    </Html>
  )
}
