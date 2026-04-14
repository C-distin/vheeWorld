import { headers } from "next/headers"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/auth/auth"

const f = createUploadthing()

export const ourFileRouter = {
  projectCover: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) throw new Error("Unauthorized")
      if (session.user.role !== "admin") throw new Error("Forbidden")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl, key: file.key }
    }),

  projectGallery: f({ image: { maxFileSize: "8MB", maxFileCount: 20 } })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) throw new Error("Unauthorized")
      if (session.user.role !== "admin") throw new Error("Forbidden")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl, key: file.key }
    }),

  postCoverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) throw new Error("Unauthorized")
      if (session.user.role !== "admin") throw new Error("Forbidden")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.ufsUrl, key: file.key, uploadedBy: metadata.userId }
    }),

  postImages: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) throw new Error("Unauthorized")
      if (session.user.role !== "admin") throw new Error("Forbidden")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.ufsUrl, key: file.key, uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
