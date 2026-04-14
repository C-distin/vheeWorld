"use client"

import { IconTag, IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import { toast } from "sonner"
import { deleteTag } from "@/app/actions/posts"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Tag {
  id: string
  name: string
}

export function TagsTable({ tags, onTagDeleted }: { tags: Tag[]; onTagDeleted: (id: string) => void }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deletingId) return
    setLoadingId(deletingId)
    const result = await deleteTag(deletingId)
    setLoadingId(null)
    setDeletingId(null)

    if (result.success) {
      toast.success("Tag deleted")
      onTagDeleted(deletingId)
    } else {
      toast.error("error" in result ? result.error : "Failed to delete tag")
    }
  }

  if (!tags.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
        <IconTag size={40} className="text-gray-200 mb-3" />
        <p className="text-sm font-semibold text-gray-400">No tags yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-bold text-gray-600">Name</TableHead>
              <TableHead className="font-bold text-gray-600 w-24 text-center">Posts</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id} className="hover:bg-gray-50/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-purple-100 text-purple-700 border border-purple-200">
                      {tag.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-xs text-gray-400 font-mono">—</span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={loadingId === tag.id}
                    onClick={() => setDeletingId(tag.id)}
                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50">
                    <IconTrash size={15} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete tag?</AlertDialogTitle>
            <AlertDialogDescription>This removes the tag from all posts. This cannot be undone.</AlertDialogDescription>
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
