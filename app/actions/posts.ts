"use server"

import { and, asc, desc, eq, ilike } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { posts, postTags, tags } from "@/lib/db/schema"
import { type PostInput, postSchema, type UpdatePostInput, updatePostSchema } from "@/lib/validation/post"

const POSTS_PATH = "/dashboard/user/posts"

// ── Helpers ────────────────────────────────────────────────────────────────
async function getPostBySlug(slug: string) {
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1)
  return result[0] ?? null
}

// ── READ ───────────────────────────────────────────────────────────────────
export async function getAllPosts(search?: string) {
  return db
    .select()
    .from(posts)
    .where(search ? ilike(posts.title, `%${search}%`) : undefined)
    .orderBy(desc(posts.publishedAt))
}

export async function getAllTags() {
  return db.select().from(tags).orderBy(asc(tags.name))
}

export async function getPublishedPosts(search?: string) {
  return db
    .select()
    .from(posts)
    .where(
      search ? and(eq(posts.status, "published"), ilike(posts.title, `%${search}%`)) : eq(posts.status, "published")
    )
    .orderBy(desc(posts.publishedAt))
}

export async function getDraftPosts(search?: string) {
  return db
    .select()
    .from(posts)
    .where(search ? and(eq(posts.status, "draft"), ilike(posts.title, `%${search}%`)) : eq(posts.status, "draft"))
    .orderBy(desc(posts.publishedAt))
}

export async function getArchivedPosts(search?: string) {
  return db
    .select()
    .from(posts)
    .where(search ? and(eq(posts.status, "archived"), ilike(posts.title, `%${search}%`)) : eq(posts.status, "archived"))
    .orderBy(desc(posts.publishedAt))
}

// ── CREATE POST ────────────────────────────────────────────────────────────
export async function createPost(data: PostInput) {
  const parsed = postSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { tagIds, ...postData } = parsed.data

  const existing = await getPostBySlug(postData.slug)
  if (existing) {
    return { success: false, fieldErrors: { slug: ["This slug is already taken"] } }
  }

  try {
    const [post] = await db
      .insert(posts)
      .values({
        ...postData,
        publishedAt: postData.status === "published" ? new Date() : undefined,
      })
      .returning()

    if (tagIds?.length) {
      await db.insert(postTags).values(tagIds.map((tagId) => ({ postId: post.id, tagId })))
    }

    revalidatePath(POSTS_PATH)
    return { success: true, data: post }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to create post." }
  }
}

// ── UPDATE POST ────────────────────────────────────────────────────────────
export async function updatePost(data: UpdatePostInput) {
  const parsed = updatePostSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { id, tagIds, ...postData } = parsed.data

  // Check slug uniqueness if slug is being changed
  if (postData.slug) {
    const existing = await getPostBySlug(postData.slug)
    if (existing && existing.id !== id) {
      return { success: false, fieldErrors: { slug: ["This slug is already taken"] } }
    }
  }

  try {
    const [post] = await db
      .update(posts)
      .set({
        ...postData,
        ...(postData.status === "published" ? { publishedAt: new Date() } : {}),
      })
      .where(eq(posts.id, id))
      .returning()

    // Sync tags
    if (tagIds !== undefined) {
      await db.delete(postTags).where(eq(postTags.postId, id))
      if (tagIds.length) {
        await db.insert(postTags).values(tagIds.map((tagId) => ({ postId: id, tagId })))
      }
    }

    revalidatePath(POSTS_PATH)
    revalidatePath(`${POSTS_PATH}/${id}`)
    return { success: true, data: post }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to update post." }
  }
}

// ── DELETE POST ────────────────────────────────────────────────────────────
export async function deletePost(id: string) {
  const parsed = z.uuid().safeParse(id)
  if (!parsed.success) {
    return { success: false, error: "Invalid post ID." }
  }

  try {
    await db.delete(postTags).where(eq(postTags.postId, id))
    await db.delete(posts).where(eq(posts.id, id))

    revalidatePath(POSTS_PATH)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to delete post." }
  }
}

// ── CREATE TAG ─────────────────────────────────────────────────────────────
export async function createTag(name: string) {
  const parsed = z.string().min(1, "Tag name is required").max(50).safeParse(name)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const [tag] = await db
      .insert(tags)
      .values({ name: parsed.data.trim().toLowerCase() })
      .onConflictDoNothing()
      .returning()

    if (!tag) {
      return { success: false, error: "Tag already exists." }
    }

    revalidatePath(POSTS_PATH)
    return { success: true, data: tag }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to create tag." }
  }
}

// ── DELETE TAG ─────────────────────────────────────────────────────────────
export async function deleteTag(id: string) {
  const parsed = z.uuid().safeParse(id)
  if (!parsed.success) {
    return { success: false, error: "Invalid tag ID." }
  }

  try {
    // Remove all post associations first
    await db.delete(postTags).where(eq(postTags.tagId, id))
    await db.delete(tags).where(eq(tags.id, id))

    revalidatePath(POSTS_PATH)
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to delete tag." }
  }
}

// ── PUBLISH POST ───────────────────────────────────────────────────────────
export async function publishPostAction(id: string) {
  const parsed = z.string().uuid().safeParse(id)
  if (!parsed.success) {
    return { success: false, error: "Invalid post ID." }
  }

  try {
    const [post] = await db
      .update(posts)
      .set({
        status: "published",
        publishedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning()

    revalidatePath(POSTS_PATH)
    return { success: true, data: post }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to publish post." }
  }
}

// ── ARCHIVE POST ───────────────────────────────────────────────────────────
export async function archivePostAction(id: string) {
  const parsed = z.string().uuid().safeParse(id)
  if (!parsed.success) {
    return { success: false, error: "Invalid post ID." }
  }

  try {
    const [post] = await db.update(posts).set({ status: "archived" }).where(eq(posts.id, id)).returning()

    revalidatePath(POSTS_PATH)
    return { success: true, data: post }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to archive post." }
  }
}
