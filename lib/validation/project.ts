import { z } from "zod"

export const projectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(500, "Description is too long").optional(),
  coverImage: z.string().min(1, "Cover image is required"),
  coverImageKey: z.string().min(1),
  mediaType: z.enum(["gallery", "video"]),
  videoUrl: z.url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
})

export const updateProjectSchema = projectSchema.partial().extend({
  id: z.uuid(),
})

export type ProjectInput = z.infer<typeof projectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
