"use client"

import type { IconProps } from "@tabler/icons-react"
import {
  IconArrowNarrowRight,
  IconBuildingBank,
  IconCheck,
  IconDeviceMobile,
  IconFileText,
  IconGift,
  IconHeart,
  IconMicrophone2,
  IconUsers,
} from "@tabler/icons-react"
import { motion, type Variants } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import type { ForwardRefExoticComponent, RefAttributes } from "react"

// ── Types ────────────────────────────────────────────────────────────────────

type TablerIcon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>

interface WayDetail {
  label: string
  value: string
}

interface Way {
  icon: TablerIcon
  title: string
  subtitle: string
  desc: string
  featured?: boolean
  highlights?: readonly string[]
  cta?: { label: string; href: string }
  details?: readonly WayDetail[]
  contact?: boolean
}

interface InvolvementCard {
  icon: TablerIcon
  image: string
  title: string
  subtitle: string
  desc: string
  cta: { label: string; href: string }
}

interface WhySupportItem {
  icon: string
  title: string
  desc: string
}

// ── Shared motion variants ──────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const inView = { once: true } as const
const inViewOffset = { once: true, margin: "-60px" } as const

// ── Static data ─────────────────────────────────────────────────────────────

const ways: Way[] = [
  {
    icon: IconDeviceMobile,
    title: "Donate Securely Online",
    subtitle: "Mobile Money or Bank Card",
    desc: "Donate directly on this website using Mobile Money from any network or using your Bank Card.",
    cta: { label: "Donate Now", href: "/get-involved/donate" },
    highlights: ["All networks accepted", "Instant confirmation", "Secure & encrypted"],
    featured: true,
  },
  {
    icon: IconBuildingBank,
    title: "Bank Transfer",
    subtitle: "Direct to our account",
    desc: "Make a direct bank transfer to the foundation's account. Your generosity makes a significant impact on lives in need.",
    details: [
      { label: "Account Name", value: "VheeWorld Foundation" },
      { label: "Account No.", value: "1441002243983" },
      { label: "Bank", value: "Ecobank, Spintex Branch" },
    ],
  },
  {
    icon: IconFileText,
    title: "Donate by Cheque",
    subtitle: "Contact us to arrange",
    desc: "To make a contribution via cheque, contact the foundation for further assistance.",
    details: [
      { label: "Account Name", value: "VheeWorld Foundation" },
      { label: "Account No.", value: "1441002243983" },
      { label: "Bank", value: "Ecobank, Spintex Branch" },
    ],
    contact: true,
  },
  {
    icon: IconGift,
    title: "Donate in Kind",
    subtitle: "Goods & materials",
    desc: "Have goods, materials, or resources to contribute? Get in touch and we'll guide you through the process.",
    contact: true,
  },
] satisfies Way[]

const involvementCards: InvolvementCard[] = [
  {
    icon: IconHeart,
    image: "https://2qh3exphzw.ufs.sh/f/2ZIw3S0QKedpQVqXIBh0CBcyrfP91eHV2vpaWzxwnMXSYLNo",
    title: "Invest in Change",
    subtitle: "Financial Contribution",
    desc: "Financial contributions are the lifeblood of our programs. Every cedi is meticulously directed toward human dignity and local sovereignty.",
    cta: { label: "Donate Today", href: "/get-involved/donate" },
  },
  {
    icon: IconUsers,
    image: "https://2qh3exphzw.ufs.sh/f/2ZIw3S0QKedpFGYYxSv8GB5dcbomNkOsiZf4PqYArFJ1w3HS",
    title: "Lend Your Voice",
    subtitle: "Join the Network",
    desc: "We are looking for volunteers, storytellers, and technical experts to join our on-ground teams. Share your skills to amplify our mission.",
    cta: { label: "Join the Network", href: "/get-involved/volunteer" },
  },
  {
    icon: IconMicrophone2,
    image: "https://2qh3exphzw.ufs.sh/f/2ZIw3S0QKedpXazlILnHD63vn5zu2V4kBrHyILheMWAZfdEG",
    title: "Spread the Word",
    subtitle: "Advocacy & Awareness",
    desc: "Help us raise awareness about streetism and mental health in your community. Every conversation creates change.",
    cta: { label: "Learn How", href: "get-involved/volunteer" },
  },
] satisfies InvolvementCard[]

const whySupport: WhySupportItem[] = [
  {
    icon: "📚",
    title: "Education & Mentorship",
    desc: "We fund education programs and mentorship initiatives that equip vulnerable children with skills to break the cycle of poverty.",
  },
  {
    icon: "🧠",
    title: "Mental Health Support",
    desc: "We raise awareness and provide resources for positive mental health, addressing one of the most overlooked needs on the streets.",
  },
  {
    icon: "🤝",
    title: "Community Engagement",
    desc: "Your contributions enable us to show up — year after year — to feed, clothe, and walk alongside those who have no one to turn to.",
  },
] satisfies WhySupportItem[]

// ── Subcomponents ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-purple-400" />
      <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-500">{children}</span>
    </div>
  )
}

function ContactLinks() {
  return (
    <div className="pt-2 flex flex-col gap-1.5">
      <Link
        href="mailto:vheeworld@gmail.com"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-500 hover:text-purple-700 transition-colors">
        <IconArrowNarrowRight size={13} /> vheeworld@gmail.com
      </Link>
      <Link
        href="tel:+233209334967"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-500 hover:text-purple-700 transition-colors">
        <IconArrowNarrowRight size={13} /> +233 20 933 4967
      </Link>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function GetInvolvedPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      {/* ── Hero ── */}
      <section className="relative w-full min-h-[520px] flex flex-col justify-end overflow-hidden bg-[#1a0533]">
        {/* Background effects — pure CSS, no inline style */}
        <div className="absolute inset-0 bg-[image:radial-gradient(circle_at_top_right,#7c3aed_0%,transparent_60%)] opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[image:radial-gradient(circle_at_bottom_left,#6d28d9_0%,transparent_60%)] opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[image:radial-gradient(circle,white_1px,transparent_1px)] bg-[size:28px_28px] opacity-[0.05] pointer-events-none" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 pt-40 pb-20 space-y-5">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-yellow-400/80">Get Involved</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-2xl">
            Help Us <span className="italic text-purple-300">Rewrite</span> the Narrative.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base text-white/50 leading-relaxed max-w-md">
            Join our mission to empower vulnerable children and communities through education, mentorship, and mental
            health support. Your agency fuels our shared momentum.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="origin-left h-px w-32 bg-linear-to-r from-yellow-400 to-transparent"
          />
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-b from-transparent to-white pointer-events-none" />
      </section>

      {/* ── How to Get Involved Cards ── */}
      <section className="w-full py-24 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="mb-12 space-y-2">
            <SectionLabel>How You Can Help</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Three Ways to Make an Impact</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {involvementCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={inView}
                  transition={{ delay: i * 0.1 }}
                  className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={`${card.title} — ${card.subtitle}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={i < 2}
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-linear-to-br from-violet-600 to-violet-700">
                      <Icon size={22} className="text-white" />
                    </div>
                  </div>

                  <div className="p-7 space-y-3">
                    <h3 className="text-lg font-black text-gray-900">{card.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                    <Link
                      href={card.cta.href}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors group-hover:gap-2.5">
                      {card.cta.label}
                      <IconArrowNarrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Ways to Give ── */}
      <section id="ways-to-give" className="w-full py-24 px-8 md:px-16 bg-zinc-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="space-y-3">
              <SectionLabel>Donate</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Ways to Give</h2>
              <p className="text-sm text-gray-400 max-w-md leading-relaxed">
                We offer multiple channels for contribution, ensuring every partner can support in a way that aligns
                with their capacity.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={inView}>
              <Link
                href="mailto:vheeworld@gmail.com"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-purple-500 hover:text-purple-700 transition-colors whitespace-nowrap">
                Any questions? Email us <IconArrowNarrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ways.map((way, i) => {
              const Icon = way.icon
              return (
                <motion.div
                  key={way.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={inViewOffset}
                  transition={{ delay: i * 0.08 }}
                  className={`relative rounded-2xl overflow-hidden border ${
                    way.featured
                      ? "bg-[#1a0533] border-purple-900/50 md:col-span-2"
                      : "bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  }`}>
                  {way.featured ? (
                    <div className="relative p-10 md:flex items-center gap-12 overflow-hidden">
                      <div className="absolute inset-0 bg-[image:radial-gradient(circle_at_top_right,#7c3aed_0%,transparent_70%)] opacity-20 pointer-events-none" />
                      <div className="absolute inset-0 bg-[image:radial-gradient(circle,white_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.04] pointer-events-none" />

                      <div className="relative flex-1 space-y-5 mb-8 md:mb-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                          <span className="text-[10px] font-bold tracking-widest uppercase text-yellow-400">
                            Recommended
                          </span>
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-black text-white">{way.title}</h3>
                          <p className="text-sm text-purple-300 font-semibold mt-1">{way.subtitle}</p>
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed max-w-sm">{way.desc}</p>
                        <ul className="space-y-2">
                          {way.highlights?.map((h: string) => (
                            <li key={h} className="flex items-center gap-2 text-xs text-white/60">
                              <IconCheck size={13} className="text-yellow-400 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 mx-auto md:mx-0">
                          <Icon size={40} className="text-purple-300" />
                        </div>
                        {way.cta && (
                          <Link
                            href={way.cta.href}
                            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-widest uppercase text-gray-900 bg-linear-to-r from-yellow-400 to-orange-400 hover:scale-[1.03] active:scale-[0.98] transition-transform shadow-lg">
                            {way.cta.label}
                            <IconArrowNarrowRight
                              size={15}
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 space-y-5">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                        <Icon size={22} className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900">{way.title}</h3>
                        <p className="text-xs font-semibold text-purple-500 tracking-wide mt-0.5">{way.subtitle}</p>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{way.desc}</p>

                      {way.details && (
                        <div className="rounded-xl bg-gray-50 border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                          {way.details.map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between px-4 py-3">
                              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                                {label}
                              </span>
                              <span className="text-xs font-bold text-gray-800 font-mono">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {way.contact && <ContactLinks />}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Reassurance strip */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="mt-8 rounded-2xl bg-white border border-gray-100 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              Have questions about donating? We&apos;re happy to help.
            </p>
            <div className="flex items-center gap-6 shrink-0">
              <Link
                href="mailto:vheeworld@gmail.com"
                className="text-xs font-bold tracking-wide text-purple-600 hover:text-purple-800 transition-colors">
                vheeworld@gmail.com
              </Link>
              <span className="h-4 w-px bg-gray-200" />
              <Link
                href="tel:+233209334967"
                className="text-xs font-bold tracking-wide text-purple-600 hover:text-purple-800 transition-colors">
                +233 20 933 4967
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Your Support Matters ── */}
      <section className="w-full py-24 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: image + stat */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={inView} className="relative">
            <div className="relative w-full aspect-[4/5] rounded-2xl bg-gray-100 overflow-hidden">
              <Image
                src="https://2qh3exphzw.ufs.sh/f/2ZIw3S0QKedpjlP5Dt8Xtq6MH0pPewsGWDbaiZcAzfFEYymx"
                alt="VheeWorld Foundation community impact"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1a0533]/60 via-transparent to-transparent" />
            </div>

            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-6 py-4 shadow-xl">
              <p className="text-3xl font-black text-gray-900">11 Years</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-purple-500 mt-0.5">
                of consistent impact
              </p>
            </div>
          </motion.div>

          {/* Right: content */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={inView} className="space-y-8">
            <motion.div variants={fadeUp} className="space-y-3">
              <SectionLabel>Why It Matters</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Your Support Matters Because <span className="italic text-purple-600">Narrative is Power.</span>
              </h2>
            </motion.div>

            <div className="space-y-6">
              {whySupport.map((item) => (
                <motion.div key={item.title} variants={fadeUp} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="#ways-to-give"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-widest uppercase text-white bg-linear-to-r from-violet-600 to-violet-700 hover:scale-[1.02] transition-transform shadow-lg shadow-purple-100">
                Support Our Mission
                <IconArrowNarrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm tracking-widest uppercase text-gray-600 border border-gray-200 hover:border-gray-400 transition-colors">
                Learn Our Story
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="relative w-full py-24 px-8 md:px-16 overflow-hidden bg-[#1a0533]">
        <div className="absolute inset-0 bg-[image:radial-gradient(ellipse_at_top_center,rgba(124,58,237,0.3)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[image:radial-gradient(circle,white_1px,transparent_1px)] bg-[size:28px_28px] opacity-[0.04] pointer-events-none" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <motion.div variants={fadeUp} className="text-6xl font-serif text-purple-300/40 leading-none select-none">
            "
          </motion.div>

          <motion.p variants={fadeUp} className="text-2xl md:text-3xl font-black text-white leading-snug">
            Streetism should not be an option — and with your help, it won&apos;t be.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#ways-to-give"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase text-gray-900 bg-linear-to-r from-yellow-400 to-orange-400 hover:scale-[1.03] transition-transform shadow-lg">
              Donate Now
              <IconArrowNarrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm tracking-widest uppercase text-white/70 border border-white/15 hover:border-white/30 hover:text-white transition-colors">
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
