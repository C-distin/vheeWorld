"use client"

import { IconArchive, IconNotes, IconPlus, IconSend, IconTag } from "@tabler/icons-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostForm } from "./posts-form"
import { PostsTable } from "./posts-table"
import { TagForm } from "./tag-form"
import { TagsTable } from "./tags-table"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: Record<string, unknown>
  coverImage: string | null
  status: "draft" | "published" | "archived" | null
  publishedAt: Date
  updatedAt: Date
}

interface Tag {
  id: string
  name: string
}

export function PostsPageClient({ posts, tags }: { posts: Post[]; tags: Tag[] }) {
  const [activeTab, setActiveTab] = useState("new")
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [localTags, setLocalTags] = useState<Tag[]>(tags)

  const published = posts.filter((p) => p.status === "published")
  const drafts = posts.filter((p) => p.status === "draft")
  const archived = posts.filter((p) => p.status === "archived")

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setActiveTab("new")
  }

  const handleFormSuccess = () => {
    setEditingPost(null)
    setActiveTab("published")
  }

  const handleCancelEdit = () => {
    setEditingPost(null)
  }

  const handleTagCreated = (tag: Tag) => {
    setLocalTags((prev) => [...prev, tag])
  }

  const handleTagDeleted = (id: string) => {
    setLocalTags((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Posts</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {posts.length} total · {published.length} published · {drafts.length} drafts · {localTags.length} tags
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 p-1 rounded-xl h-auto gap-1 flex-wrap">
          <TabsTrigger
            value="new"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-semibold">
            <IconPlus size={15} />
            {editingPost ? "Edit Post" : "New Post"}
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

          <TabsTrigger
            value="archived"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-semibold">
            <IconArchive size={15} />
            Archived
            {archived.length > 0 && (
              <span className="ml-1 bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {archived.length}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="tags"
            className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-semibold">
            <IconTag size={15} />
            Tags
            {localTags.length > 0 && (
              <span className="ml-1 bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {localTags.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          <PostForm
            tags={localTags}
            editingPost={editingPost}
            onSuccess={handleFormSuccess}
            onCancel={editingPost ? handleCancelEdit : undefined}
          />
        </TabsContent>

        <TabsContent value="published" className="mt-6">
          <PostsTable posts={published} emptyMessage="No published posts yet." onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="drafts" className="mt-6">
          <PostsTable posts={drafts} emptyMessage="No drafts yet." onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          <PostsTable posts={archived} emptyMessage="No archived posts." onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="tags" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TagForm onTagCreated={handleTagCreated} />
            </div>
            <div className="lg:col-span-2">
              <TagsTable tags={localTags} onTagDeleted={handleTagDeleted} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
