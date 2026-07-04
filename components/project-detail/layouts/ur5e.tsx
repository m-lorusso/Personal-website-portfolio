"use client"

import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import GithubIcon from "@/components/icons/github"
import { ProjectHeader } from "@/components/project-detail/project-header"
import { ImageGallery } from "@/components/project-detail/image-gallery"
import { VideoGallery } from "@/components/project-detail/video-gallery"
import type { ProjectLayoutProps } from "./types"

// UR5e Robotic Writing System (project 4)
export default function Ur5eLayout({ project, openLightbox }: ProjectLayoutProps) {
  return (
    <div className="space-y-8">
      <ProjectHeader project={project} />

      {/* Main Project Image */}
      <div className="bg-muted/10 rounded-lg p-6 border">
        <div className="relative aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
          <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
        </div>
      </div>

      {/* Project Description */}
      <div className="bg-muted/10 rounded-lg p-6 border">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-base">{project.longDescription}</p>
        </div>

        {(project.liveUrl || project.githubUrl) && (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {project.liveUrl && (
              <Button asChild>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" asChild>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <GithubIcon size={16} />
                  View Code
                </a>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Video Demonstrations */}
      {project.videoGallery && <VideoGallery title="Watch It In Action" videos={project.videoGallery} />}

      {/* Image Gallery */}
      {project.gallery && (
        <ImageGallery
          title="Project Photos"
          images={project.gallery}
          onImageClick={openLightbox}
          altPrefix="UR5e robotic writing system photo"
          columns="grid-cols-1 md:grid-cols-2"
          imageHeight="h-48 md:h-64"
        />
      )}

      {/* What I Learned */}
      <div className="bg-muted/10 rounded-lg p-6 border">
        <h2 className="text-xl font-bold text-center mb-6">What I Learned</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-3 text-primary">Key Skills</h3>
            <ul className="space-y-2">
              {project.learnings?.map((learning, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-foreground/80 text-sm">{learning}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-primary">Challenges</h3>
            <p className="text-foreground/80 leading-relaxed text-sm">{project.challenges}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
