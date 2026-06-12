import type { Metadata } from "next"
import ProjectDetailClient from "./ProjectDetailClient"
import { projectsData } from "@/data/projects-data"

// Only the ids returned here are valid routes — anything else (including
// hidden projects) returns a 404.
export const dynamicParams = false

export async function generateStaticParams() {
  return projectsData.filter((project) => !project.hidden).map((project) => ({ id: String(project.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const project = projectsData.find((p) => p.id === Number.parseInt(id, 10))
  if (!project) return {}

  const title = `${project.title} — Michael Lo Russo`
  const description = project.description.length > 160 ? `${project.description.slice(0, 157)}...` : project.description

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: project.image, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.image],
    },
  }
}

export default function ProjectDetail() {
  return <ProjectDetailClient />
}
