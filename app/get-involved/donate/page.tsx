"use client"

import {
  IconArrowNarrowRight,
  IconCreditCard,
  IconFileText,
  IconReceipt,
  IconShield,
  IconStar,
  IconThumbUp,
} from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"

const amounts = [
  { value: 25, label: "$25", desc: "Water access" },
  { value: 50, label: "$50", desc: "School supplies" },
  { value: 100, label: "$100", desc: "Livelihoods" },
  { value: 0, label: "Other", desc: "" },
]

const breakdown = [
  {
    icon: "🎓",
    pct: "75%",
    title: "Program Delivery",
    desc: "Direct funding for educational scholarships, vocational training, and clean water infrastructure projects.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: "👥",
    pct: "15%",
    title: "Community Support",
    desc: "Dedicated logistics and local community leadership stipends to ensure project sustainability and dignity.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: "🛡️",
    pct: "10%",
    title: "Core Governance",
    desc: "Essential administrative oversight, financial auditing, and reporting to maintain our high transparency standards.",
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
]

const badges = [
  { icon: IconShield, label: "SSL Secured" },
  { icon: IconCreditCard, label: "PCI Compliant" },
  { icon: IconThumbUp, label: "Charity Watch" },
  { icon: IconStar, label: "GuideStar Gold" },
]

const steps = ["Choose Gift", "Details", "Payment"]

export default function DonatePage() {
  const [frequency, setFrequency] = useState<"monthly" | "one-time">("monthly")
  const [selected, setSelected] = useState(50)
  const [custom, setCustom] = useState("")
  const [step, _setStep] = useState(0)

  return (
    <main className="min-h-screen w-full bg-white">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-[#f7f7fb] pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
            }}
            initial="hidden"
            animate="visible"
            className="space-y-6">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              className="flex items-center gap-3">
              <span className="h-px w-8 bg-purple-400" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-500">Our Shared Mission</span>
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.05]">
              Invest in a <br />
              Future of <br />
              <span className="text-purple-600">Dignity</span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Your contribution directly funds community-led initiatives in Ghana, fostering long-term resilience and
              narrative sovereignty.
            </motion.p>

            {/* Donor avatars */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
              className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                    {["A", "K", "M"][i]}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Joined by <span className="font-bold text-gray-700">12,400+</span> global donors
              </p>
            </motion.div>
          </motion.div>

          {/* Right: image placeholder */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            initial="hidden"
            animate="visible"
            className="w-full aspect-[4/3] rounded-2xl bg-gray-200 overflow-hidden relative shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── Donation Form ── */}
      <section className="w-full py-20 px-8 md:px-16 bg-[#eef0f8]">
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
            {/* Step indicator */}
            <div className="flex items-center gap-0 mb-8">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-start gap-1 flex-1">
                    <div
                      className={`h-0.5 w-full rounded-full transition-colors duration-300 ${
                        i <= step ? "bg-purple-600" : "bg-gray-200"
                      }`}
                    />
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase ${
                        i === step ? "text-purple-600" : "text-gray-300"
                      }`}>
                      Step {i + 1}: {s}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Frequency toggle */}
            <div className="mb-6">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Gift Frequency</p>
              <div className="grid grid-cols-2 gap-3">
                {(["monthly", "one-time"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`py-3 rounded-xl text-sm font-bold tracking-wide border transition-all duration-200 ${
                      frequency === f
                        ? "border-purple-600 text-purple-600 bg-purple-50"
                        : "border-gray-200 text-gray-400 hover:border-gray-300"
                    }`}>
                    {f === "monthly" ? "Monthly" : "One-time"}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount selection */}
            <div className="mb-8">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Select Amount (USD)</p>
              <div className="grid grid-cols-4 gap-3">
                {amounts.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => {
                      setSelected(a.value)
                      setCustom("")
                    }}
                    className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all duration-200 flex flex-col items-center gap-0.5 ${
                      selected === a.value
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-gray-200 text-gray-700 hover:border-purple-300"
                    }`}>
                    <span>{a.label}</span>
                    {a.desc && (
                      <span
                        className={`text-[9px] font-medium ${selected === a.value ? "text-purple-200" : "text-gray-400"}`}>
                        {a.desc}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom amount input */}
              <AnimatePresence>
                {selected === 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3">
                    <input
                      type="number"
                      value={custom}
                      onChange={(e) => setCustom(e.target.value)}
                      placeholder="Enter custom amount (USD)"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400 transition"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Next step button */}
            <button
              className="w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase text-white flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] transition-all"
              style={{ background: "linear-gradient(90deg, #3b0fa0, #5b21b6)" }}>
              Next Step <IconArrowNarrowRight size={16} />
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">🔒 Secure, encrypted payment. Cancel anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Impact Transparency ── */}
      <section className="w-full py-24 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Direct Impact Transparency</h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              Every dollar is optimized for community growth. Here is how we distribute our funds based on annual
              programmatic needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {breakdown.map((item, i) => (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-gray-50 border border-gray-100 p-8 space-y-4">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center text-xl`}>
                  {item.icon}
                </div>
                <div>
                  <p className={`text-4xl font-black ${item.color}`}>{item.pct}</p>
                  <p className="text-sm font-black text-gray-900 mt-1">{item.title}</p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Financial Integrity ── */}
      <section className="w-full py-16 px-8 md:px-16 bg-[#1a0533]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 max-w-md">
            <h3 className="text-2xl font-black text-white">Financial Integrity First</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              We are committed to the highest standards of accountability. Our financial records are audited annually by
              independent third parties.
            </p>
            <div className="flex items-center gap-6 pt-2">
              <Link
                href="#"
                className="flex items-center gap-2 text-xs font-bold text-purple-300 hover:text-white transition-colors">
                <IconFileText size={14} /> 2023 Annual Report
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 text-xs font-bold text-purple-300 hover:text-white transition-colors">
                <IconReceipt size={14} /> Tax Exempt Status
              </Link>
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
            className="grid grid-cols-2 gap-4">
            {badges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-6 py-4">
                <Icon size={22} className="text-purple-300" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="w-full py-28 px-8 md:px-16 bg-white">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-8">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            className="text-6xl font-serif text-purple-200 leading-none select-none">
            "
          </motion.div>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            className="text-2xl md:text-3xl font-black text-gray-900 leading-snug italic">
            Donating to VheeWorld didn&apos;t feel like a transaction; it felt like joining a conversation. Their
            commitment to community dignity over mere survival is why I&apos;ve been a monthly donor for three years.
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center font-black text-purple-600">
              V
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">A Loyal Donor</p>
              <p className="text-xs tracking-widest uppercase text-gray-400 mt-0.5">Monthly Supporter</p>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
