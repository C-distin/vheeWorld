"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { UTApi } from "uploadthing/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { postImage } from "@/lib/db/schema"

const utapi = new UTApi()
const PATH = "/dashboard/admin/posts"

export async function savePostImage(data: { url: string; key: string; postId: string }) {
  const parsed = z
    .object({
      url: z.url(),
      key: z.string().min(1),
      postId: z.uuid(),
    })
    .safeParse(data)

  if (!parsed.success) {
    return { success: false, error: "Bad data" }
  }

  try {
    const [image] = await db.insert(postImage).values(parsed.data).returning()
    revalidatePath(PATH)
    return { success: true, data: image }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to save image" }
  }
}

export async function deletePostImage(id: string) {
  if (!z.uuid().safeParse(id).success) {
    return { success: false, error: "Bad ID" }
  }

  try {
    const [image] = await db.select().from(postImage).where(eq(postImage.id, id)).limit(1)

    if (!image) return { success: false, error: "Image not found" }

    // Delete from uploadthing storage
    await utapi.deleteFiles(image.key)

    await db.delete(postImage).where(eq(postImage.id, id))
    revalidatePath(PATH)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to delete image" }
  }
}

export async function getPostImages(postId: string) {
  if (!z.uuid().safeParse(postId).success) {
    return { success: false, error: "Bad ID" }
  }

  try {
    const images = await db.select().from(postImage).where(eq(postImage.postId, postId))
    return { success: true, data: images }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to get images" }
  }
}

export async function deleteAllPostImages(postId: string) {
  if (!z.uuid().safeParse(postId).success) {
    return { success: false, error: "Bad ID" }
  }

  try {
    const images = await db.select().from(postImage).where(eq(postImage.postId, postId))

    if (images.length) {
      await utapi.deleteFiles(images.map((i) => i.key))
      await db.delete(postImage).where(eq(postImage.postId, postId))
    }

    revalidatePath(PATH)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to delete images" }
  }
}
