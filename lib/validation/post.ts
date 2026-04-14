import { z } from "zod"

export const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is more than 100 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug is more than 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  excerpt: z.string().max(200, "Excerpt is more than 200 characters").optional().default(""),
  content: z.record(z.string(), z.any()),
  coverImage: z.url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tagIds: z.array(z.uuid()).optional().default([]),
})

export const updatePostSchema = postSchema.partial().extend({
  id: z.uuid(),
})

export type PostInput = z.infer<typeof postSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
