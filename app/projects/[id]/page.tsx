import type { Metadata } from "next"
import ProjectDetailClient from "./ProjectDetailClient"
import { projectsData } from "@/data/projects-data"
import { SITE_NAME, getSiteUrl } from "@/lib/site"

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
    alternates: {
      canonical: `/projects/${project.id}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/projects/${project.id}`,
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

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = projectsData.find((p) => p.id === Number.parseInt(id, 10))
  const siteUrl = getSiteUrl()

  // JSON-LD requires absolute URLs — metadataBase does not apply here.
  const breadcrumbJsonLd = project && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: siteUrl },
      { "@type": "ListItem", position: 2, name: project.title, item: `${siteUrl}/projects/${project.id}` },
    ],
  }

  return (
    <>
      {breadcrumbJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      )}
      <ProjectDetailClient />
    </>
  )
}
