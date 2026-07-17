"use client"

import { useCallback, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import WatchScene from "./WatchScene"
import ExplodeSlider from "./ExplodeSlider"
import type { PartId } from "./PartLabel"

// Top-level, self-contained interactive 3D watch for the Project Six page.
// Rendered as a light "engineering figure" card so it reads as a clean CAD
// illustration inside the dark page. Explode amount and play/pause are held in
// refs (read inside the r3f frame loop) so dragging the slider never re-renders
// the React tree; only the rare hover highlight uses state.
export default function ProjectSixWatchViewer() {
  const explodeRef = useRef(0)
  const playingRef = useRef(true)
  const [playing, setPlaying] = useState(true)
  const [hoveredId, setHoveredId] = useState<PartId | null>(null)

  const onExplodeChange = useCallback((v: number) => {
    explodeRef.current = v
  }, [])

  const onTogglePlay = useCallback(() => {
    playingRef.current = !playingRef.current
    setPlaying(playingRef.current)
  }, [])

  const onHover = useCallback((id: PartId | null) => setHoveredId(id), [])

  return (
    <div
      style={{
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.1)",
        background: "linear-gradient(180deg,#f4f6f8,#e7eaed)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(360px, 56vh, 560px)",
          touchAction: "none",
          cursor: "grab",
          background: "radial-gradient(circle at 50% 40%, #fbfbfc 0%, #eceef1 55%, #dfe2e6 100%)",
        }}
      >
        <Canvas
          orthographic
          camera={{ position: [6, 3.6, 5.6], zoom: 58, near: -50, far: 100 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <WatchScene
            explodeRef={explodeRef}
            playingRef={playingRef}
            hoveredId={hoveredId}
            onHover={onHover}
          />
        </Canvas>

        <div
          style={{
            position: "absolute",
            left: 16,
            top: 14,
            fontFamily: "var(--wb-mono), ui-monospace, monospace",
            fontSize: 10.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#5c616b",
            pointerEvents: "none",
          }}
        >
          Seiko NH35 · procedural 3D · exploded view
        </div>
      </div>

      <div style={{ padding: "16px 18px 18px", borderTop: "1px solid rgba(0,0,0,0.08)", background: "#f6f7f9" }}>
        <ExplodeSlider onExplodeChange={onExplodeChange} playing={playing} onTogglePlay={onTogglePlay} />
        <p
          style={{
            margin: "12px 2px 0",
            fontFamily: "var(--wb-mono), ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: "0.04em",
            color: "#6b7079",
            lineHeight: 1.5,
          }}
        >
          Drag to rotate · Scroll to zoom · Use slider to inspect parts · Hover a label to highlight a part
        </p>
      </div>
    </div>
  )
}
