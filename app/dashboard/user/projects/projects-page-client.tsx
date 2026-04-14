"use client"

import { IconLayoutGrid, IconNotes, IconPlus, IconSend } from "@tabler/icons-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectForm } from "./projects-form"
import { ProjectsTable } from "./projects-table"

interface Project {
  id: string
  name: string
  slug: string
  description: string | null
  coverImage: string
  videoUrl: string | null
  mediaType: "gallery" | "video"
  status: "draft" | "published"
  createdAt: Date
  updatedAt: Date
}

export function ProjectsPageClient({ projects }: { projects: Project[] }) {
  const [activeTab, setActiveTab] = useState("new")
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const published = projects.filter((p) => p.status === "published")
  const drafts = projects.filter((p) => p.status === "draft")

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setActiveTab("new")
  }

  const handleSuccess = () => {
    setEditingProject(null)
    setActiveTab("all")
  }

  const handleCancel = () => {
    setEditingProject(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Projects</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {projects.length} total · {published.length} published · {drafts.length} drafts
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 p-1 rounded-xl h-auto gap-1 flex-wrap">
          <TabsTrigger
            value="new"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-semibold">
            <IconPlus size={15} />
            {editingProject ? "Edit Project" : "New Project"}
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-semibold">
            <IconLayoutGrid size={15} />
            All
            {projects.length > 0 && (
              <span className="ml-1 bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {projects.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="published"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-semibold">
            <IconSend size={15} />
            Published
            {published.length > 0 && (
              <span className="ml-1 bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {published.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="drafts"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-semibold">
            <IconNotes size={15} />
            Drafts
            {drafts.length > 0 && (
              <span className="ml-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {drafts.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          <ProjectForm
            editingProject={editingProject}
            onSuccess={handleSuccess}
            onCancel={editingProject ? handleCancel : undefined}
          />
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <ProjectsTable projects={projects} emptyMessage="No projects yet." onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="published" className="mt-6">
          <ProjectsTable projects={published} emptyMessage="No published projects." onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="drafts" className="mt-6">
          <ProjectsTable projects={drafts} emptyMessage="No draft projects." onEdit={handleEdit} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
