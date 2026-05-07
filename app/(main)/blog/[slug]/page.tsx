import { IconArrowNarrowLeft, IconArrowNarrowRight, IconCalendar } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPublishedPosts } from "@/app/actions/posts"
import { BlogContent } from "@/components/blog/blog-content"

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const posts = await getPublishedPosts()
  const post = posts.find((p) => p.slug === slug)
  if (!post) notFound()

  const currentIndex = posts.findIndex((p) => p.slug === slug)
  const prev = posts[currentIndex + 1] ?? null
  const next = posts[currentIndex - 1] ?? null

  return (
    <main className="min-h-screen w-full bg-white">
      {/* ── Hero ── */}
      <section className="relative w-full bg-[#1a0533] overflow-hidden pt-32 pb-16 px-8 md:px-16">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors">
            <IconArrowNarrowLeft size={13} /> Back to Blog
          </Link>

          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-yellow-400/70">
            <IconCalendar size={11} />
            {new Date(post.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">{post.title}</h1>

          {post.excerpt && <p className="text-base text-white/50 leading-relaxed">{post.excerpt}</p>}
        </div>
      </section>

      {/* ── Cover image ── */}
      {post.coverImage && (
        <div className="w-full max-w-4xl mx-auto px-8 md:px-16 -mt-8 relative z-10">
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl relative">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <section className="w-full py-16 px-8 md:px-16">
        <div className="max-w-3xl mx-auto">
          <BlogContent content={post.content as Record<string, unknown>} />
        </div>
      </section>

      {/* ── Prev / Next ── */}
      {(prev || next) && (
        <section className="w-full py-12 px-8 md:px-16 border-t border-gray-100 bg-[#f7f7fb]">
          <div className="max-w-3xl mx-auto grid grid-cols-2 gap-6">
            {prev ? (
              <Link href={`/blog/${prev.slug}`} className="group flex flex-col gap-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-1">
                  <IconArrowNarrowLeft size={11} /> Previous
                </span>
                <span className="text-sm font-black text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link href={`/blog/${next.slug}`} className="group flex flex-col gap-1 text-right ml-auto">
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-1 justify-end">
                  Next <IconArrowNarrowRight size={11} />
                </span>
                <span className="text-sm font-black text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      )}
    </main>
  )
}
