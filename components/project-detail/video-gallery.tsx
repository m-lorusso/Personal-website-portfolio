interface Video {
  id: string
  title: string
  description: string
  isShort: boolean
}

interface VideoGalleryProps {
  title: string
  videos: Video[]
  columns?: string
}

export function VideoGallery({
  title,
  videos,
  columns = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
}: VideoGalleryProps) {
  return (
    <div className="bg-muted/10 rounded-lg p-6 border">
      <h2 className="text-xl font-bold text-center mb-6">{title}</h2>
      <div className={`grid ${columns} gap-4`}>
        {videos.map((video, index) => (
          <div key={index} className="space-y-3">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-sm mb-1">{video.title}</h3>
              <p className="text-foreground/70 text-xs">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
