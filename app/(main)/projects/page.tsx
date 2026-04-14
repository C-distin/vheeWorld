import { getAllProjects } from "@/app/actions/projects"
import Link from "next/link"
import Image from "next/image"
import { IconArrowNarrowRight, IconMoodEmpty, IconPhoto, IconVideo } from "@tabler/icons-react"

export default async function ProjectsPage() {
  const allProjects = await getAllProjects()
  const projects = allProjects.filter((p) => p.status === "published")

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
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-yellow-400/80">Our Work</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Projects &amp; Impact
          </h1>
          <p className="text-base text-white/50 leading-relaxed max-w-md">
            A look at the initiatives, events, and community programs that drive our mission forward.
          </p>
        </div>
      </section>

      {/* ── Projects grid ── */}
      <section className="w-full py-20 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                <IconMoodEmpty size={28} className="text-gray-300" />
              </div>
              <p className="text-lg font-black text-gray-400">No projects published yet.</p>
              <p className="text-sm text-gray-400 max-w-xs text-center leading-relaxed">
                Our team is preparing project galleries. Check back soon to see our impact in action.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300">
                  {/* Cover */}
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    <Image
                      src={project.coverImage}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Media type badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm ${
                          project.mediaType === "video" ? "bg-blue-900/70 text-blue-200" : "bg-black/50 text-white"
                        }`}>
                        {project.mediaType === "video" ? <IconVideo size={10} /> : <IconPhoto size={10} />}
                        {project.mediaType}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 space-y-3">
                    <h2 className="text-base font-black text-gray-900 leading-snug group-hover:text-purple-700 transition-colors">
                      {project.name}
                    </h2>
                    {project.description && (
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">{project.description}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 group-hover:gap-2.5 transition-all duration-200 pt-2">
                      View project
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
