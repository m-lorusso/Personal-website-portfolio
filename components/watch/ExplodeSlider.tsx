"use client"

import { useEffect, useRef } from "react"
import { Pause, Play } from "lucide-react"

// Presentational control strip under the canvas: the exploded-view slider plus a
// play/pause toggle for the hand animation. The slider is uncontrolled and only
// pushes its value up via onExplodeChange (which writes a ref), keeping slider
// drags off the React render path.
export default function ExplodeSlider({
  onExplodeChange,
  playing,
  onTogglePlay,
}: {
  onExplodeChange: (value: number) => void
  playing: boolean
  onTogglePlay: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Force the assembled start ONCE on mount (defeats browser form-state
  // restoration on client navigation). Doing this in an effect — rather than a
  // render-time ref callback — means later re-renders (e.g. hover) never snap
  // the thumb back to 0 while the user has dragged it elsewhere.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "0"
      onExplodeChange(0)
    }
  }, [onExplodeChange])

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={onTogglePlay}
        aria-pressed={playing}
        aria-label={playing ? "Pause hand animation" : "Play hand animation"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.16)",
          background: "#ffffff",
          color: "#26282c",
          fontFamily: "var(--wb-mono), ui-monospace, monospace",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {playing ? <Pause size={13} /> : <Play size={13} />}
        {playing ? "Pause" : "Play"}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 220 }}>
        <span style={labelStyle}>Assembled</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          defaultValue={0}
          autoComplete="off"
          ref={inputRef}
          onChange={(e) => onExplodeChange(parseFloat(e.target.value))}
          aria-label="Exploded view amount"
          style={{ flex: 1, accentColor: "#c4894e", cursor: "pointer" }}
        />
        <span style={labelStyle}>Exploded</span>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--wb-mono), ui-monospace, monospace",
  fontSize: 10.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#5c616b",
  whiteSpace: "nowrap",
}
