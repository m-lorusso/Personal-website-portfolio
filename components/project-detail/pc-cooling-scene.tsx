"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

type PCCoolingMode = "stock" | "ducted"

type FlowCurve = {
  curve: THREE.CatmullRomCurve3
  color: number
  count: number
  speed: number
  size: number
}

export default function PCCoolingScene({ mode }: { mode: PCCoolingMode }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ===== Scene & camera =====
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x05080f, 14, 26)

    // Pure side view of the case, zoomed out slightly so the intake/exhaust
    // particles are visible OUTSIDE the case (green entering on the right,
    // red leaving on the left/top).
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 0.4, 13.6)
    camera.lookAt(0, 0.1, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.display = "block"
    mount.appendChild(renderer.domElement)

    // ===== Lights =====
    scene.add(new THREE.HemisphereLight(0x7a96c4, 0x0b101a, 1.6))
    const key = new THREE.DirectionalLight(0xffffff, 1.1)
    key.position.set(4, 6, 7)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x60a5fa, 0.8)
    rim.position.set(-4, 2, 4)
    scene.add(rim)
    const fill = new THREE.PointLight(0x67e8f9, 0.7, 18)
    fill.position.set(0, 0.5, 4)
    scene.add(fill)

    // ===== Case dimensions =====
    // +X = front (intake), -X = rear (exhaust)
    // +Y = top (AIO),     -Y = bottom (PSU)
    // +Z = side opening (camera side), -Z = motherboard tray
    const W = 5.4
    const H = 6.2
    const D = 2.6

    // Case wireframe
    const caseGeo = new THREE.BoxGeometry(W, H, D)
    scene.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(caseGeo),
        new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.55 }),
      ),
    )
    caseGeo.dispose()

    // Motherboard tray (back wall)
    const tray = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 0.96, H * 0.96),
      new THREE.MeshStandardMaterial({ color: 0x080d16, roughness: 0.85, side: THREE.DoubleSide }),
    )
    tray.position.set(0, 0, -D / 2 + 0.01)
    scene.add(tray)

    // Bottom panel
    const bottom = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 0.96, D * 0.96),
      new THREE.MeshStandardMaterial({ color: 0x04070c, roughness: 0.9, side: THREE.DoubleSide }),
    )
    bottom.position.set(0, -H / 2 + 0.005, 0)
    bottom.rotation.x = -Math.PI / 2
    scene.add(bottom)

    // Top panel (translucent so AIO fans glow through)
    const topPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 0.96, D * 0.96),
      new THREE.MeshStandardMaterial({
        color: 0x1e2937,
        roughness: 0.8,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
      }),
    )
    topPanel.position.set(0, H / 2 - 0.005, 0)
    topPanel.rotation.x = -Math.PI / 2
    scene.add(topPanel)

    // ===== Fan factory =====
    // A fan is a thin cylinder body + LED ring + spoke disc + hub.
    // axis: "x" for front/rear fans (rotating around X), "y" for top/GPU fans.
    function buildFan(opts: {
      x: number
      y: number
      z: number
      r: number
      axis: "x" | "y"
      ledColor: number
      glow?: number
    }) {
      const group = new THREE.Group()
      const { r, ledColor, axis } = opts
      const glowIntensity = opts.glow ?? 0.9

      // Outer LED ring (the glowing blue halo from the photo)
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, r * 0.07, 12, 48),
        new THREE.MeshStandardMaterial({
          color: ledColor,
          emissive: ledColor,
          emissiveIntensity: glowIntensity,
          metalness: 0.2,
          roughness: 0.4,
        }),
      )
      group.add(ring)

      // Frame / shroud (darker, slightly larger than blades)
      const frame = new THREE.Mesh(
        new THREE.TorusGeometry(r * 0.97, r * 0.05, 8, 32),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.6 }),
      )
      group.add(frame)

      // Translucent inner disc (so we see "through" the fan slightly)
      const disc = new THREE.Mesh(
        new THREE.CircleGeometry(r * 0.92, 32),
        new THREE.MeshStandardMaterial({
          color: 0x0a1220,
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
          roughness: 0.7,
        }),
      )
      group.add(disc)

      // Blades (7 thin curved bars)
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.4,
        roughness: 0.5,
        side: THREE.DoubleSide,
      })
      const bladeGroup = new THREE.Group()
      const bladeCount = 7
      for (let i = 0; i < bladeCount; i++) {
        const blade = new THREE.Mesh(new THREE.PlaneGeometry(r * 0.78, r * 0.22), bladeMat)
        const a = (i / bladeCount) * Math.PI * 2
        blade.position.set(Math.cos(a) * r * 0.42, Math.sin(a) * r * 0.42, 0)
        blade.rotation.z = a + 0.45
        bladeGroup.add(blade)
      }
      // Animation tag — spun in the render loop
      ;(bladeGroup as unknown as { userData: { spin?: number } }).userData.spin = 0.8 + Math.random() * 0.4
      group.add(bladeGroup)
      ;(group as unknown as { userData: { bladeGroup?: THREE.Group } }).userData.bladeGroup = bladeGroup

      // Center hub
      const hub = new THREE.Mesh(
        new THREE.CircleGeometry(r * 0.2, 24),
        new THREE.MeshStandardMaterial({
          color: 0x1e3a8a,
          emissive: 0x60a5fa,
          emissiveIntensity: 0.5,
          metalness: 0.6,
          roughness: 0.4,
        }),
      )
      group.add(hub)

      // Orient: by default the fan circle lies in XY-plane, axis pointing along Z.
      if (axis === "x") {
        // Rotate so the fan faces +X direction (axis along X)
        group.rotation.y = Math.PI / 2
      } else if (axis === "y") {
        // Rotate so the fan faces +Y direction (axis along Y)
        group.rotation.x = -Math.PI / 2
      }

      group.position.set(opts.x, opts.y, opts.z)
      return group
    }

    const fanRotators: { group: THREE.Group; speed: number }[] = []

    // ===== Top AIO radiator + 3 fans =====
    const aioBody = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.85, 0.32, D * 0.88),
      new THREE.MeshStandardMaterial({ color: 0x0c1018, metalness: 0.4, roughness: 0.65 }),
    )
    aioBody.position.set(0, H / 2 - 0.4, 0)
    scene.add(aioBody)

    // Radiator fin lines on visible front edge
    const finLineMat = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.55 })
    const finVerts: number[] = []
    for (let i = 0; i < 32; i++) {
      const x = -W * 0.42 + (i / 31) * (W * 0.84)
      finVerts.push(x, H / 2 - 0.55, D * 0.44, x, H / 2 - 0.25, D * 0.44)
    }
    const finGeo = new THREE.BufferGeometry()
    finGeo.setAttribute("position", new THREE.Float32BufferAttribute(finVerts, 3))
    scene.add(new THREE.LineSegments(finGeo, finLineMat))

    const topFanXs = [-1.1, 1.1]
    for (const x of topFanXs) {
      const f = buildFan({ x, y: H / 2 - 0.8, z: 0, r: 0.9, axis: "y", ledColor: 0x67e8f9, glow: 1.3 })
      scene.add(f)
      const blades = (f as unknown as { userData: { bladeGroup?: THREE.Group } }).userData.bladeGroup
      if (blades) fanRotators.push({ group: blades, speed: 4 + Math.random() * 1.5 })
    }

    // ===== Front intake fans (3 large, face-on along +X) =====
    // Top intake sits a little lower than mid-tower symmetric to give the
    // top-intake airflow more vertical room between it and the AIO fans.
    const intakeYs = [1.55, 0, -1.85]
    for (const y of intakeYs) {
      const f = buildFan({ x: W / 2 - 0.08, y, z: 0, r: 0.9, axis: "x", ledColor: 0x67e8f9, glow: 1.3 })
      scene.add(f)
      const blades = (f as unknown as { userData: { bladeGroup?: THREE.Group } }).userData.bladeGroup
      if (blades) fanRotators.push({ group: blades, speed: 4 + Math.random() * 1.5 })
    }

    // ===== Rear exhaust fan (matches the cyan-LED look of the other case fans) =====
    {
      const f = buildFan({ x: -W / 2 + 0.08, y: 1.8, z: 0, r: 0.7, axis: "x", ledColor: 0x67e8f9, glow: 1.3 })
      scene.add(f)
      const blades = (f as unknown as { userData: { bladeGroup?: THREE.Group } }).userData.bladeGroup
      if (blades) fanRotators.push({ group: blades, speed: -3.5 })
    }

    // ===== Motherboard PCB + components =====
    const mobo = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 3.4),
      new THREE.MeshStandardMaterial({ color: 0x0a1424, roughness: 0.75, metalness: 0.15, side: THREE.DoubleSide }),
    )
    mobo.position.set(-0.5, 0.5, -D / 2 + 0.04)
    scene.add(mobo)
    // PCB trace hints
    const traceMat = new THREE.LineBasicMaterial({ color: 0x1e3a8a, transparent: true, opacity: 0.4 })
    const traceVerts: number[] = []
    for (let i = 0; i < 7; i++) {
      const ty = -1.1 + (i / 6) * 2.4
      traceVerts.push(-2.3, ty, -D / 2 + 0.05, 1.3, ty, -D / 2 + 0.05)
    }
    const traceGeo = new THREE.BufferGeometry()
    traceGeo.setAttribute("position", new THREE.Float32BufferAttribute(traceVerts, 3))
    scene.add(new THREE.LineSegments(traceGeo, traceMat))

    // CPU AIO block (Corsair-style square pump in the middle of the mobo)
    const cpu = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.75, 0.32),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.65, roughness: 0.4 }),
    )
    cpu.position.set(-0.5, 1.25, -D / 2 + 0.18)
    scene.add(cpu)
    const cpuLogo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.52, 0.52),
      new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.85 }),
    )
    cpuLogo.position.set(-0.5, 1.25, -D / 2 + 0.345)
    scene.add(cpuLogo)

    // RAM sticks
    const ramMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.6, roughness: 0.4 })
    const ramTopMat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      emissive: 0x0891b2,
      emissiveIntensity: 0.5,
    })
    for (let i = 0; i < 4; i++) {
      const ram = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.15, 0.16), ramMat)
      ram.position.set(0.6 + i * 0.2, 1.18, -D / 2 + 0.18)
      scene.add(ram)
      const top = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.06, 0.17), ramTopMat)
      top.position.set(0.6 + i * 0.2, 1.78, -D / 2 + 0.18)
      scene.add(top)
    }

    // AIO tubes — two soft cylinders from radiator down to CPU pump
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.3, roughness: 0.6 })
    const tubeA = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, H / 2 - 0.6, -D / 2 + 0.4),
      new THREE.Vector3(-0.35, 2.1, -D / 2 + 0.4),
      new THREE.Vector3(-0.45, 1.65, -D / 2 + 0.4),
    ])
    const tubeB = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.1, H / 2 - 0.6, -D / 2 + 0.4),
      new THREE.Vector3(-0.1, 2.1, -D / 2 + 0.4),
      new THREE.Vector3(-0.35, 1.6, -D / 2 + 0.4),
    ])
    for (const c of [tubeA, tubeB]) {
      scene.add(new THREE.Mesh(new THREE.TubeGeometry(c, 24, 0.08, 8, false), tubeMat))
    }

    // ===== GPU (horizontal, in front of motherboard) =====
    const gpuW = 3.8
    const gpuH = 0.65
    const gpuD = 1.4
    const gpu = new THREE.Mesh(
      new THREE.BoxGeometry(gpuW, gpuH, gpuD),
      new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.55, roughness: 0.5 }),
    )
    gpu.position.set(-0.75, -0.5, 0.15)
    scene.add(gpu)

    // GPU front-face stripe (the visible "GEFORCE RTX" edge)
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(gpuW * 0.92, 0.06, gpuD + 0.012),
      new THREE.MeshStandardMaterial({ color: 0x0e7490, emissive: 0x0891b2, emissiveIntensity: 0.4 }),
    )
    stripe.position.set(-0.75, -0.18, 0.15)
    scene.add(stripe)

    // GPU bottom intake fans (face -Y, taking air in from below)
    for (const xOff of [-1.1, 0, 1.1]) {
      const f = buildFan({
        x: -0.75 + xOff,
        y: -0.5 - gpuH / 2 - 0.03,
        z: 0.15,
        r: 0.36,
        axis: "y",
        ledColor: 0x334155,
        glow: 0.05,
      })
      scene.add(f)
      const blades = (f as unknown as { userData: { bladeGroup?: THREE.Group } }).userData.bladeGroup
      if (blades) fanRotators.push({ group: blades, speed: 6 })
    }

    // PCIe rear bracket
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, gpuH * 1.6, gpuD * 0.96),
      new THREE.MeshStandardMaterial({ color: 0x6b7280, metalness: 0.7, roughness: 0.4 }),
    )
    bracket.position.set(-W / 2 + 0.08, -0.4, 0.15)
    scene.add(bracket)

    // ===== PSU shroud =====
    const psuH = 1.15
    const psu = new THREE.Mesh(
      new THREE.BoxGeometry(W * 0.96, psuH, D * 0.95),
      new THREE.MeshStandardMaterial({ color: 0x05080d, roughness: 0.88, metalness: 0.15 }),
    )
    psu.position.set(0, -H / 2 + psuH / 2, 0)
    scene.add(psu)

    // ===== Duct (ducted mode only) =====
    // Profile matches the CAD side view: long flat body with an open slot on top,
    // smooth flared/funnel intake mouth on the right (flares up and down beyond
    // the body), and a rounded bottom-left corner.
    if (mode === "ducted") {
      const frontX = 2.3                  // mouth front face (closer to intake fans, with small clearance)
      const flareStartX = frontX - 0.9    // where body transitions into mouth flare
      const backX = -2.0                  // back of body (left edge)
      const bodyTopY = -0.95              // top of body (GPU sits above with clearance)
      const bodyBotY = -1.78              // bottom of body (slightly elevated above PSU)
      const mouthTopY = 0.35              // top of flared mouth (tall — catches lower 2 fans)
      const mouthBotY = -1.95             // bottom of flared mouth (sits on PSU floor)
      const roundR = 0.4                  // rounded corner radius (bottom-left)
      const ductDepth = D - 0.4

      const ductShape = new THREE.Shape()
      // 1. Top-left corner of body
      ductShape.moveTo(backX, bodyTopY)
      // 2. Body top going right
      ductShape.lineTo(flareStartX, bodyTopY)
      // 3. Smooth upper flare from body top → mouth top
      ductShape.quadraticCurveTo(frontX, bodyTopY, frontX, mouthTopY)
      // 4. Right edge — the flat mouth face
      ductShape.lineTo(frontX, mouthBotY)
      // 5. Smooth lower flare from mouth bottom → body bottom
      ductShape.quadraticCurveTo(frontX, bodyBotY, flareStartX, bodyBotY)
      // 6. Body bottom going left
      ductShape.lineTo(backX + roundR, bodyBotY)
      // 7. Rounded bottom-left corner
      ductShape.quadraticCurveTo(backX, bodyBotY, backX, bodyBotY + roundR)
      // 8. Left edge going up to close (implicit lineTo start)

      const ductGeom = new THREE.ExtrudeGeometry(ductShape, {
        depth: ductDepth,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.025,
        bevelSegments: 2,
        curveSegments: 48,
      })
      ductGeom.translate(0, 0, -ductDepth / 2)

      const duct = new THREE.Mesh(
        ductGeom,
        new THREE.MeshStandardMaterial({
          color: 0xfbbf24,            // warm amber — contrasts with the cyan/blue case interior
          emissive: 0xfbbf24,
          emissiveIntensity: 0.08,
          roughness: 0.6,
          metalness: 0.1,
          transparent: true,
          opacity: 0.22,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      )
      scene.add(duct)

      // Crisp amber outline so the see-through shape pops against the dark interior
      scene.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(ductGeom),
          new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.95 }),
        ),
      )

      // ----- Open slot on top of the body (the dark inset rectangle from the CAD) -----
      // GPU fans sit above this slot and pull air upward through it.
      const slotPadFront = 0.12  // inset from flareStartX
      const slotPadBack = 0.18   // inset from backX
      const slotXStart = backX + slotPadBack
      const slotXEnd = flareStartX - slotPadFront
      const slotW = slotXEnd - slotXStart
      const slotDepth = ductDepth * 0.65

      // Recessed dark "well" inside the slot (shows there's an opening, not a solid top)
      const slotFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(slotW, slotDepth),
        new THREE.MeshBasicMaterial({ color: 0x05080d, side: THREE.DoubleSide }),
      )
      slotFloor.rotation.x = -Math.PI / 2
      slotFloor.position.set((slotXStart + slotXEnd) / 2, bodyTopY - 0.04, 0)
      scene.add(slotFloor)

      // Subtle cyan glow filling the slot — visually links it to the airflow exit
      const slotGlow = new THREE.Mesh(
        new THREE.PlaneGeometry(slotW * 0.96, slotDepth * 0.92),
        new THREE.MeshBasicMaterial({
          color: 0x67e8f9,
          transparent: true,
          opacity: 0.16,
          side: THREE.DoubleSide,
        }),
      )
      slotGlow.rotation.x = -Math.PI / 2
      slotGlow.position.set((slotXStart + slotXEnd) / 2, bodyTopY + 0.005, 0)
      scene.add(slotGlow)

      // Thin dark "lip" stroke around the slot so its edge reads cleanly from the side
      const lipMat = new THREE.LineBasicMaterial({ color: 0x0a0d14, transparent: true, opacity: 0.85 })
      const lipVerts = [
        slotXStart, bodyTopY + 0.001, -slotDepth / 2,
        slotXEnd, bodyTopY + 0.001, -slotDepth / 2,
        slotXEnd, bodyTopY + 0.001, slotDepth / 2,
        slotXStart, bodyTopY + 0.001, slotDepth / 2,
        slotXStart, bodyTopY + 0.001, -slotDepth / 2,
      ]
      const lipGeo = new THREE.BufferGeometry()
      lipGeo.setAttribute("position", new THREE.Float32BufferAttribute(lipVerts, 3))
      scene.add(new THREE.Line(lipGeo, lipMat))

      // Subtle 3D-print layer lines on the visible side of the body
      const layerMat = new THREE.LineBasicMaterial({ color: 0x6b7280, transparent: true, opacity: 0.35 })
      const layerVerts: number[] = []
      for (let i = 1; i < 6; i++) {
        const ly = bodyBotY + (i / 6) * (bodyTopY - bodyBotY)
        layerVerts.push(backX + 0.08, ly, ductDepth / 2 + 0.002, flareStartX - 0.05, ly, ductDepth / 2 + 0.002)
      }
      const layerGeo = new THREE.BufferGeometry()
      layerGeo.setAttribute("position", new THREE.Float32BufferAttribute(layerVerts, 3))
      scene.add(new THREE.LineSegments(layerGeo, layerMat))
    }

    // ===== Airflow curves =====
    const flowCurves: FlowCurve[] = []
    const heatCurves: FlowCurve[] = []

    // All flow curves run in the z=0.5 plane (slightly in front of the duct/GPU)
    // so the airflow reads as a clean 2D streamline in the side view.
    const FZ = 0.5
    if (mode === "ducted") {
      // All paths start OUTSIDE the case on the right (green intake) and end
      // OUTSIDE the case on the left/top (red exhaust). The particle color
      // transitions green → cyan → red along the path automatically.
      flowCurves.push(
        // Bottom intake → mouth → body floor → slot → up through GPU-left → exit LEFT horizontally → outside
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(3.6, -1.85, FZ),
            new THREE.Vector3(2.6, -1.85, FZ),
            new THREE.Vector3(2.4, -1.85, FZ),
            new THREE.Vector3(2.0, -1.85, FZ),
            new THREE.Vector3(1.0, -1.7, FZ),
            new THREE.Vector3(0.0, -1.5, FZ),
            new THREE.Vector3(-1.0, -1.3, FZ),
            new THREE.Vector3(-1.55, -1.1, FZ),
            new THREE.Vector3(-1.7, -1.0, FZ),
            new THREE.Vector3(-1.7, -0.85, FZ),
            new THREE.Vector3(-1.7, -0.4, FZ),
            new THREE.Vector3(-1.7, -0.05, FZ),
            new THREE.Vector3(-2.0, -0.05, FZ),
            new THREE.Vector3(-2.7, -0.05, FZ),
            new THREE.Vector3(-3.7, -0.05, FZ),
          ]),
          color: 0xffffff,
          count: 52,
          speed: 0.11,
          size: 0.075,
        },
        // Middle intake → mouth → duct → up through GPU-center → exit LEFT horizontally → outside
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(3.6, 0, FZ),
            new THREE.Vector3(2.6, 0, FZ),
            new THREE.Vector3(2.4, -0.1, FZ),
            new THREE.Vector3(2.15, -0.35, FZ),
            new THREE.Vector3(1.6, -0.8, FZ),
            new THREE.Vector3(0.7, -1.1, FZ),
            new THREE.Vector3(-0.2, -1.15, FZ),
            new THREE.Vector3(-0.75, -1.0, FZ),
            new THREE.Vector3(-0.75, -0.85, FZ),
            new THREE.Vector3(-0.75, -0.4, FZ),
            new THREE.Vector3(-0.75, 0.1, FZ),
            new THREE.Vector3(-1.4, 0.1, FZ),
            new THREE.Vector3(-2.4, 0.1, FZ),
            new THREE.Vector3(-3.7, 0.1, FZ),
          ]),
          color: 0xffffff,
          count: 48,
          speed: 0.105,
          size: 0.075,
        },
        // Mid-low stream → into duct → up through GPU-right → exit LEFT horizontally → outside
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(3.6, -0.9, FZ),
            new THREE.Vector3(2.6, -0.9, FZ),
            new THREE.Vector3(2.35, -1.0, FZ),
            new THREE.Vector3(1.9, -1.15, FZ),
            new THREE.Vector3(1.1, -1.25, FZ),
            new THREE.Vector3(0.3, -1.15, FZ),
            new THREE.Vector3(0.25, -0.95, FZ),
            new THREE.Vector3(0.3, -0.5, FZ),
            new THREE.Vector3(0.3, 0.25, FZ),
            new THREE.Vector3(-0.5, 0.25, FZ),
            new THREE.Vector3(-1.5, 0.25, FZ),
            new THREE.Vector3(-2.6, 0.25, FZ),
            new THREE.Vector3(-3.7, 0.25, FZ),
          ]),
          color: 0xffffff,
          count: 44,
          speed: 0.1,
          size: 0.07,
        },
        // Top intake → curves up to the RIGHT top AIO fan → exits top
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(3.6, 1.55, FZ),
            new THREE.Vector3(2.6, 1.55, FZ),
            new THREE.Vector3(2.0, 1.75, FZ),
            new THREE.Vector3(1.5, 2.0, FZ),
            new THREE.Vector3(1.1, 2.3, FZ),
            new THREE.Vector3(1.1, 2.5, FZ),
            new THREE.Vector3(1.1, 3.2, FZ),
            new THREE.Vector3(1.1, 3.8, FZ),
          ]),
          color: 0xffffff,
          count: 24,
          speed: 0.1,
          size: 0.065,
        },
        // Top intake → flows right-to-left → exits up through the LEFT top AIO fan
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(3.6, 1.55, FZ),
            new THREE.Vector3(2.6, 1.55, FZ),
            new THREE.Vector3(1.6, 1.7, FZ),
            new THREE.Vector3(0.3, 1.9, FZ),
            new THREE.Vector3(-0.6, 2.05, FZ),
            new THREE.Vector3(-1.1, 2.3, FZ),
            new THREE.Vector3(-1.1, 2.5, FZ),
            new THREE.Vector3(-1.1, 3.2, FZ),
            new THREE.Vector3(-1.1, 3.8, FZ),
          ]),
          color: 0xffffff,
          count: 24,
          speed: 0.1,
          size: 0.065,
        },
        // Top intake → flows right-to-left across the case → exits LEFT through the rear exhaust fan
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(3.6, 1.55, FZ),
            new THREE.Vector3(2.6, 1.55, FZ),
            new THREE.Vector3(1.6, 1.6, FZ),
            new THREE.Vector3(0.3, 1.7, FZ),
            new THREE.Vector3(-1.0, 1.75, FZ),
            new THREE.Vector3(-2.0, 1.8, FZ),
            new THREE.Vector3(-2.62, 1.8, FZ),
            new THREE.Vector3(-3.7, 1.8, FZ),
          ]),
          color: 0xffffff,
          count: 24,
          speed: 0.1,
          size: 0.065,
        },
      )
    } else {
      // Stock: air enters but mostly disperses. Heat pools around GPU.
      flowCurves.push(
        // Top intake → curves up to the RIGHT top AIO fan → exits top
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(3.6, 1.55, FZ),
            new THREE.Vector3(2.6, 1.55, FZ),
            new THREE.Vector3(2.0, 1.75, FZ),
            new THREE.Vector3(1.5, 2.0, FZ),
            new THREE.Vector3(1.1, 2.3, FZ),
            new THREE.Vector3(1.1, 2.5, FZ),
            new THREE.Vector3(1.1, 3.2, FZ),
            new THREE.Vector3(1.1, 3.8, FZ),
          ]),
          color: 0xffffff,
          count: 24,
          speed: 0.1,
          size: 0.065,
        },
        // Top intake → flows right-to-left → exits up through the LEFT top AIO fan
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(3.6, 1.55, FZ),
            new THREE.Vector3(2.6, 1.55, FZ),
            new THREE.Vector3(1.6, 1.7, FZ),
            new THREE.Vector3(0.3, 1.9, FZ),
            new THREE.Vector3(-0.6, 2.05, FZ),
            new THREE.Vector3(-1.1, 2.3, FZ),
            new THREE.Vector3(-1.1, 2.5, FZ),
            new THREE.Vector3(-1.1, 3.2, FZ),
            new THREE.Vector3(-1.1, 3.8, FZ),
          ]),
          color: 0xffffff,
          count: 24,
          speed: 0.1,
          size: 0.065,
        },
        // Top intake → flows right-to-left across the case → exits LEFT through the rear exhaust fan
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(3.6, 1.55, FZ),
            new THREE.Vector3(2.6, 1.55, FZ),
            new THREE.Vector3(1.6, 1.6, FZ),
            new THREE.Vector3(0.3, 1.7, FZ),
            new THREE.Vector3(-1.0, 1.75, FZ),
            new THREE.Vector3(-2.0, 1.8, FZ),
            new THREE.Vector3(-2.62, 1.8, FZ),
            new THREE.Vector3(-3.7, 1.8, FZ),
          ]),
          color: 0xffffff,
          count: 24,
          speed: 0.1,
          size: 0.065,
        },
        // Middle intake → drifts, partly upward, bypasses GPU → exits top-left → outside
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(3.6, 0, FZ),
            new THREE.Vector3(2.6, 0, FZ),
            new THREE.Vector3(1.6, 0.3, FZ),
            new THREE.Vector3(0.5, 0.55, FZ),
            new THREE.Vector3(-0.7, 0.85, FZ),
            new THREE.Vector3(-1.1, 1.5, FZ),
            new THREE.Vector3(-1.1, 2.5, FZ),
            new THREE.Vector3(-1.1, 3.2, FZ),
            new THREE.Vector3(-1.1, 3.8, FZ),
          ]),
          color: 0xffffff,
          count: 40,
          speed: 0.085,
          size: 0.06,
        },
        // Bottom intake → drifts along PSU shroud → exits rear horizontally → outside
        {
          curve: new THREE.CatmullRomCurve3([
            new THREE.Vector3(3.6, -1.85, FZ),
            new THREE.Vector3(2.6, -1.85, FZ),
            new THREE.Vector3(1.5, -1.75, FZ),
            new THREE.Vector3(0.3, -1.85, FZ),
            new THREE.Vector3(-1.0, -1.75, FZ),
            new THREE.Vector3(-2.0, -1.85, FZ),
            new THREE.Vector3(-2.7, -1.65, FZ),
            new THREE.Vector3(-3.7, -1.55, FZ),
          ]),
          color: 0xffffff,
          count: 40,
          speed: 0.075,
          size: 0.055,
        },
      )

      // Red heat pooling around GPU
      heatCurves.push(
        {
          curve: new THREE.CatmullRomCurve3(
            [
              new THREE.Vector3(-2.0, -0.18, FZ),
              new THREE.Vector3(-1.5, 0.45, FZ),
              new THREE.Vector3(-0.5, 0.95, FZ),
              new THREE.Vector3(-0.85, 1.3, FZ),
              new THREE.Vector3(-1.6, 1.6, FZ),
              new THREE.Vector3(-1.2, 0.5, FZ),
              new THREE.Vector3(-2.0, -0.18, FZ),
            ],
            true,
          ),
          color: 0xf87171,
          count: 24,
          speed: 0.05,
          size: 0.08,
        },
        {
          curve: new THREE.CatmullRomCurve3(
            [
              new THREE.Vector3(0.2, -0.18, FZ),
              new THREE.Vector3(0.5, 0.55, FZ),
              new THREE.Vector3(-0.1, 1.0, FZ),
              new THREE.Vector3(-0.5, 1.5, FZ),
              new THREE.Vector3(0.3, 0.9, FZ),
              new THREE.Vector3(0.2, -0.18, FZ),
            ],
            true,
          ),
          color: 0xf87171,
          count: 20,
          speed: 0.055,
          size: 0.08,
        },
      )
    }

    // ===== Particle systems via InstancedMesh =====
    type ParticleSystem = {
      mesh: THREE.InstancedMesh
      curve: THREE.CatmullRomCurve3
      count: number
      speed: number
      offsets: number[]
      gradient: boolean
    }

    const buildSystem = (flow: FlowCurve, gradient: boolean): ParticleSystem => {
      const sphere = new THREE.SphereGeometry(flow.size, 10, 10)
      // Flow systems use white base so the per-instance gradient color shows
      // through. Heat systems keep the curve's solid color.
      const mat = new THREE.MeshBasicMaterial({
        color: gradient ? 0xffffff : flow.color,
        transparent: true,
        opacity: 0.95,
      })
      const mesh = new THREE.InstancedMesh(sphere, mat, flow.count)
      mesh.frustumCulled = false
      if (gradient) {
        // Initialize all instance colors to white so they're not invisible on frame 0
        const initColor = new THREE.Color(0xffffff)
        for (let i = 0; i < flow.count; i++) mesh.setColorAt(i, initColor)
      }
      const offsets: number[] = []
      for (let i = 0; i < flow.count; i++) offsets.push(i / flow.count)
      scene.add(mesh)
      return { mesh, curve: flow.curve, count: flow.count, speed: flow.speed, offsets, gradient }
    }

    const flowSystems = flowCurves.map((c) => buildSystem(c, true))
    const heatSystems = heatCurves.map((c) => buildSystem(c, false))

    // Gradient endpoints used for the green → cyan → red transition
    const greenColor = new THREE.Color(0x4ade80)
    const cyanColor = new THREE.Color(0x67e8f9)
    const redColor = new THREE.Color(0xf87171)
    const tmpColor = new THREE.Color()

    // ===== Resize =====
    const resize = () => {
      const w = Math.max(mount.clientWidth, 320)
      const h = Math.max(mount.clientHeight, 240)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const obs = new ResizeObserver(resize)
    obs.observe(mount)
    resize()

    // ===== Animation loop =====
    const dummy = new THREE.Object3D()
    const tmpPoint = new THREE.Vector3()
    let frameId = 0
    const startTime = performance.now()
    let lastTime = startTime

    const updateSystem = (sys: ParticleSystem, time: number) => {
      for (let i = 0; i < sys.count; i++) {
        const raw = (time * sys.speed + sys.offsets[i]) % 1
        const t = Math.min(Math.max(raw, 0), 0.9999)
        sys.curve.getPoint(t, tmpPoint)
        const fade = Math.sin(t * Math.PI)
        dummy.position.copy(tmpPoint)
        dummy.scale.setScalar(0.55 + fade * 0.7)
        dummy.updateMatrix()
        sys.mesh.setMatrixAt(i, dummy.matrix)

        if (sys.gradient) {
          // Green outside the case (intake) → cyan inside (LED/fan zone) → red leaving
          if (t < 0.5) {
            tmpColor.copy(greenColor).lerp(cyanColor, t * 2)
          } else {
            tmpColor.copy(cyanColor).lerp(redColor, (t - 0.5) * 2)
          }
          sys.mesh.setColorAt(i, tmpColor)
        }
      }
      sys.mesh.instanceMatrix.needsUpdate = true
      if (sys.gradient && sys.mesh.instanceColor) {
        sys.mesh.instanceColor.needsUpdate = true
      }
    }

    const render = (now: number) => {
      const t = (now - startTime) / 1000
      const dt = (now - lastTime) / 1000
      lastTime = now

      // Spin fan blades
      for (const r of fanRotators) {
        r.group.rotation.z += r.speed * dt
      }

      for (const s of flowSystems) updateSystem(s, t)
      for (const s of heatSystems) updateSystem(s, t)
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(render)
    }
    frameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frameId)
      obs.disconnect()

      const visited = new Set<THREE.Material | THREE.BufferGeometry>()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments || obj instanceof THREE.InstancedMesh) {
          if (!visited.has(obj.geometry)) {
            obj.geometry.dispose()
            visited.add(obj.geometry)
          }
          const mat = obj.material as THREE.Material | THREE.Material[]
          if (Array.isArray(mat)) {
            mat.forEach((m) => {
              if (!visited.has(m)) {
                m.dispose()
                visited.add(m)
              }
            })
          } else if (!visited.has(mat)) {
            mat.dispose()
            visited.add(mat)
          }
        }
      })

      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [mode])

  return (
    <div
      ref={mountRef}
      className="relative w-full overflow-hidden rounded-lg"
      style={{
        aspectRatio: "4 / 3",
        minHeight: 280,
        background: "linear-gradient(180deg, #050810 0%, #0b1220 100%)",
      }}
      role="img"
      aria-label={`${mode === "ducted" ? "Ducted" : "Stock"} airflow simulation: 3D side view of PC case with intake fans, GPU, and AIO radiator`}
    />
  )
}
