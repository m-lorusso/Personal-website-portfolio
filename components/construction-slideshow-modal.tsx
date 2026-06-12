"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConstructionSlideshowModalProps {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  altPrefix?: string
}

export default function ConstructionSlideshowModal({
  images,
  initialIndex,
  isOpen,
  onClose,
  altPrefix = "Image",
}: ConstructionSlideshowModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Sync when opened to a new image
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex, isOpen])

  const prevIndex = (currentIndex - 1 + images.length) % images.length
  const nextIndex = (currentIndex + 1) % images.length
  const hasSiblings = images.length > 1

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length)
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev + 1) % images.length)
      else if (e.key === "ArrowLeft") setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
      else if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose, images.length])

  if (!mounted) return null

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={onClose}
            aria-label="Close slideshow"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Preload the neighbouring images using the same optimized variants
              as the main view, so prev/next swaps come straight from cache */}
          {hasSiblings && (
            <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
              <Image src={images[prevIndex] || "/placeholder.svg"} alt="" width={2400} height={1600} />
              <Image src={images[nextIndex] || "/placeholder.svg"} alt="" width={2400} height={1600} />
            </div>
          )}

          <motion.div
            className="flex items-center justify-center w-full h-full px-4 md:px-12 lg:px-16 gap-4 md:gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous image — peek on the left */}
            {hasSiblings && (
              <div
                className="hidden md:flex items-center justify-center w-24 lg:w-32 xl:w-40 flex-shrink-0 cursor-pointer"
                onClick={goPrev}
              >
                <div className="relative w-full h-32 lg:h-44 xl:h-52 rounded-lg overflow-hidden opacity-40 hover:opacity-80 transition-opacity">
                  <Image
                    src={images[prevIndex] || "/placeholder.svg"}
                    alt={`${altPrefix} ${prevIndex + 1}`}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="224px"
                  />
                </div>
              </div>
            )}

            {/* Current image — large, fills available space. Entering and exiting
                slides overlap (no mode="wait"), so the old photo stays visible
                until the new one has faded in — no black gap. */}
            <div className="relative h-full min-w-0 flex-1">
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={images[currentIndex] || "/placeholder.svg"}
                    alt={`${altPrefix} ${currentIndex + 1}`}
                    width={2400}
                    height={1600}
                    className="object-contain max-h-[88vh] max-w-full w-auto h-auto mx-auto rounded-lg"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next image — peek on the right */}
            {hasSiblings && (
              <div
                className="hidden md:flex items-center justify-center w-24 lg:w-32 xl:w-40 flex-shrink-0 cursor-pointer"
                onClick={goNext}
              >
                <div className="relative w-full h-32 lg:h-44 xl:h-52 rounded-lg overflow-hidden opacity-40 hover:opacity-80 transition-opacity">
                  <Image
                    src={images[nextIndex] || "/placeholder.svg"}
                    alt={`${altPrefix} ${nextIndex + 1}`}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="224px"
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Left arrow */}
          {hasSiblings && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}

          {/* Right arrow */}
          {hasSiblings && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); goNext() }}
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modal, document.body)
}
