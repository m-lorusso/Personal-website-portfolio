"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

// Click-to-load YouTube facade: renders the video thumbnail with a play button
// and only mounts the (heavy, ~1MB of JS) YouTube iframe once the visitor asks
// for it. Fills its parent — callers supply the sizing box (e.g. aspect-video)
// with position: relative.
export default function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* hqdefault always exists but is 4:3 with letterbox bars — object-cover crops them away */}
      <Image
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />
      <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition-transform group-hover:scale-110">
        <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
      </span>
    </button>
  )
}
