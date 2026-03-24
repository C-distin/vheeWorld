import { IconArrowNarrowRight, IconQuote } from "@tabler/icons-react"
import Link from "next/link"
import HeroSection from "@/components/home/hero"

export default function Home() {
  return (
    <main className="min-h-screen w-full main-w-7xl">
      <HeroSection />

      {/* Impact Section */}
      {/* Stats Section */}
      <section className="relative w-full overflow-hidden bg-primary">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top edge accent */}
        <div className="absolute top-0 left-0 w-full h-px bg-white/20" />

        <div className="container mx-auto px-4 md:px-6 lg:px-12 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/15">
            {[
              { value: "3,000+", label: "People Served" },
              { value: "19", label: "Projects Completed" },
              { value: "19", label: "Communities Impacted" },
              { value: "GH₵ 100K+", label: "Total Donations" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center gap-2 px-6 py-8 md:py-4 group">
                {/* Subtle top accent line per stat */}
                <div className="w-8 h-0.5 bg-white/30 mb-2 group-hover:w-14 group-hover:bg-white/60 transition-all duration-300" />

                <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
                  {stat.value}
                </h3>
                <p className="text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-white/60 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom edge accent */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-white/20" />
      </section>

      {/* About Section */}
      <section className="relative w-full py-24 bg-white overflow-hidden">
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="block h-px w-10 bg-blue-400" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-400">About Us</span>
              </div>

              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl leading-tight">
                Who We <span className="text-blue-500">Are</span>
              </h2>

              <p className="text-[1.05rem] leading-relaxed text-gray-500">
                Vhee World Foundation is a nonprofit organization committed to tackling the issue of streetism and
                supporting vulnerable children in Ghana. Through a range of initiatives — including education,
                mentorship, and resource provision — the foundation aims to uplift and empower children who are at risk
                of living on the streets.
              </p>

              <p className="text-[1.05rem] leading-relaxed text-gray-500">
                By offering access to education and mentorship programs, the foundation equips children with the skills
                and knowledge to break the cycle of poverty and create a better future for themselves.
              </p>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-700 transition-colors duration-200 group mt-2">
                Learn more about our mission
                <IconArrowNarrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {/* Right: Blockquote Card */}
            <div className="relative">
              {/* Decorative glow blob */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

              <div className="relative bg-white border border-gray-100 rounded-2xl p-10 shadow-[0_8px_40px_rgba(59,130,246,0.08)]">
                {/* Vertical accent bar */}
                <div className="absolute left-0 top-8 bottom-8 w-1 bg-linear-to-b from-blue-400 to-blue-200 rounded-r-full" />

                {/* Large quote mark */}
                <div className="flex items-start gap-4 pl-6">
                  <IconQuote className="text-blue-300 w-10 h-10 shrink-0 mt-1" />
                </div>

                <blockquote className="pl-6 mt-4">
                  <p className="text-xl font-semibold leading-relaxed text-gray-800">
                    "The true measure of our success is not the number of people we have helped today, but how many
                    people no longer need our help tomorrow — because they are equipped with the tools to thrive."
                  </p>

                  <footer className="mt-8 flex items-center gap-4">
                    {/* Avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-sm shrink-0">
                      VL
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Violet Lawson</p>
                      <p className="text-xs text-gray-400 tracking-wide">President, Vhee World Foundation</p>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* President's Message */}
      {/* Video Section */}
      <section className="relative w-full py-28 overflow-hidden bg-[#1a0533]">
        {/* Layered atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-purple-600/25 rounded-full blur-[120px]" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/15 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-12">
          {/* Video Container — leads */}
          <div className="w-full max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/15">
                <svg className="w-3 h-3 text-white fill-white ml-0.5" viewBox="0 0 10 10">
                  <polygon points="2,1 9,5 2,9" />
                </svg>
              </div>
              <p className="text-sm font-medium tracking-widest text-white/50 uppercase">Message from our President</p>
            </div>

            {/* Video frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(168,85,247,0.25)] ring-1 ring-white/10">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent z-10 pointer-events-none" />
              <iframe
                className="w-full aspect-video block"
                src="https://www.youtube.com/embed/OIxFhVtalxo?si=ULMbmaxGg2Fabo0e"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          {/* Pull-quote from the video — below */}
          <div className="w-full max-w-3xl border-l-2 border-purple-400/50 pl-6 text-left">
            <p className="text-lg sm:text-xl font-medium leading-relaxed text-white/80 italic">
              "Eradicating streetism by empowering the vulnerable with the resources, mental health support, and shelter
              they need to thrive."
            </p>
            <p className="mt-3 text-sm tracking-wide text-purple-300/60 not-italic">
              — Violet Lawson, President · Vhee World Foundation
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* CTA Section */}
      <section className="relative w-full py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden">
          <div
            className="relative w-full px-8 py-20 text-center"
            style={{
              background: "linear-gradient(135deg, #2a3fc7 0%, #3b4fd4 30%, #5b3fa8 70%, #7b3fa0 100%)",
            }}>
            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Your support changes lives.
            </h2>

            {/* Subtext */}
            <p className="mt-5 text-base sm:text-lg text-white/70 max-w-md mx-auto leading-relaxed">
              Join us in our mission to build a more equitable world. Every donation goes directly to our local programs
              and community development projects.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/donate"
                className="px-8 py-3 bg-white text-blue-700 text-sm font-bold tracking-widest uppercase rounded-md hover:bg-white/90 transition-colors duration-200 min-w-[160px] text-center">
                Donate Now
              </Link>
              <Link
                href="/volunteer"
                className="px-8 py-3 bg-transparent text-white text-sm font-bold tracking-widest uppercase rounded-md border border-white/50 hover:bg-white/10 transition-colors duration-200 min-w-[160px] text-center">
                Volunteer With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
