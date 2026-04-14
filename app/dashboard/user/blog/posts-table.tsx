"use client"

import {
  IconArchive,
  IconDots,
  IconEdit,
  IconExternalLink,
  IconFileText,
  IconSend,
  IconTrash,
} from "@tabler/icons-react"
import { useState } from "react"
import { toast } from "sonner"
import { archivePostAction, deletePost, publishPostAction } from "@/app/actions/posts"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Defined a proper type for content based on Zod schema (z.record)
type PostContent = Record<string, unknown>

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: PostContent
  coverImage: string | null
  status: "draft" | "published" | "archived" | null
  publishedAt: Date
  updatedAt: Date
}

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  published: { label: "Published", class: "bg-green-100 text-green-700 border-green-200" },
  draft: { label: "Draft", class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  archived: { label: "Archived", class: "bg-gray-100 text-gray-600 border-gray-200" },
}

export function PostsTable({
  posts,
  emptyMessage,
  onEdit,
}: {
  posts: Post[]
  emptyMessage: string
  onEdit: (post: Post) => void
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deletingId) return
    setLoadingId(deletingId)
    const result = await deletePost(deletingId)
    setLoadingId(null)
    setDeletingId(null)
    if (result.success) {
      toast.success("Post deleted")
    } else {
      toast.error(result.error ?? "Failed to delete post")
    }
  }

  const handlePublish = async (id: string) => {
    setLoadingId(id)
    const result = await publishPostAction(id)
    setLoadingId(null)
    if (result.success) {
      toast.success("Post published")
    } else {
      toast.error("Failed to publish post")
    }
  }

  const handleArchive = async (id: string) => {
    setLoadingId(id)
    const result = await archivePostAction(id)
    setLoadingId(null)
    if (result.success) {
      toast.success("Post archived")
    } else {
      toast.error("Failed to archive post")
    }
  }

  if (!posts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
        <IconFileText size={40} className="text-gray-200 mb-3" />
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
              <TableHead className="font-bold text-gray-600 w-[40%]">Title</TableHead>
              <TableHead className="font-bold text-gray-600">Status</TableHead>
              <TableHead className="font-bold text-gray-600">Published</TableHead>
              <TableHead className="font-bold text-gray-600">Updated</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => {
              const badge = STATUS_BADGE[post.status ?? "draft"]
              const isLoading = loadingId === post.id
              return (
                <TableRow key={post.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-gray-400 font-mono">/{post.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${badge.class}`}>
                      {badge.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(post.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      {/* Replaced asChild with direct styling on Trigger */}
                      <DropdownMenuTrigger
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700 flex items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none disabled:opacity-50"
                        disabled={isLoading}>
                        <IconDots size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => onEdit(post)}>
                          <IconEdit size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {/* Replaced asChild with nested anchor tag and removed default padding */}
                        <DropdownMenuItem className="p-0">
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex w-full items-center px-2 py-1.5">
                            <IconExternalLink size={14} className="mr-2" />
                            View live
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {post.status !== "published" && (
                          <DropdownMenuItem onClick={() => handlePublish(post.id)}>
                            <IconSend size={14} className="mr-2 text-green-600" />
                            <span className="text-green-600">Publish</span>
                          </DropdownMenuItem>
                        )}
                        {post.status !== "archived" && (
                          <DropdownMenuItem onClick={() => handleArchive(post.id)}>
                            <IconArchive size={14} className="mr-2 text-yellow-600" />
                            <span className="text-yellow-600">Archive</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletingId(post.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50">
                          <IconTrash size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirm */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This is permanent. Post and all associated images will be deleted.
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
