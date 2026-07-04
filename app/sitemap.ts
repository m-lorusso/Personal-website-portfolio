import type { MetadataRoute } from "next"
import { projectsData } from "@/data/projects-data"
import { getSiteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()
  const lastModified = new Date()

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectsData
      .filter((project) => !project.hidden)
      .map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
