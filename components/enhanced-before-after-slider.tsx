"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"

interface EnhancedBeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeAlt: string
  afterAlt: string
  className?: string
}

export default function EnhancedBeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  className = "",
}: EnhancedBeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }, [])

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      updatePosition(e.clientX)
    },
    [isDragging, updatePosition],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      updatePosition(e.touches[0].clientX)
    },
    [updatePosition],
  )

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      updatePosition(e.clientX)
    },
    [isDragging, updatePosition],
  )

  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = 5
    let next: number | null = null
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = -step
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = step

    if (next !== null) {
      e.preventDefault()
      setSliderPosition((prev) => Math.max(0, Math.min(100, prev + next!)))
    } else if (e.key === "Home") {
      e.preventDefault()
      setSliderPosition(0)
    } else if (e.key === "End") {
      e.preventDefault()
      setSliderPosition(100)
    }
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging, handleGlobalMouseMove, handleGlobalMouseUp])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-lg cursor-col-resize select-none ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{ touchAction: "none" }}
    >
      {/* Before Image */}
      <div className="absolute inset-0">
        <Image src={beforeImage || "/placeholder.svg"} alt={beforeAlt} fill className="object-cover" sizes="100vw" priority loading="eager" />
      </div>

      {/* After Image - Fixed clip-path calculation */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <Image src={afterImage || "/placeholder.svg"} alt={afterAlt} fill className="object-cover" sizes="100vw" priority loading="eager" />
      </div>

      {/* Slider Line - Fixed transform to use calc with percentage */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
        style={{
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
        }}
      >
        <div
          role="slider"
          tabIndex={0}
          aria-label="Before and after comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sliderPosition)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onKeyDown={handleKeyDown}
        >
          <div className="flex space-x-1">
            <div className="w-1 h-4 bg-gray-400 rounded"></div>
            <div className="w-1 h-4 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium pointer-events-none">
        After
      </div>
      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium pointer-events-none">
        Before
      </div>
    </div>
  )
}
