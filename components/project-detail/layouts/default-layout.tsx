"use client"

import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GithubIcon from "@/components/icons/github"
import { ProjectHeader } from "@/components/project-detail/project-header"
import type { ProjectLayoutProps } from "./types"

// Fallback layout for any project without a bespoke page. No visible project
// currently uses it (1–7 all have custom layouts) — it exists as the template
// for future entries in projects-data.ts, driven entirely by the data fields
// (description, features, technologies, challenges).
export default function DefaultLayout({ project }: ProjectLayoutProps) {
  return (
    <div className="space-y-8">
      <ProjectHeader project={project} />

      <div className="bg-muted/10 rounded-lg p-6 border">
        <div className="relative aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
          <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
        </div>
      </div>

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

      <div className="bg-muted/10 rounded-lg p-6 border">
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="technologies">Technologies</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          <TabsContent value="features" className="mt-4">
            <h2 className="text-lg font-bold mb-4">Key Features</h2>
            <ul className="space-y-2">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="technologies" className="mt-4">
            <h2 className="text-lg font-bold mb-4">Technologies Used</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(project.technologies).map(([category, items]) => (
                <div key={category}>
                  <h3 className="font-bold mb-2 capitalize text-sm">
                    {category.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  <ul className="space-y-1">
                    {items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span className="text-xs">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="challenges" className="mt-4">
            <h2 className="text-lg font-bold mb-4">Challenges & Solutions</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-sm">{project.challenges}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
