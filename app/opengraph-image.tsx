import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Michael Lo Russo — Engineering Portfolio"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(circle at 20% 0%, rgba(37, 99, 235, 0.35), transparent 55%), radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.25), transparent 50%), #0a0f1e",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.4em",
            color: "#60a5fa",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 128,
              fontWeight: 800,
              lineHeight: 1,
              background: "linear-gradient(90deg, #93c5fd 0%, #2563eb 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Michael Lo Russo
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#cbd5f5",
              fontWeight: 500,
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            Mechanical engineering, robotics, and construction projects.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#94a3b8",
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <span>Mechatronics</span>
            <span>·</span>
            <span>Three.js</span>
            <span>·</span>
            <span>3D Design</span>
          </div>
          <div
            style={{
              display: "flex",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#e2e8f0",
            }}
          >
            LO RUSSO
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
