"use client"

import Link from "next/link"
import { motion } from "motion/react"

const timeline = [
  {
    year: "2015",
    title: "The Beginning",
    desc: "Founded by Miss Violet Lawson at just 19 years old, VheeWorld began with a single conviction: streetism should not be an option.",
  },
  {
    year: "2016+",
    title: "Annual Projects",
    desc: "The foundation began hosting annual charity projects — feeding, educating, and clothing individuals living on the streets.",
  },
  {
    year: "Growing",
    title: "Mental Health Advocacy",
    desc: "Expanded focus to raise awareness on the importance of positive and healthy mental health alongside physical welfare.",
  },
  {
    year: "Today",
    title: "11 Years Strong",
    desc: "Now in its eleventh year, VheeWorld continues to serve the less privileged through community engagement, donations, and advocacy.",
  },
]

const pillars = [
  {
    number: "01",
    title: "compassion",
    desc: "We approach our work with empathy and understanding, recognizing the unique challenges faced by those affected by streetism.",
    align: "left",
  },
  {
    number: "02",
    title: "Empowerment",
    desc: "Our programs are designed to provide individuals with the tools and support they need to become self-sufficient and regain control over their lives.",
    align: "right",
  },
  {
    number: "03",
    title: "Sustainability",
    desc: "We equip individuals with the skills, resources, and mental health support they need to build healthy, self-sufficient lives — and contribute positively to society.",
    align: "left",
  },
  {
    number: "04",
    title: "Collaboration",
    desc: "We believe in the power of partnerships and work closely with various stakeholders, including government agencies, businesses, and local communities, to maximize our impact.",
    align: "right",
  },
]

const team = [
  {
    name: "Violet Lawson",
    role: "Founder & President",
    bio: "Founded VheeWorld at 19 with an unwavering belief that streetism should not be an option. Violet leads the foundation with passion, purpose, and deep community roots.",
  },
  {
    name: "Sarah Hammond",
    role: "Secretary",
    bio: "A dedicated team of 10 individuals, each taking up vital roles across programs, outreach, communications, and operations.",
  },
  {
    name: "Grace Mawuli Agordzzo",
    role: "Public Relations Officer",
    bio: "The heartbeat of every annual project — volunteers who show up year after year to feed, clothe, educate, and encourage those in need.",
  },
  {
    name: "Emmanuelle Dodoo",
    role: "Finance Officer",
    bio: "The heartbeat of every annual project — volunteers who show up year after year to feed, clothe, educate, and encourage those in need.",
  },
  {
    name: "Stephan Adjei",
    role: "Transport and Logistics Officer",
    bio: "The heartbeat of every annual project — volunteers who show up year after year to feed, clothe, educate, and encourage those in need.",
  },
  {
    name: "Sylvester Adotey",
    role: "Marketing Officer",
    bio: "The heartbeat of every annual project — volunteers who show up year after year to feed, clothe, educate, and encourage those in need.",
  },
  {
    name: "Harriet Awuah",
    role: "Assistant Marketing Officer",
    bio: "The heartbeat of every annual project — volunteers who show up year after year to feed, clothe, educate, and encourage those in need.",
  },
  {
    name: "Portia Ayikwei",
    role: "Research Officer",
    bio: "The heartbeat of every annual project — volunteers who show up year after year to feed, clothe, educate, and encourage those in need.",
  },
  {
    name: "Joseph Darko",
    role: "Socail Media Officer",
    bio: "The heartbeat of every annual project — volunteers who show up year after year to feed, clothe, educate, and encourage those in need.",
  },
]

export default function About() {
  return (
    <main className="min-h-screen w-full bg-white">
      {/* ── Hero ── */}
      <section className="relative w-full bg-[#1a0533] overflow-hidden min-h-[520px] flex flex-col justify-end">
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

        <motion.div
          className="relative z-10 px-8 md:px-16 pb-16 pt-32"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.2 },
            },
          }}
          initial="hidden"
          animate="visible">
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="text-xs font-bold tracking-[0.25em] uppercase text-yellow-400/80 mb-4">
            Est. 2015 — Ghana
          </motion.p>
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
            Our Story: Dignity
            <br />
            is a <span className="italic font-black text-purple-300">Birthright</span>.
          </motion.h1>
        </motion.div>
      </section>

      {/* ── Origin Story + Timeline ── */}
      <section className="w-full py-24 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Left: narrative */}
          <div className="md:col-span-1 space-y-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              From one young woman's conviction to a nationwide movement.
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              VheeWorld Foundation is a registered NGO committed to tackling streetism and supporting vulnerable
              children in Ghana. Founded by Miss Violet Lawson at 19, the foundation was built on a simple but powerful
              truth: the streets should never be someone's only option.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Through education, mentorship, and resource provision, VheeWorld aims to uplift children at risk —
              equipping them with the skills to break the cycle of poverty and build better futures for themselves.
            </p>

            {/* Pull-quote */}
            <div className="border-l-2 border-purple-400/50 pl-5">
              <p className="text-sm italic text-gray-600 leading-relaxed">"Streetism should not be an option."</p>
              <p className="text-xs text-gray-400 mt-2 not-italic">— VheeWorld Foundation Motto</p>
            </div>
          </div>

          {/* Right: timeline grid */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            {timeline.map((item) => (
              <motion.div
                key={item.year}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                  },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="space-y-2">
                <span className="text-2xl font-black text-gray-900">{item.year}</span>
                <p className="text-xs font-bold tracking-widest uppercase text-purple-500">{item.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="w-full py-24 px-8 md:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-purple-400" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-500">Our Mission</span>
            </div>
            <p className="text-lg font-semibold text-gray-800 leading-relaxed">
              To minimize streetism and address mental health challenges through community engagement, donations, and
              advocacy.
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#1a0533] rounded-2xl p-10 shadow-sm space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-8 bg-yellow-400/60" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-400/80">Our Vision</span>
            </div>
            <p className="text-lg font-semibold text-white/80 leading-relaxed">
              To break the cycle of homelessness and echo the importance of a healthy mind — empowering vulnerable
              individuals with opportunities, resources, and mental health support to build healthy lives and contribute
              positively to society.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Core Architecture ── */}
      <section className="w-full bg-[#1a0533] py-4 overflow-hidden">
        <div className="max-w-5xl mx-auto px-8 md:px-16">
          <div className="flex items-center gap-3 py-10 border-b border-white/10">
            <span className="h-px w-8 bg-purple-400/50" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-purple-400/70">Our Core Values</span>
          </div>

          {pillars.map((pillar) => (
            <motion.div
              key={pillar.number}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className={`flex flex-col ${pillar.align === "right" ? "items-end text-right" : "items-start text-left"} py-20 border-b border-white/[0.06] last:border-none`}>
              <span className="text-[7rem] font-black leading-none text-white/5 select-none -mb-8">
                {pillar.number}
              </span>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-5">{pillar.title}</h3>
              <p className="max-w-md text-sm text-white/50 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="w-full py-24 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Built by people who care.</h2>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                VheeWorld is made up of 10 dedicated members who each take up vital roles across the organisation —
                united by a shared belief that no one should be left behind.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                  },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1 }}
                className="group">
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-xl mb-5 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-gray-100" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#1a0533]/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black text-gray-300">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-black text-gray-900">{member.name}</h3>
                <p className="text-xs font-bold tracking-widest uppercase text-purple-500 mt-0.5 mb-3">{member.role}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Quote CTA ── */}
      <section className="w-full py-28 px-8 md:px-16 bg-gray-50 text-center">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.2 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-8">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="text-6xl font-serif text-purple-300 leading-none select-none">
            "
          </motion.div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
            We feed, educate, and clothe — with the hope of making their lives a little less burdensome, and a lot more
            possible.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/get-involved/donate">
              <button
                type="button"
                className="px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase text-white shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-transform"
                style={{ background: "linear-gradient(90deg, #7c3aed, #6d28d9)" }}>
                Support Our Mission
              </button>
            </Link>
            <Link href="/get-involved">
              <button
                type="button"
                className="px-8 py-4 rounded-full font-semibold text-sm tracking-widest uppercase text-gray-700 border border-gray-200 hover:border-gray-400 transition-colors">
                Get Involved
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
