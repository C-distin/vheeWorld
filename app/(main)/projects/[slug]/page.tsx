import { getAllProjects, getProjectImages } from "@/app/actions/projects"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react"

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.filter((p) => p.status === "published").map((p) => ({ slug: p.slug }))
}

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match?.[1] ?? null
}

function getVimeoId(url: string) {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match?.[1] ?? null
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const allProjects = await getAllProjects()
  const projects = allProjects.filter((p) => p.status === "published")
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  const images = project.mediaType === "gallery" ? await getProjectImages(project.id) : []

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const prev = projects[currentIndex + 1] ?? null
  const next = projects[currentIndex - 1] ?? null

  const youtubeId = project.videoUrl ? getYoutubeId(project.videoUrl) : null
  const vimeoId = project.videoUrl ? getVimeoId(project.videoUrl) : null

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

        <div className="relative z-10 max-w-5xl mx-auto space-y-5">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors">
            <IconArrowNarrowLeft size={13} /> Back to Projects
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">{project.name}</h1>
          {project.description && (
            <p className="text-base text-white/50 leading-relaxed max-w-lg">{project.description}</p>
          )}
        </div>
      </section>

      {/* ── Cover ── */}
      <div className="w-full max-w-5xl mx-auto px-8 md:px-16 -mt-8 relative z-10">
        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl relative">
          <Image src={project.coverImage} alt={project.name} fill className="object-cover" priority />
        </div>
      </div>

      {/* ── Media ── */}
      <section className="w-full py-16 px-8 md:px-16">
        <div className="max-w-5xl mx-auto">
          {/* Video */}
          {project.mediaType === "video" && (youtubeId || vimeoId) && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
              {youtubeId && (
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={project.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              )}
              {vimeoId && !youtubeId && (
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}`}
                  title={project.name}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              )}
            </div>
          )}

          {/* Masonry gallery */}
          {project.mediaType === "gallery" && images.length > 0 && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map((img, i) => (
                <div
                  key={img.id}
                  className="break-inside-avoid rounded-xl overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow duration-300">
                  <Image
                    src={img.url}
                    alt={`${project.name} — ${i + 1}`}
                    width={600}
                    height={400}
                    className="w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              ))}
            </div>
          )}

          {project.mediaType === "gallery" && images.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-sm font-semibold text-gray-400">Gallery coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Prev / Next ── */}
      {(prev || next) && (
        <section className="w-full py-12 px-8 md:px-16 border-t border-gray-100 bg-[#f7f7fb]">
          <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6">
            {prev ? (
              <Link href={`/projects/${prev.slug}`} className="group flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-1">
                  <IconArrowNarrowLeft size={11} /> Previous
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image src={prev.coverImage} alt={prev.name} fill className="object-cover" />
                  </div>
                  <span className="text-sm font-black text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                    {prev.name}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link href={`/projects/${next.slug}`} className="group flex flex-col gap-2 items-end text-right">
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-1">
                  Next <IconArrowNarrowRight size={11} />
                </span>
                <div className="flex items-center gap-3 flex-row-reverse">
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image src={next.coverImage} alt={next.name} fill className="object-cover" />
                  </div>
                  <span className="text-sm font-black text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                    {next.name}
                  </span>
                </div>
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
