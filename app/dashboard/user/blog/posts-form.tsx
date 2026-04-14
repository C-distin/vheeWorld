"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconLoader2, IconPhoto, IconTag, IconX } from "@tabler/icons-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { savePostImage } from "@/app/actions/images"
import { createPost, updatePost } from "@/app/actions/posts"
import { RichTextEditor } from "@/components/blog/richtexteditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UploadButton } from "@/lib/uploadthing-client"
import { type PostInput, postSchema } from "@/lib/validation/post"

interface Tag {
  id: string
  name: string
}

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

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function PostForm({
  tags,
  editingPost,
  onSuccess,
  onCancel,
}: {
  tags: Tag[]
  editingPost: Post | null
  onSuccess: () => void
  onCancel?: () => void
}) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: {},
      coverImage: "",
      status: "draft",
      tagIds: [],
    },
  })

  const title = watch("title")
  const currentStatus = watch("status")

  useEffect(() => {
    if (!editingPost) {
      setValue("slug", slugify(title ?? ""))
    }
  }, [title, editingPost, setValue])

  useEffect(() => {
    if (editingPost) {
      reset({
        title: editingPost.title,
        slug: editingPost.slug,
        excerpt: editingPost.excerpt ?? "",
        content: editingPost.content,
        coverImage: editingPost.coverImage ?? "",
        status: editingPost.status ?? "draft",
        tagIds: [],
      })
      setCoverPreview(editingPost.coverImage)
      setSelectedTags([])
    } else {
      reset({
        title: "",
        slug: "",
        excerpt: "",
        content: {},
        coverImage: "",
        status: "draft",
        tagIds: [],
      })
      setCoverPreview(null)
      setSelectedTags([])
    }
  }, [editingPost, reset])

  const toggleTag = (id: string) => {
    const updated = selectedTags.includes(id) ? selectedTags.filter((t) => t !== id) : [...selectedTags, id]
    setSelectedTags(updated)
    setValue("tagIds", updated)
  }

  const onSubmit = async (data: PostInput) => {
    setIsSubmitting(true)
    const result = editingPost ? await updatePost({ ...data, id: editingPost.id }) : await createPost(data)
    setIsSubmitting(false)

    if (result.success) {
      toast.success(editingPost ? "Post updated" : "Post created")
      reset()
      setSelectedTags([])
      setCoverPreview(null)
      onSuccess()
    } else if ("fieldErrors" in result && result.fieldErrors) {
      Object.entries(result.fieldErrors).forEach(([_, messages]) => {
        if (messages) toast.error((messages as string[])[0])
      })
    } else {
      toast.error("error" in result ? result.error : "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Title</Label>
              <Input {...register("title")} placeholder="Post title" className={errors.title ? "border-red-300" : ""} />
              {errors.title && <p className="text-[11px] text-red-500">{errors.title.message}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">/blog/</span>
                <Input
                  {...register("slug")}
                  placeholder="post-slug"
                  className={`font-mono text-sm ${errors.slug ? "border-red-300" : ""}`}
                />
              </div>
              {errors.slug && <p className="text-[11px] text-red-500">{errors.slug.message}</p>}
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Excerpt</Label>
              <Textarea
                {...register("excerpt")}
                placeholder="Short description of the post..."
                rows={3}
                className={`resize-none ${errors.excerpt ? "border-red-300" : ""}`}
              />
              {errors.excerpt && <p className="text-[11px] text-red-500">{errors.excerpt.message}</p>}
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Content</Label>
              <RichTextEditor
                key={editingPost?.id ?? "new"}
                initialContent={editingPost?.content}
                onChange={(json) => setValue("content", json)}
              />
              {errors.content && <p className="text-[11px] text-red-500">Content is required</p>}
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Publish settings */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400">Publish Settings</h3>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600">Status</Label>
              <Select value={currentStatus} onValueChange={(val) => setValue("status", val as PostInput["status"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-1">
              {onCancel && (
                <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                {isSubmitting && <IconLoader2 size={15} className="animate-spin mr-2" />}
                {editingPost ? "Update" : "Create"}
              </Button>
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 flex items-center gap-2">
              <IconPhoto size={13} /> Cover Image
            </h3>
            {coverPreview ? (
              <div className="relative rounded-lg overflow-hidden aspect-video">
                <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setCoverPreview(null)
                    setValue("coverImage", "")
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                  <IconX size={12} />
                </button>
              </div>
            ) : (
              <UploadButton
                endpoint="postCoverImage"
                onClientUploadComplete={async (res) => {
                  const file = res[0]
                  setCoverPreview(file.ufsUrl)
                  setValue("coverImage", file.ufsUrl)
                  if (editingPost) {
                    await savePostImage({
                      url: file.ufsUrl,
                      key: file.key,
                      postId: editingPost.id,
                    })
                  }
                  toast.success("Cover uploaded")
                }}
                onUploadError={(error) => {
                  console.error(error)
                  toast.error("Upload failed")
                }}
                appearance={{
                  button:
                    "w-full bg-gray-50 border border-dashed border-gray-200 text-gray-400 text-xs font-semibold hover:bg-gray-100 transition-colors rounded-lg py-6",
                  allowedContent: "hidden",
                }}
              />
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 flex items-center gap-2">
              <IconTag size={13} /> Tags
            </h3>
            {tags.length ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      selectedTags.includes(tag.id)
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "border-gray-200 text-gray-500 hover:border-purple-300"
                    }`}>
                    {tag.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No tags yet.</p>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
