"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconLayoutGrid, IconLoader2, IconPhoto, IconVideo, IconX } from "@tabler/icons-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  addProjectImage,
  createProject,
  deleteProjectImage,
  getProjectImages,
  updateProject,
} from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UploadButton, UploadDropzone } from "@/lib/uploadthing-client"
import { type ProjectInput, projectSchema } from "@/lib/validation/project"

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

interface GalleryImage {
  id?: string
  url: string
  key: string
  order: number
  isUploading?: boolean
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function ProjectForm({
  editingProject,
  onSuccess,
  onCancel,
}: {
  editingProject: Project | null
  onSuccess: () => void
  onCancel?: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [_coverKey, setCoverKey] = useState<string>("")
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [mediaType, setMediaType] = useState<"gallery" | "video">("gallery")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      coverImage: "",
      coverImageKey: "",
      mediaType: "gallery",
      videoUrl: "",
      status: "draft",
    },
  })

  const name = watch("name")
  const currentStatus = watch("status")

  useEffect(() => {
    if (!editingProject) {
      setValue("slug", slugify(name ?? ""))
    }
  }, [name, editingProject, setValue])

  useEffect(() => {
    if (editingProject) {
      reset({
        name: editingProject.name,
        slug: editingProject.slug,
        description: editingProject.description ?? "",
        coverImage: editingProject.coverImage,
        coverImageKey: "",
        mediaType: editingProject.mediaType,
        videoUrl: editingProject.videoUrl ?? "",
        status: editingProject.status,
      })
      setCoverPreview(editingProject.coverImage)
      setMediaType(editingProject.mediaType)

      // Load existing gallery images
      getProjectImages(editingProject.id).then((images) => {
        setGalleryImages(
          images.map((img) => ({
            id: img.id,
            url: img.url,
            key: img.key,
            order: img.order ?? 0,
          }))
        )
      })
    } else {
      reset({
        name: "",
        slug: "",
        description: "",
        coverImage: "",
        coverImageKey: "",
        mediaType: "gallery",
        videoUrl: "",
        status: "draft",
      })
      setCoverPreview(null)
      setCoverKey("")
      setGalleryImages([])
      setMediaType("gallery")
    }
  }, [editingProject, reset])

  const handleMediaTypeChange = (val: "gallery" | "video") => {
    setMediaType(val)
    setValue("mediaType", val)
  }

  const removeGalleryImage = async (img: GalleryImage, index: number) => {
    if (img.id) {
      const result = await deleteProjectImage(img.id)
      if (!result.success) {
        toast.error("Failed to delete image")
        return
      }
    }
    setGalleryImages((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProjectInput) => {
    if (!data.coverImage) {
      toast.error("Cover image is required")
      return
    }

    setIsSubmitting(true)
    const result = editingProject ? await updateProject({ ...data, id: editingProject.id }) : await createProject(data)
    setIsSubmitting(false)

    if (result.success && result.data) {
      // Save new gallery images for new projects
      if (!editingProject && galleryImages.length) {
        await Promise.all(
          galleryImages.map((img, i) =>
            addProjectImage({
              projectId: result.data?.id,
              url: img.url,
              key: img.key,
              order: i,
            })
          )
        )
      }
      toast.success(editingProject ? "Project updated" : "Project created")
      reset()
      setCoverPreview(null)
      setGalleryImages([])
      onSuccess()
    } else if (result && "fieldErrors" in result && result.fieldErrors) {
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
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Project Name</Label>
              <Input
                {...register("name")}
                placeholder="Annual Charity Drive 2024"
                className={errors.name ? "border-red-300" : ""}
              />
              {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">/projects/</span>
                <Input
                  {...register("slug")}
                  placeholder="annual-charity-drive-2024"
                  className={`font-mono text-sm ${errors.slug ? "border-red-300" : ""}`}
                />
              </div>
              {errors.slug && <p className="text-[11px] text-red-500">{errors.slug.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Brief description of this project..."
                rows={3}
                className="resize-none"
              />
              {errors.description && <p className="text-[11px] text-red-500">{errors.description.message}</p>}
            </div>

            {/* Media type toggle */}
            <div className="space-y-3">
              <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Gallery Type</Label>
              <RadioGroup value={mediaType} onValueChange={handleMediaTypeChange} className="flex gap-4">
                <label
                  className={`flex items-center gap-3 flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    mediaType === "gallery" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <RadioGroupItem value="gallery" className="sr-only" />
                  <IconLayoutGrid size={20} className={mediaType === "gallery" ? "text-purple-600" : "text-gray-400"} />
                  <div>
                    <p className={`text-sm font-bold ${mediaType === "gallery" ? "text-purple-700" : "text-gray-700"}`}>
                      Photo Gallery
                    </p>
                    <p className="text-[11px] text-gray-400">Masonry grid of images</p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    mediaType === "video" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <RadioGroupItem value="video" className="sr-only" />
                  <IconVideo size={20} className={mediaType === "video" ? "text-purple-600" : "text-gray-400"} />
                  <div>
                    <p className={`text-sm font-bold ${mediaType === "video" ? "text-purple-700" : "text-gray-700"}`}>
                      Video
                    </p>
                    <p className="text-[11px] text-gray-400">Single video embed</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* Video URL */}
            {mediaType === "video" && (
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Video URL</Label>
                <Input
                  {...register("videoUrl")}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={errors.videoUrl ? "border-red-300" : ""}
                />
                {errors.videoUrl && <p className="text-[11px] text-red-500">{errors.videoUrl.message}</p>}
                <p className="text-[11px] text-gray-400">Supports YouTube and Vimeo URLs</p>
              </div>
            )}

            {/* Gallery upload */}
            {mediaType === "gallery" && (
              <div className="space-y-3">
                <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
                  Gallery Images
                </Label>

                {/* Masonry preview */}
                {galleryImages.length > 0 && (
                  <div className="columns-2 sm:columns-3 gap-2 space-y-2">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="relative break-inside-avoid rounded-lg overflow-hidden group">
                        <Image
                          src={img.url}
                          alt={`Gallery ${i + 1}`}
                          width={400}
                          height={300}
                          className="w-full object-cover"
                        />
                        {/* Order badge */}
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">{i + 1}</span>
                        </div>
                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(img, i)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100">
                          <IconX size={12} />
                        </button>
                        {img.isUploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <IconLoader2 size={20} className="text-white animate-spin" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <UploadDropzone
                  endpoint="projectGallery"
                  onClientUploadComplete={async (res) => {
                    const newImages = res.map((file, i) => ({
                      url: file.ufsUrl,
                      key: file.key,
                      order: galleryImages.length + i,
                    }))

                    if (editingProject) {
                      await Promise.all(
                        newImages.map((img) => addProjectImage({ projectId: editingProject.id, ...img }))
                      )
                    }

                    setGalleryImages((prev) => [...prev, ...newImages])
                    toast.success(`${res.length} image${res.length > 1 ? "s" : ""} uploaded`)
                  }}
                  onUploadError={(error) => {
                    console.error(error)
                    toast.error("Upload failed")
                  }}
                  appearance={{
                    container:
                      "border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors cursor-pointer bg-gray-50",
                    label: "text-sm text-gray-400 font-medium",
                    allowedContent: "text-xs text-gray-300",
                    uploadIcon: "text-gray-300",
                    button:
                      "bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold tracking-widest uppercase rounded-lg px-4 py-2 mt-2",
                  }}
                />
                <p className="text-[11px] text-gray-400">
                  Upload up to 20 images. They will be displayed in a masonry grid.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Settings */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400">Settings</h3>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-600">Status</Label>
              <Select value={currentStatus} onValueChange={(val) => setValue("status", val as "draft" | "published")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
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
                {editingProject ? "Update" : "Create"}
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
                    setCoverKey("")
                    setValue("coverImage", "")
                    setValue("coverImageKey", "")
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                  <IconX size={12} />
                </button>
              </div>
            ) : (
              <UploadButton
                endpoint="projectCover"
                onClientUploadComplete={(res) => {
                  const file = res[0]
                  setCoverPreview(file.ufsUrl)
                  setCoverKey(file.key)
                  setValue("coverImage", file.ufsUrl)
                  setValue("coverImageKey", file.key)
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

          {/* Gallery summary */}
          {mediaType === "gallery" && galleryImages.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 flex items-center gap-2">
                <IconLayoutGrid size={13} /> Gallery
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-700">{galleryImages.length} images</p>
                <button
                  type="button"
                  onClick={() => setGalleryImages([])}
                  className="text-[11px] text-red-400 hover:text-red-600 font-semibold transition-colors">
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {galleryImages.slice(0, 8).map((img, i) => (
                  <div key={i} className="aspect-square rounded-md overflow-hidden relative">
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </div>
                ))}
                {galleryImages.length > 8 && (
                  <div className="aspect-square rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-400">+{galleryImages.length - 8}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
