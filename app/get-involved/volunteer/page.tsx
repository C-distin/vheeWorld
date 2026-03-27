"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconArrowNarrowRight, IconChevronDown, IconCircleCheck } from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const placements = [
  {
    icon: "🤝",
    title: "Street Outreach",
    desc: "Engage directly with community members to identify urgent needs and document authentic narratives.",
  },
  {
    icon: "🎓",
    title: "Mentorship",
    desc: "Partner with local youth to develop leadership skills and educational pathways for sustainable growth.",
  },
  {
    icon: "📣",
    title: "Event Support",
    desc: "Help orchestrate community summits and storytelling festivals that celebrate Ghanaian excellence.",
  },
]

const skills = ["Photography", "Education", "Counseling", "Logistics", "Writing", "Design", "Tech", "Healthcare"]

const availability = ["Weekday Mornings", "Weekday Evenings", "Weekend Mornings", "Weekend Evenings", "Flexible"]

const faqs = [
  {
    q: "Is there a minimum time commitment?",
    a: "We ask for a minimum of 4 hours per week for at least 3 months. This ensures meaningful engagement with the communities we serve.",
  },
  {
    q: "Do I need prior experience in Ghana?",
    a: "No prior experience is necessary. We provide culturally nuanced orientation and pair you with local leaders who guide your journey through our community.",
  },
  {
    q: "Are remote volunteer positions available?",
    a: "Yes. Remote roles include content creation, graphic design, data management, and social media advocacy. Contact us to explore options.",
  },
  {
    q: "How are travel expenses handled?",
    a: "VheeWorld does not cover travel costs but can provide letters of support for grant applications. We also have partnerships with accommodation providers in Accra.",
  },
]

const volunteerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  availability: z.string().min(1, "Please select your availability"),
  motivation: z.string().min(20, "Please tell us a bit more (at least 20 characters)"),
})

type VolunteerFormData = z.infer<typeof volunteerSchema>

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between px-6 py-5">
        <p className="text-sm font-semibold text-gray-900 pr-4">{q}</p>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <IconChevronDown size={18} className="text-gray-400 flex-shrink-0" />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            <p className="px-6 pb-5 pt-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Education"])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: { skills: ["Education"] },
  })

  const toggleSkill = (skill: string) => {
    const updated = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill]
    setSelectedSkills(updated)
    setValue("skills", updated)
  }

  const onSubmit = async (data: VolunteerFormData) => {
    setSubmitting(true)
    await new Promise((res) => setTimeout(res, 1200))
    console.log("Volunteer form:", data)
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen w-full bg-white">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-[#1a0533] min-h-[480px] flex flex-col justify-end">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Image placeholder top-right */}
        <div className="absolute top-0 right-0 w-72 h-full">
          <div className="w-full h-full bg-gradient-to-bl from-purple-900/40 to-transparent" />
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
          }}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 pt-40 pb-16 space-y-5">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-yellow-400/80">Community First</span>
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-2xl">
            Join Our Community of <span className="italic text-purple-300">Change-Makers</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            className="text-base text-white/50 leading-relaxed max-w-md">
            We don&apos;t just volunteer; we build lasting legacies. Experience the power of dignified narrative and
            collective action in the heart of Ghana.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}>
            <Link
              href="#apply"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-widest uppercase text-white border border-white/20 hover:bg-white/10 transition-all">
              Start Your Journey
              <IconArrowNarrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>

          {/* Floating quote */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            className="absolute bottom-16 right-8 md:right-16 max-w-[220px] bg-purple-600/80 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 hidden md:block">
            <p className="text-xs text-white/90 italic leading-relaxed">
              &ldquo;Volunteering here felt like coming home. Every story matters.&rdquo;
            </p>
            <p className="text-[9px] font-bold tracking-widest uppercase text-purple-300 mt-2">
              — Amara K., 2023 Volunteer
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Open Placements ── */}
      <section className="w-full py-24 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Open Placements</h2>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                Choose a path that aligns with your skills and passion. Every role is designed to empower, not just
                assist.
              </p>
            </motion.div>
            <div className="hidden md:flex items-center gap-2">
              <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-purple-400 transition-colors text-gray-400 hover:text-purple-600">
                ←
              </button>
              <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-purple-400 transition-colors text-gray-400 hover:text-purple-600">
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {placements.map((p, i) => (
              <motion.div
                key={p.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow p-7 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">
                  {p.icon}
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">{p.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mt-2">{p.desc}</p>
                </div>
                <Link
                  href="#apply"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors">
                  Learn More <IconArrowNarrowRight size={13} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Volunteer Application ── */}
      <section id="apply" className="w-full py-24 px-8 md:px-16 bg-[#f7f7fb]">
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10 space-y-2">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-purple-500">Step One</p>
            <h2 className="text-3xl font-black text-gray-900">Volunteer Application</h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-0.5 w-8 bg-purple-600 rounded-full" />
              <div className="h-0.5 w-4 bg-gray-200 rounded-full" />
              <div className="h-0.5 w-4 bg-gray-200 rounded-full" />
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-16 gap-5">
                  <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
                    <IconCircleCheck size={36} className="text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Application Submitted!</h3>
                    <p className="text-sm text-gray-400 mt-2 max-w-xs leading-relaxed">
                      Thank you for joining our mission. We&apos;ll be in touch within 3–5 business days.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name + Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                      <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
                        Full Name
                      </label>
                      <input
                        {...register("name")}
                        placeholder="Kwame Mensah"
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 transition ${
                          errors.name
                            ? "border-red-300 focus:ring-red-200"
                            : "border-gray-200 focus:ring-purple-400/40 focus:border-purple-400"
                        }`}
                      />
                      {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
                    </div>
                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                      <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
                        Email Address
                      </label>
                      <input
                        {...register("email")}
                        placeholder="kwame@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 transition ${
                          errors.email
                            ? "border-red-300 focus:ring-red-200"
                            : "border-gray-200 focus:ring-purple-400/40 focus:border-purple-400"
                        }`}
                      />
                      {errors.email && <p className="text-[11px] text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
                      Primary Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                            selectedSkills.includes(skill)
                              ? "bg-purple-600 border-purple-600 text-white"
                              : "border-gray-200 text-gray-500 hover:border-purple-300"
                          }`}>
                          {skill}
                        </button>
                      ))}
                    </div>
                    {errors.skills && <p className="text-[11px] text-red-500">{errors.skills.message}</p>}
                  </div>

                  {/* Availability */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
                      Availability
                    </label>
                    <select
                      {...register("availability")}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-50 border text-sm text-gray-700 focus:outline-none focus:ring-2 transition appearance-none ${
                        errors.availability
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-200 focus:ring-purple-400/40 focus:border-purple-400"
                      }`}>
                      <option value="">Select availability...</option>
                      {availability.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                    {errors.availability && <p className="text-[11px] text-red-500">{errors.availability.message}</p>}
                  </div>

                  {/* Motivation */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
                      Why VheeWorld?
                    </label>
                    <textarea
                      {...register("motivation")}
                      rows={4}
                      placeholder="Tell us what draws you to our community..."
                      className={`w-full px-4 py-3 rounded-xl bg-gray-50 border text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 transition resize-none ${
                        errors.motivation
                          ? "border-red-300 focus:ring-red-200"
                          : "border-gray-200 focus:ring-purple-400/40 focus:border-purple-400"
                      }`}
                    />
                    {errors.motivation && <p className="text-[11px] text-red-500">{errors.motivation.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase text-white flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70 transition-all"
                    style={{ background: "linear-gradient(90deg, #3b0fa0, #5b21b6)" }}>
                    {submitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="w-full py-24 px-8 md:px-16 bg-[#eef0f8]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6">
            <div className="text-5xl font-serif text-purple-400 leading-none">"</div>
            <p className="text-xl md:text-2xl font-black text-gray-900 leading-snug italic">
              VheeWorld doesn&apos;t just ask what you can do; they ask who you want to become through service. The
              people I met in Kumasi changed my life more than I changed theirs.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-sm font-black text-purple-700">
                SJ
              </div>
              <div>
                <p className="text-sm font-black text-gray-900">Sarah Jenkins</p>
                <p className="text-xs text-gray-400 tracking-wide">Global Mentor, Class of 2023</p>
              </div>
            </div>
          </motion.div>

          {/* Image placeholder */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full aspect-[4/3] rounded-2xl bg-gray-200 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300" />
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="w-full py-24 px-8 md:px-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12 space-y-2">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}>
                <FaqItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
