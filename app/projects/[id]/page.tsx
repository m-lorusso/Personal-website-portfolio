import ProjectDetailClient from "./ProjectDetailClient"
import { projectsData } from "@/data/projects-data"

// Only the ids returned here are valid routes — anything else (including
// hidden projects) returns a 404.
export const dynamicParams = false

export async function generateStaticParams() {
  return projectsData.filter((project) => !project.hidden).map((project) => ({ id: String(project.id) }))
}

export default function ProjectDetail() {
  return <ProjectDetailClient />
}
