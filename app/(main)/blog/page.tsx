import { getPublishedPosts } from "@/app/actions/posts"
import Link from "next/link"
import Image from "next/image"
import { IconCalendar, IconArrowNarrowRight, IconMoodEmpty } from "@tabler/icons-react"

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <main className="min-h-screen w-full bg-[#f7f7fb]">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-[#1a0533] pt-32 pb-20 px-8 md:px-16">
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

        <div className="relative z-10 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-yellow-400/60" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-yellow-400/80">Our Blog</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Stories &amp; Updates
          </h1>
          <p className="text-base text-white/50 leading-relaxed max-w-md">
            News, reflections, and impact stories from the VheeWorld Foundation community.
          </p>
        </div>
      </section>

      {/* ── Posts grid ── */}
      <section className="w-full py-20 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                <IconMoodEmpty size={28} className="text-gray-300" />
              </div>
              <p className="text-lg font-black text-gray-400">No posts published yet.</p>
              <p className="text-sm text-gray-400 max-w-xs text-center leading-relaxed">
                Check back soon — stories and updates from our community are on their way.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300">
                  {/* Cover */}
                  <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-50 flex items-center justify-center">
                        <span className="text-4xl font-black text-purple-200">{post.title.charAt(0)}</span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-400">
                      <IconCalendar size={11} />
                      {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>

                    <h2 className="text-base font-black text-gray-900 leading-snug group-hover:text-purple-700 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                    )}

                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:gap-2.5 transition-all duration-200 pt-2">
                      Read more
                      <IconArrowNarrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
