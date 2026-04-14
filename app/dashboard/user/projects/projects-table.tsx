"use client"

import {
  IconDots,
  IconEdit,
  IconExternalLink,
  IconEyeOff,
  IconLayoutGrid,
  IconPhoto,
  IconSend,
  IconTrash,
  IconVideo,
} from "@tabler/icons-react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { deleteProject, publishProject, unpublishProject } from "@/app/actions/projects"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export function ProjectsTable({
  projects,
  emptyMessage,
  onEdit,
}: {
  projects: Project[]
  emptyMessage: string
  onEdit: (project: Project) => void
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deletingId) return
    setLoadingId(deletingId)
    const result = await deleteProject(deletingId)
    setLoadingId(null)
    setDeletingId(null)
    if (result.success) {
      toast.success("Project deleted")
    } else {
      toast.error("error" in result ? result.error : "Failed to delete")
    }
  }

  const handlePublish = async (id: string) => {
    setLoadingId(id)
    const result = await publishProject(id)
    setLoadingId(null)
    if (result.success) toast.success("Project published")
    else toast.error("Failed to publish")
  }

  const handleUnpublish = async (id: string) => {
    setLoadingId(id)
    const result = await unpublishProject(id)
    setLoadingId(null)
    if (result.success) toast.success("Moved to draft")
    else toast.error("Failed to unpublish")
  }

  if (!projects.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
        <IconLayoutGrid size={40} className="text-gray-200 mb-3" />
        <p className="text-sm font-semibold text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-bold text-gray-600 w-16">Cover</TableHead>
              <TableHead className="font-bold text-gray-600">Name</TableHead>
              <TableHead className="font-bold text-gray-600">Type</TableHead>
              <TableHead className="font-bold text-gray-600">Status</TableHead>
              <TableHead className="font-bold text-gray-600">Created</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} className="hover:bg-gray-50/50">
                {/* Cover thumbnail */}
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-gray-100 flex-shrink-0">
                    <Image src={project.coverImage} alt={project.name} fill className="object-cover" />
                  </div>
                </TableCell>

                {/* Name + slug */}
                <TableCell>
                  <p className="text-sm font-bold text-gray-900">{project.name}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">/{project.slug}</p>
                </TableCell>

                {/* Media type */}
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                      project.mediaType === "video"
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "bg-purple-50 text-purple-600 border-purple-200"
                    }`}>
                    {project.mediaType === "video" ? <IconVideo size={10} /> : <IconPhoto size={10} />}
                    {project.mediaType}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                      project.status === "published"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }`}>
                    {project.status}
                  </span>
                </TableCell>

                {/* Date */}
                <TableCell className="text-xs text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={loadingId === project.id}
                        className="h-8 w-8 text-gray-400 hover:text-gray-700">
                        <IconDots size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => onEdit(project)}>
                        <IconEdit size={14} className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer">
                          <IconExternalLink size={14} className="mr-2" /> View live
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {project.status === "draft" ? (
                        <DropdownMenuItem onClick={() => handlePublish(project.id)}>
                          <IconSend size={14} className="mr-2 text-green-600" />
                          <span className="text-green-600">Publish</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleUnpublish(project.id)}>
                          <IconEyeOff size={14} className="mr-2 text-yellow-600" />
                          <span className="text-yellow-600">Unpublish</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeletingId(project.id)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        <IconTrash size={14} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              All cover image and gallery images will be permanently deleted from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
