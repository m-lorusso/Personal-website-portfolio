"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ImageGalleryProps {
  title: string
  subtitle?: string
  images: string[]
  selectedIndex?: number
  onImageClick: (images: string[], index: number, altPrefix: string) => void
  onNavigate?: (direction: "prev" | "next") => void
  altPrefix: string
  columns?: string
  imageHeight?: string
  showNavigation?: boolean
  maxImages?: number
  showViewAll?: boolean
  unboxed?: boolean
}

export function ImageGallery({
  title,
  subtitle,
  images,
  selectedIndex = 0,
  onImageClick,
  altPrefix,
  columns = "grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  imageHeight = "h-32",
  showNavigation = false,
  maxImages,
  showViewAll = false,
  unboxed = false,
}: ImageGalleryProps) {
  const displayImages = maxImages ? images.slice(0, maxImages) : images

  return (
    <div className={unboxed ? "" : "bg-muted/10 rounded-lg p-6 border"}>
      <div className={unboxed ? "mb-5 flex items-baseline gap-3" : "text-center mb-6"}>
        {unboxed ? (
          <>
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/55">{title}</h2>
            <span aria-hidden className="h-px flex-1 bg-border/60" />
            {subtitle && <p className="hidden text-xs text-foreground/45 sm:block">{subtitle}</p>}
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold">{title}</h2>
            {subtitle && <p className="text-xs text-foreground/50 mt-1">{subtitle}</p>}
          </>
        )}
      </div>
      <div className={`grid ${columns} gap-3`}>
        {displayImages.map((image, index) => (
          <div
            key={index}
            className={`relative ${imageHeight} rounded-lg overflow-hidden cursor-pointer group ${
              index === selectedIndex && showNavigation ? "ring-4 ring-primary" : ""
            }`}
            onClick={() => onImageClick(images, index, altPrefix)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${altPrefix} ${index + 1}`}
              fill
              loading="lazy"
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 30vw, (max-width: 1024px) 20vw, 160px"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>
      {showViewAll && maxImages && images.length > maxImages && (
        <div className="text-center mt-4">
          <Button variant="outline" onClick={() => onImageClick(images, 0, altPrefix)}>
            View All {images.length} Photos
          </Button>
        </div>
      )}
    </div>
  )
}
