"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

type RubiksFaceId = "u" | "l" | "f" | "r" | "b" | "d"
type RubiksTurnDirection = "clockwise" | "prime" | "half"
type RubiksAxis = "x" | "y" | "z"
type RubiksDirection = "cw" | "ccw"
type RubiksPreviewMode = "animate" | "start" | "result"

type RubiksCubieState = {
  id: string
  position: THREE.Vector3
  quaternion: THREE.Quaternion
}

const rubiksStickerColors: Record<RubiksFaceId, string> = {
  u: "#f8fafc",
  l: "#f97316",
  f: "#22c55e",
  r: "#ef4444",
  b: "#3b82f6",
  d: "#facc15",
}

const rubiksFaceNormals: Record<RubiksFaceId, { axis: RubiksAxis; layer: number; rotation: [number, number, number] }> = {
  u: { axis: "y", layer: 1, rotation: [-Math.PI / 2, 0, 0] },
  l: { axis: "x", layer: -1, rotation: [0, -Math.PI / 2, 0] },
  f: { axis: "z", layer: 1, rotation: [0, 0, 0] },
  r: { axis: "x", layer: 1, rotation: [0, Math.PI / 2, 0] },
  b: { axis: "z", layer: -1, rotation: [0, Math.PI, 0] },
  d: { axis: "y", layer: -1, rotation: [Math.PI / 2, 0, 0] },
}

const rubiksClockwiseSigns: Record<RubiksFaceId, number> = {
  u: -1,
  l: 1,
  f: -1,
  r: -1,
  b: 1,
  d: 1,
}

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

const getRubiksSliceTurn = (face: RubiksFaceId, turn: RubiksTurnDirection) => {
  const faceNormal = rubiksFaceNormals[face]
  const turnSign = turn === "prime" ? -1 : 1
  const turnMagnitude = turn === "half" ? Math.PI : Math.PI / 2

  return {
    axis: faceNormal.axis,
    layer: faceNormal.layer,
    angle: rubiksClockwiseSigns[face] * turnSign * turnMagnitude,
  }
}

const getRubiksAxisVector = (axis: RubiksAxis) => {
  if (axis === "x") return new THREE.Vector3(1, 0, 0)
  if (axis === "y") return new THREE.Vector3(0, 1, 0)
  return new THREE.Vector3(0, 0, 1)
}

const roundRubiksPosition = (position: THREE.Vector3) =>
  new THREE.Vector3(Math.round(position.x), Math.round(position.y), Math.round(position.z))

const createInitialRubiksCubeState = () => {
  const cubies: RubiksCubieState[] = []

  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        cubies.push({
          id: `${x}:${y}:${z}`,
          position: new THREE.Vector3(x, y, z),
          quaternion: new THREE.Quaternion(),
        })
      }
    }
  }

  return cubies
}

const applyRubiksMoveToState = (state: RubiksCubieState[], move: string) => {
  const visual = getRubiksMoveVisual(move)
  const turnConfig = getRubiksSliceTurn(visual.face, visual.turn)
  const axisVector = getRubiksAxisVector(turnConfig.axis)
  const rotation = new THREE.Quaternion().setFromAxisAngle(axisVector, turnConfig.angle)

  return state.map((cubie) => {
    if (Math.round(cubie.position[turnConfig.axis]) !== turnConfig.layer) {
      return {
        ...cubie,
        position: cubie.position.clone(),
        quaternion: cubie.quaternion.clone(),
      }
    }

    return {
      ...cubie,
      position: roundRubiksPosition(cubie.position.clone().applyQuaternion(rotation)),
      quaternion: rotation.clone().multiply(cubie.quaternion),
    }
  })
}

const getRubiksCubeStateBeforeStep = (moveSequence: readonly { move: string }[], stepIndex: number) =>
  moveSequence
    .slice(0, stepIndex)
    .reduce((state, item) => applyRubiksMoveToState(state, item.move), createInitialRubiksCubeState())

const disposeRubiksObject = (object: THREE.Object3D) => {
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh) && !(child instanceof THREE.Line)) return

    if (child.geometry) {
      geometries.add(child.geometry)
    }

    const material = child.material
    if (Array.isArray(material)) {
      material.forEach((item) => materials.add(item))
    } else {
      materials.add(material)
    }
  })

  geometries.forEach((geometry) => geometry.dispose())
  materials.forEach((material) => material.dispose())
}

export default function RubiksPhysicalCube({
  activeFace,
  turn,
  stepIndex,
  moveSequence,
  direction,
  previewMode,
  replayKey,
  moveLabel,
  moveTitle,
  highlightTopFace = false,
}: {
  activeFace: RubiksFaceId
  turn: RubiksTurnDirection
  stepIndex: number
  moveSequence: readonly { move: string }[]
  direction: RubiksDirection
  previewMode: RubiksPreviewMode
  replayKey: number
  moveLabel: string
  moveTitle: string
  highlightTopFace?: boolean
}) {
  const mountRef = useRef<HTMLDivElement>(null)
  const viewRotationRef = useRef({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(6.55, 5.15, 8.6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.domElement.dataset.rubiksCanvas = "true"
    renderer.domElement.className = "rubiks-three-canvas"
    mount.appendChild(renderer.domElement)

    const root = new THREE.Group()
    root.rotation.set(viewRotationRef.current.x, viewRotationRef.current.y, viewRotationRef.current.z)
    root.position.y = 0.12
    scene.add(root)

    const fixedGroup = new THREE.Group()
    const movingGroup = new THREE.Group()
    root.add(fixedGroup, movingGroup)

    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x14213d, 2.35)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4)
    keyLight.position.set(4, 5, 6)
    keyLight.castShadow = true
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x2f6df6, 1.6)
    rimLight.position.set(-4, 1.8, -3)
    scene.add(rimLight)

    const turnConfig = getRubiksSliceTurn(activeFace, turn)
    const isSettledFinalResult = previewMode === "result" && highlightTopFace
    const cubieStates = getRubiksCubeStateBeforeStep(moveSequence, stepIndex + (isSettledFinalResult ? 1 : 0))
    const cubieGeometry = new THREE.BoxGeometry(1.02, 1.02, 1.02, 3, 3, 3)
    const cubieEdgeGeometry = new THREE.EdgesGeometry(cubieGeometry)
    const stickerGeometry = new THREE.PlaneGeometry(0.8, 0.8)
    const topHighlightGeometry = new THREE.BoxGeometry(3.5, 0.05, 3.5)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x07080c,
      roughness: 0.54,
      metalness: 0.18,
    })
    const sliceBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x08111f,
      emissive: 0x0f2f76,
      emissiveIntensity: 0.48,
      roughness: 0.52,
      metalness: 0.2,
    })
    const sliceLineMaterial = new THREE.LineBasicMaterial({
      color: 0x2f6df6,
      transparent: true,
      opacity: 0.82,
    })
    const topHighlightMaterial = new THREE.MeshStandardMaterial({
      color: 0x2f6df6,
      emissive: 0x123b8f,
      emissiveIntensity: 0.85,
      roughness: 0.35,
      metalness: 0.08,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const topHighlightLineMaterial = new THREE.LineBasicMaterial({
      color: 0x7fb1ff,
      transparent: true,
      opacity: 0,
    })
    const targetPlateMaterial = new THREE.MeshStandardMaterial({
      color: 0x2f6df6,
      emissive: 0x123b8f,
      emissiveIntensity: 0.75,
      roughness: 0.38,
      metalness: 0.08,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const targetArrowMaterial = new THREE.LineBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0,
    })
    const targetArrowTubeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc857,
      emissive: 0xb45309,
      emissiveIntensity: 1.15,
      roughness: 0.3,
      metalness: 0.05,
      transparent: true,
      opacity: 0,
    })
    const targetPlateOutlineMaterial = new THREE.LineBasicMaterial({
      color: 0x8cc4ff,
      transparent: true,
      opacity: 0,
    })
    const targetArrowHeadMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xb45309,
      emissiveIntensity: 1.15,
      roughness: 0.35,
      metalness: 0.1,
      transparent: true,
      opacity: 0,
    })
    const motorBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x162033,
      roughness: 0.55,
      metalness: 0.38,
      transparent: true,
      opacity: 0.7,
    })
    const motorFaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x25364f,
      emissive: 0x123b8f,
      emissiveIntensity: 0.32,
      roughness: 0.5,
      metalness: 0.28,
      transparent: true,
      opacity: 0.78,
    })
    const motorCouplerMaterial = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x0f2f76,
      emissiveIntensity: 0.48,
      roughness: 0.34,
      metalness: 0.18,
      transparent: true,
      opacity: 0.68,
    })
    const stickerMaterials = Object.fromEntries(
      Object.entries(rubiksStickerColors).map(([face, color]) => [
        face,
        new THREE.MeshStandardMaterial({
          color,
          emissive: 0x000000,
          roughness: 0.48,
          metalness: 0.02,
          side: THREE.DoubleSide,
        }),
      ]),
    ) as Record<RubiksFaceId, THREE.MeshStandardMaterial>

    const makeSticker = (face: RubiksFaceId) => {
      const faceNormal = rubiksFaceNormals[face]
      const sticker = new THREE.Mesh(stickerGeometry.clone(), stickerMaterials[face])

      sticker.position[faceNormal.axis] = faceNormal.layer * 0.518
      sticker.rotation.set(...faceNormal.rotation)

      return sticker
    }

    cubieStates.forEach((cubieState) => {
      const { position } = cubieState
      const cubie = new THREE.Group()
      cubie.position.set(position.x * 1.12, position.y * 1.12, position.z * 1.12)
      cubie.quaternion.copy(cubieState.quaternion)

      const isMovingSlice = !isSettledFinalResult && Math.round(position[turnConfig.axis]) === turnConfig.layer
      const body = new THREE.Mesh(cubieGeometry.clone(), isMovingSlice ? sliceBodyMaterial : bodyMaterial)
      body.castShadow = true
      body.receiveShadow = true
      cubie.add(body)

      if (isMovingSlice) {
        const sliceOutline = new THREE.LineSegments(cubieEdgeGeometry.clone(), sliceLineMaterial)
        sliceOutline.scale.setScalar(1.035)
        cubie.add(sliceOutline)
      }

      const [startX, startY, startZ] = cubieState.id.split(":").map(Number)

      if (startY === 1) cubie.add(makeSticker("u"))
      if (startY === -1) cubie.add(makeSticker("d"))
      if (startX === 1) cubie.add(makeSticker("r"))
      if (startX === -1) cubie.add(makeSticker("l"))
      if (startZ === 1) cubie.add(makeSticker("f"))
      if (startZ === -1) cubie.add(makeSticker("b"))

      const parent = isMovingSlice ? movingGroup : fixedGroup
      parent.add(cubie)
    })

    const motorRig = new THREE.Group()
    const motorBodyGeometry = new THREE.BoxGeometry(0.62, 0.62, 0.62)
    const motorFaceGeometry = new THREE.BoxGeometry(0.66, 0.66, 0.06)
    const couplerGeometry = new THREE.CylinderGeometry(0.065, 0.065, 1.36, 16)
    const motorConfigs = [
      {
        bodyPosition: new THREE.Vector3(3.38, 0, 0),
        facePosition: new THREE.Vector3(3.0, 0, 0),
        faceRotation: new THREE.Euler(0, Math.PI / 2, 0),
        couplerPosition: new THREE.Vector3(2.32, 0, 0),
        couplerRotation: new THREE.Euler(0, 0, Math.PI / 2),
      },
      {
        bodyPosition: new THREE.Vector3(-3.38, 0, 0),
        facePosition: new THREE.Vector3(-3.0, 0, 0),
        faceRotation: new THREE.Euler(0, Math.PI / 2, 0),
        couplerPosition: new THREE.Vector3(-2.32, 0, 0),
        couplerRotation: new THREE.Euler(0, 0, Math.PI / 2),
      },
      {
        bodyPosition: new THREE.Vector3(0, 0, 3.38),
        facePosition: new THREE.Vector3(0, 0, 3.0),
        faceRotation: new THREE.Euler(0, 0, 0),
        couplerPosition: new THREE.Vector3(0, 0, 2.32),
        couplerRotation: new THREE.Euler(Math.PI / 2, 0, 0),
      },
      {
        bodyPosition: new THREE.Vector3(0, 0, -3.38),
        facePosition: new THREE.Vector3(0, 0, -3.0),
        faceRotation: new THREE.Euler(0, 0, 0),
        couplerPosition: new THREE.Vector3(0, 0, -2.32),
        couplerRotation: new THREE.Euler(Math.PI / 2, 0, 0),
      },
      {
        bodyPosition: new THREE.Vector3(0, -3.3, 0),
        facePosition: new THREE.Vector3(0, -2.92, 0),
        faceRotation: new THREE.Euler(Math.PI / 2, 0, 0),
        couplerPosition: new THREE.Vector3(0, -2.24, 0),
        couplerRotation: new THREE.Euler(0, 0, 0),
      },
    ]

    motorConfigs.forEach((config) => {
      const motor = new THREE.Group()
      const body = new THREE.Mesh(motorBodyGeometry, motorBodyMaterial)
      const facePlate = new THREE.Mesh(motorFaceGeometry, motorFaceMaterial)
      const coupler = new THREE.Mesh(couplerGeometry, motorCouplerMaterial)

      body.position.copy(config.bodyPosition)
      facePlate.position.copy(config.facePosition)
      facePlate.rotation.copy(config.faceRotation)
      coupler.position.copy(config.couplerPosition)
      coupler.rotation.copy(config.couplerRotation)
      body.castShadow = true
      facePlate.castShadow = true
      motor.add(body, facePlate, coupler)
      motorRig.add(motor)
    })
    root.add(motorRig)

    const topHighlight = new THREE.Group()
    const topPlate = new THREE.Mesh(topHighlightGeometry, topHighlightMaterial)
    const topOutline = new THREE.LineSegments(new THREE.EdgesGeometry(topHighlightGeometry), topHighlightLineMaterial)
    topHighlight.position.y = 1.7
    topHighlight.visible = false
    topHighlight.add(topPlate, topOutline)
    root.add(topHighlight)

    const targetCue = new THREE.Group()
    const targetPlate = new THREE.Mesh(topHighlightGeometry.clone(), targetPlateMaterial)
    const targetCueDirection = direction === "cw" ? "ccw" : "cw"
    const targetDirectionSign = targetCueDirection === "cw" ? -1 : 1
    const targetRadius = 2.24
    const targetArrowHeight = 2.84
    const targetStartAngle = targetCueDirection === "cw" ? Math.PI * -0.2 : Math.PI * 1.2
    const targetArcLength = Math.PI * 1.45 * targetDirectionSign
    const targetArcPoints = Array.from({ length: 44 }, (_, index) => {
      const progress = index / 43
      const angle = targetStartAngle + targetArcLength * progress

      return new THREE.Vector3(Math.cos(angle) * targetRadius, targetArrowHeight, Math.sin(angle) * targetRadius)
    })
    const targetArrowCurve = new THREE.CatmullRomCurve3(targetArcPoints)
    const targetArrow = new THREE.Mesh(new THREE.TubeGeometry(targetArrowCurve, 56, 0.018, 10, false), targetArrowTubeMaterial)
    const targetPlateOutline = new THREE.LineSegments(new THREE.EdgesGeometry(topHighlightGeometry), targetPlateOutlineMaterial)
    const targetArrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.42, 28), targetArrowHeadMaterial)
    const targetArrowEnd = targetArcPoints[targetArcPoints.length - 1]
    const targetArrowBeforeEnd = targetArcPoints[targetArcPoints.length - 4]
    const targetArrowDirection = targetArrowEnd.clone().sub(targetArrowBeforeEnd).normalize()

    targetPlate.position.y = 1.74
    targetPlateOutline.position.y = 1.77
    targetArrowHead.position.copy(targetArrowEnd)
    targetArrowHead.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetArrowDirection)
    targetCue.visible = false
    targetCue.add(targetPlate, targetPlateOutline, targetArrow, targetArrowHead)
    root.add(targetCue)

    const getStaticAngle = () => {
      if (isSettledFinalResult) return 0
      if (previewMode === "result") return turnConfig.angle
      return 0
    }

    const resize = () => {
      const width = Math.max(mount.clientWidth, 320)
      const height = Math.max(mount.clientHeight, 320)

      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    resize()

    const dragState = {
      active: false,
      x: 0,
      y: 0,
    }

    const handlePointerDown = (event: PointerEvent) => {
      dragState.active = true
      dragState.x = event.clientX
      dragState.y = event.clientY
      renderer.domElement.setPointerCapture(event.pointerId)
      renderer.domElement.classList.add("is-grabbing")
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragState.active) return

      const deltaX = event.clientX - dragState.x
      const deltaY = event.clientY - dragState.y
      dragState.x = event.clientX
      dragState.y = event.clientY

      root.rotation.y += deltaX * 0.008
      root.rotation.x = THREE.MathUtils.clamp(root.rotation.x + deltaY * 0.008, -1.25, 1.05)
      viewRotationRef.current = {
        x: root.rotation.x,
        y: root.rotation.y,
        z: root.rotation.z,
      }
    }

    const handlePointerUp = (event: PointerEvent) => {
      dragState.active = false
      renderer.domElement.releasePointerCapture(event.pointerId)
      renderer.domElement.classList.remove("is-grabbing")
    }

    renderer.domElement.addEventListener("pointerdown", handlePointerDown)
    renderer.domElement.addEventListener("pointermove", handlePointerMove)
    renderer.domElement.addEventListener("pointerup", handlePointerUp)
    renderer.domElement.addEventListener("pointercancel", handlePointerUp)

    const startedAt = performance.now()
    const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3)
    let animationFrame = 0

    const setTopHighlightOpacity = (opacity: number) => {
      const visibleOpacity = THREE.MathUtils.clamp(opacity, 0, 1)
      topHighlight.visible = visibleOpacity > 0.01
      topHighlightMaterial.opacity = visibleOpacity * 0.24
      topHighlightLineMaterial.opacity = visibleOpacity * 0.95
      topHighlight.scale.setScalar(1 + visibleOpacity * 0.025)
    }

    const setTargetCueOpacity = (opacity: number) => {
      const visibleOpacity = THREE.MathUtils.clamp(opacity, 0, 1)
      targetCue.visible = visibleOpacity > 0.01
      targetPlateMaterial.opacity = visibleOpacity * 0.36
      targetArrowMaterial.opacity = visibleOpacity * 0.95
      targetArrowTubeMaterial.opacity = visibleOpacity * 0.98
      targetPlateOutlineMaterial.opacity = visibleOpacity * 0.95
      targetArrowHeadMaterial.opacity = visibleOpacity
      targetCue.scale.setScalar(1)
    }

    const render = (time: number) => {
      let angle = getStaticAngle()
      let moveProgress = previewMode === "result" ? 1 : 0

      if (previewMode === "animate") {
        const progress = THREE.MathUtils.clamp((time - startedAt - 125) / 900, 0, 1)
        moveProgress = progress
        angle = turnConfig.angle * easeOutCubic(moveProgress)
      }

      movingGroup.rotation[turnConfig.axis] = angle
      setTopHighlightOpacity(highlightTopFace ? THREE.MathUtils.smoothstep(moveProgress, 0.78, 1) : 0)
      setTargetCueOpacity(previewMode === "start" ? 1 : 0)
      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(render)
    }

    animationFrame = window.requestAnimationFrame(render)

    return () => {
      viewRotationRef.current = {
        x: root.rotation.x,
        y: root.rotation.y,
        z: root.rotation.z,
      }
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown)
      renderer.domElement.removeEventListener("pointermove", handlePointerMove)
      renderer.domElement.removeEventListener("pointerup", handlePointerUp)
      renderer.domElement.removeEventListener("pointercancel", handlePointerUp)
      disposeRubiksObject(root)
      cubieGeometry.dispose()
      cubieEdgeGeometry.dispose()
      stickerGeometry.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [activeFace, turn, stepIndex, moveSequence, direction, previewMode, replayKey, highlightTopFace])

  return (
    <div
      ref={mountRef}
      className="rubiks-three-cube"
      aria-label={`Cumulative interactive 3D cube preview for step ${stepIndex + 1}, ${moveLabel}: ${moveTitle}`}
      role="img"
    />
  )
}
