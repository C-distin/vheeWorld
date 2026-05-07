"use client"

import { IconArrowNarrowRight } from "@tabler/icons-react"
import { motion } from "motion/react"
import Link from "next/link"

const stats = [
  { value: "3,000+", label: "Children Served" },
  { value: "19", label: "Communities" },
  { value: "GH₵100K+", label: "Donated" },
] as const

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
} as const

const orbCss = `
  @keyframes orb1 {
    0%, 100% { transform: scale(1) translate(0, 0); }
    50% { transform: scale(1.15) translate(30px, -20px); }
  }
  @keyframes orb2 {
    0%, 100% { transform: scale(1.1) translate(0, 0); }
    50% { transform: scale(1) translate(-25px, 15px); }
  }
  @keyframes orb3 {
    0%, 100% { transform: scale(1) translate(0, 0); }
    50% { transform: scale(1.2) translate(15px, 20px); }
  }
  @keyframes scrollBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(6px); }
  }
`

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center bg-[#080d1f]">
      <style>{orbCss}</style>

      {/* ── Atmospheric orbs (CSS-driven, zero JS animation cost) ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
            animation: "orb1 12s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute bottom-[-15%] left-[-8%] w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
            animation: "orb2 9s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute top-[40%] left-[35%] w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)",
            animation: "orb3 14s ease-in-out infinite",
            willChange: "transform",
          }}
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 container mx-auto px-6 lg:px-16 py-32">
        <motion.div
          className="max-w-5xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.4 },
            },
          }}>
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-yellow-400/80">
              Vhee World Foundation
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeUp} className="overflow-hidden">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight">
              Giving the
              <br />
              <span className="bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                less privileged
              </span>
              <br />
              in the streets a future.
            </h1>
          </motion.div>

          {/* Animated rule */}
          <motion.div
            variants={{
              hidden: { scaleX: 0 },
              visible: {
                scaleX: 1,
                transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.6 },
              },
            }}
            className="origin-left h-px w-48 mt-8 mb-8 bg-linear-to-r from-yellow-400 to-transparent"
          />

          {/* Subheadline */}
          <motion.p variants={fadeUp} className="max-w-xl text-lg md:text-xl text-white/50 leading-relaxed mb-12">
            VheeWorld Foundation rescues, educates, and empowers those living on the streets of Ghana — giving them the
            tools to build lives of dignity and purpose.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              href="/get-involved/donate"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase text-gray-900 overflow-hidden bg-linear-to-r from-yellow-400 to-orange-400 hover:scale-[1.03] active:scale-[0.98] transition">
              <span className="relative z-10">Donate Now</span>
              <IconArrowNarrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition" />
              <div className="absolute inset-0 bg-linear-to-r from-yellow-300 to-orange-300 opacity-0 group-hover:opacity-100 transition" />
            </Link>

            <Link
              href="/get-involved"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm tracking-widest uppercase text-white/70 border border-white/15 hover:border-white/30 hover:text-white backdrop-blur-sm transition">
              Volunteer With Us
              <IconArrowNarrowRight size={16} className="group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: 1, ease: "easeOut" },
              },
            }}
            className="mt-20 pt-10 border-t border-white/[0.07] grid grid-cols-3 gap-8 max-w-lg">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: "easeOut" },
                  },
                }}
                className="flex flex-col gap-1">
                <span className="text-2xl md:text-3xl font-black text-white tracking-tight">{stat.value}</span>
                <span className="text-xs text-white/35 tracking-wide uppercase font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: 1, ease: "easeOut" },
          },
        }}
        initial="hidden"
        animate="visible"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Scroll</span>
        <div
          className="w-px h-8 bg-linear-to-b from-white/20 to-transparent"
          style={{ animation: "scrollBounce 1.5s ease-in-out infinite" }}
        />
      </motion.div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none bg-linear-to-t from-[#080d1f] to-transparent" />
    </section>
  )
}
