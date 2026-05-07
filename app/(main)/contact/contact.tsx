"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  IconArrowNarrowRight,
  IconChevronDown,
  IconCircleCheck,
  IconExternalLink,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// ── Schema ──────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(120, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
})

type ContactFormData = z.infer<typeof contactSchema>

// ── Data ─────────────────────────────────────────────────
const faqs = [
  {
    question: "How do I verify the impact of my donation?",
    answer:
      "We publish regular transparency reports detailing exactly how funds are used. Every donor receives updates on the specific programs their contributions supported, including stories from the communities we serve.",
  },
  {
    question: "Can I volunteer remotely?",
    answer:
      "Yes. We have remote volunteering opportunities in areas such as digital content creation, fundraising support, graphic design, and administrative assistance. Reach out via the contact form to learn more.",
  },
  {
    question: "Where exactly do you operate in Ghana?",
    answer:
      "VheeWorld Foundation is headquartered in Accra and currently serves communities across the Greater Accra Region, with outreach programs extending to other regions during our annual charity projects.",
  },
  {
    question: "How can I organise a fundraiser for VheeWorld?",
    answer:
      "We love community-led fundraisers! Get in touch with us via email at vheeworld@gmail.com or through the contact form and our team will guide you through the process.",
  },
  {
    question: "Is VheeWorld Foundation a registered NGO?",
    answer:
      "Yes. VheeWorld Foundation is a fully registered non-governmental organisation in Ghana, founded in 2015 by Miss Violet Lawson.",
  },
] as const

const contactInfo = [
  { icon: IconMapPin, title: "Accra Office", lines: ["Accra, Ghana"] },
  { icon: IconPhone, title: "Phone Support", lines: ["+233 20 933 4967"] },
  { icon: IconMail, title: "Email Inquiries", lines: ["vheeworld@gmail.com"] },
] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
} as const

const fadeUpSmall = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
} as const

// ── Spinner (CSS-driven, zero SVG overhead) ──────────────
function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin ${className}`}
    />
  )
}

// ── Field component ──────────────────────────────────────
function Field({
  label,
  error,
  children,
  id,
}: {
  label: string
  error?: string
  children: React.ReactNode
  id: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
        {label}
      </label>
      {children}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key={error}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] text-red-500 font-medium">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Input class helper ───────────────────────────────────
const inputBase =
  "w-full px-4 py-3 rounded-lg bg-gray-50 border text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 transition"

function inputClass(hasError: boolean) {
  return hasError
    ? `${inputBase} border-red-300 focus:ring-red-200 focus:border-red-400`
    : `${inputBase} border-gray-200 focus:ring-purple-400/40 focus:border-purple-400`
}

// ── FAQ accordion item ───────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer">
        <p className="text-sm font-semibold text-gray-900 pr-4">{question}</p>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
          <IconChevronDown size={18} className="text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}>
            <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      setSubmitting(true)
      // Replace with your actual submission logic (API route, emailjs, etc.)
      await new Promise((res) => setTimeout(res, 1200))
      console.log("Form submitted:", data)
      setSubmitting(false)
      setSubmitted(true)
      reset()
    },
    [reset]
  )

  return (
    <main className="min-h-screen w-full bg-[#f7f7fb]">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-[#1a0533]">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full opacity-[0.15] pointer-events-none"
          style={{ background: "radial-gradient(circle, #6d28d9 0%, transparent 70%)" }}
        />

        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 pt-40 pb-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
            }}
            className="space-y-5 max-w-xl">
            <motion.div variants={fadeUpSmall} className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-yellow-400/80">Get in Touch</p>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
              Let&apos;s Work <br />
              <span className="italic text-purple-300">Together</span>
            </motion.h1>

            <motion.p variants={fadeUpSmall} className="text-base text-white/50 leading-relaxed max-w-md">
              Whether you&apos;re interested in volunteering, becoming a donor, or simply sharing a story from the
              communities we serve — our door is always open.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.7 }}
              className="origin-left h-px w-32 bg-linear-to-r from-yellow-400 to-transparent"
            />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-linear-to-b from-transparent to-[#f7f7fb]" />
      </section>

      {/* ── Form + Info ── */}
      <section className="w-full px-8 md:px-16 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center text-center py-16 gap-5">
                  <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
                    <IconCircleCheck size={36} className="text-purple-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-gray-900">Message Sent!</h3>
                    <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                      Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold tracking-widest uppercase text-purple-500 hover:text-purple-700 transition">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  aria-busy={submitting}
                  className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <Field id="name" label="Full Name" error={errors.name?.message}>
                        <input
                          id="name"
                          {...register("name")}
                          placeholder="Ama Mensah"
                          aria-invalid={!!errors.name}
                          className={inputClass(!!errors.name)}
                        />
                      </Field>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Field id="email" label="Email Address" error={errors.email?.message}>
                        <input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="ama@example.com"
                          aria-invalid={!!errors.email}
                          className={inputClass(!!errors.email)}
                        />
                      </Field>
                    </div>
                  </div>

                  <Field id="subject" label="Subject" error={errors.subject?.message}>
                    <input
                      id="subject"
                      {...register("subject")}
                      placeholder="How can we help?"
                      aria-invalid={!!errors.subject}
                      className={inputClass(!!errors.subject)}
                    />
                  </Field>

                  <Field id="message" label="Your Message" error={errors.message?.message}>
                    <textarea
                      id="message"
                      {...register("message")}
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      aria-invalid={!!errors.message}
                      className={`${inputClass(!!errors.message)} resize-none`}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-widest uppercase text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100 transition shadow-lg shadow-purple-200 bg-linear-to-r from-violet-600 to-violet-700">
                    {submitting ? (
                      <>
                        <Spinner />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <IconArrowNarrowRight size={16} className="group-hover:translate-x-1 transition" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info + Map */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6">
            <h2 className="text-xl font-black text-gray-900">Our Headquarters</h2>

            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Icon size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{title}</p>
                    {lines.map((l) => (
                      <p key={l} className="text-sm text-gray-500">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254908.08923896876!2d-0.2661!3d5.5913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8b89f4943!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1700000000000"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="VheeWorld Accra Location"
              />
              <Link
                href="https://maps.google.com/?q=Accra,Ghana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-5 py-3 bg-white hover:bg-gray-50 transition">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-500">View on Google Maps</span>
                <IconExternalLink size={13} className="text-gray-400" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="w-full py-24 px-8 md:px-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Quick answers to common inquiries about our mission and operations.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05 }}>
                <FaqItem question={faq.question} answer={faq.answer} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
