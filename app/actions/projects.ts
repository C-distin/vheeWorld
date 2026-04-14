"use server"

import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { projectImages, projects } from "@/lib/db/schema"
import {
  type ProjectInput,
  projectSchema,
  type UpdateProjectInput,
  updateProjectSchema,
} from "@/lib/validation/project"

const PATH = "/dashboard/admin/projects"
const utapi = new UTApi()

async function slugExists(slug: string) {
  const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1)
  return result[0] ?? null
}

export async function getAllProjects() {
  return db.select().from(projects).orderBy(desc(projects.createdAt))
}

export async function getProjectById(id: string) {
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
  return result[0] ?? null
}

export async function getProjectImages(projectId: string) {
  return db.select().from(projectImages).where(eq(projectImages.projectId, projectId)).orderBy(projectImages.order)
}

export async function createProject(data: ProjectInput) {
  const parsed = projectSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const taken = await slugExists(parsed.data.slug)
  if (taken) {
    return { success: false, fieldErrors: { slug: ["Slug already taken"] } }
  }

  try {
    const [project] = await db.insert(projects).values(parsed.data).returning()
    revalidatePath(PATH)
    return { success: true, data: project }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to create project" }
  }
}

export async function updateProject(data: UpdateProjectInput) {
  const parsed = updateProjectSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { id, ...rest } = parsed.data

  if (rest.slug) {
    const taken = await slugExists(rest.slug)
    if (taken && taken.id !== id) {
      return { success: false, fieldErrors: { slug: ["Slug already taken"] } }
    }
  }

  try {
    const [project] = await db.update(projects).set(rest).where(eq(projects.id, id)).returning()
    revalidatePath(PATH)
    revalidatePath(`${PATH}/${id}`)
    return { success: true, data: project }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to update project" }
  }
}

export async function deleteProject(id: string) {
  if (!z.uuid().safeParse(id).success) {
    return { success: false, error: "Bad ID" }
  }

  try {
    const images = await db.select().from(projectImages).where(eq(projectImages.projectId, id))
    if (images.length) {
      await utapi.deleteFiles(images.map((i) => i.key))
      await db.delete(projectImages).where(eq(projectImages.projectId, id))
    }
    await db.delete(projects).where(eq(projects.id, id))
    revalidatePath(PATH)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to delete project" }
  }
}

export async function addProjectImage(data: { projectId: string; url: string; key: string; order: number }) {
  try {
    const [image] = await db.insert(projectImages).values(data).returning()
    revalidatePath(PATH)
    return { success: true, data: image }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to save image" }
  }
}

export async function deleteProjectImage(id: string) {
  if (!z.uuid().safeParse(id).success) {
    return { success: false, error: "Bad ID" }
  }

  try {
    const [image] = await db.select().from(projectImages).where(eq(projectImages.id, id)).limit(1)
    if (!image) return { success: false, error: "Image not found" }
    await utapi.deleteFiles(image.key)
    await db.delete(projectImages).where(eq(projectImages.id, id))
    revalidatePath(PATH)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to delete image" }
  }
}

export async function publishProject(id: string) {
  return updateProject({ id, status: "published" })
}

export async function unpublishProject(id: string) {
  return updateProject({ id, status: "draft" })
}
