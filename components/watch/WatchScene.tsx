"use client"

import type { MutableRefObject } from "react"
import { Environment, Lightformer, OrbitControls } from "@react-three/drei"
import ProceduralWatchModel from "./ProceduralWatchModel"
import type { PartId } from "./PartLabel"

// Everything that lives inside the <Canvas>: a clean CAD-style light studio,
// an orthographic isometric framing, orbit/zoom controls, and the procedural
// watch. The environment is built from lightformers (no external HDR) so metals
// catch highlights while the demo stays fully self-contained.
export default function WatchScene({
  explodeRef,
  playingRef,
  hoveredId,
  onHover,
}: {
  explodeRef: MutableRefObject<number>
  playingRef: MutableRefObject<boolean>
  hoveredId: PartId | null
  onHover: (id: PartId | null) => void
}) {
  return (
    <>
      {/* Background comes from the container's CSS gradient (canvas is alpha). */}
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#ffffff", "#cfd2d6", 0.7]} />
      <directionalLight position={[5, 7, 8]} intensity={0.85} />
      <directionalLight position={[-6, 3, 4]} intensity={0.35} color="#e6ecff" />

      {/* Low-key environment for soft, matte sheen — not glossy reflections. */}
      <Environment resolution={96} frames={1}>
        <Lightformer intensity={0.8} position={[0, 3, 5]} scale={[10, 10, 1]} />
        <Lightformer intensity={0.4} position={[-5, 1, 2]} scale={[4, 9, 1]} />
        <Lightformer intensity={0.3} position={[5, -1, 3]} scale={[4, 7, 1]} />
      </Environment>

      <ProceduralWatchModel
        explodeRef={explodeRef}
        playingRef={playingRef}
        hoveredId={hoveredId}
        onHover={onHover}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minZoom={42}
        maxZoom={230}
        minPolarAngle={Math.PI * 0.12}
        maxPolarAngle={Math.PI * 0.88}
      />
    </>
  )
}
