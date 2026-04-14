"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconLoader2, IconTag } from "@tabler/icons-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { createTag } from "@/app/actions/posts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const tagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50, "Tag name is too long"),
})

type TagInput = z.infer<typeof tagSchema>

interface Tag {
  id: string
  name: string
}

export function TagForm({ onTagCreated }: { onTagCreated: (tag: Tag) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagInput>({
    resolver: zodResolver(tagSchema),
  })

  const onSubmit = async (data: TagInput) => {
    setIsSubmitting(true)
    const result = await createTag(data.name)
    setIsSubmitting(false)

    if (result.success && result.data) {
      toast.success(`Tag "${result.data.name}" created`)
      onTagCreated(result.data)
      reset()
    } else {
      toast.error("error" in result ? result.error : "Failed to create tag")
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      <div>
        <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-400 flex items-center gap-2">
          <IconTag size={13} /> Create Tag
        </h3>
        <p className="text-xs text-gray-400 mt-1">Tags are saved in lowercase automatically.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Tag Name</Label>
          <Input
            {...register("name")}
            placeholder="e.g. mental-health"
            className={errors.name ? "border-red-300" : ""}
          />
          {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          {isSubmitting && <IconLoader2 size={15} className="animate-spin mr-2" />}
          Create Tag
        </Button>
      </form>
    </div>
  )
}
