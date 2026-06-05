"use client"

import {
  IconArrowNarrowRight,
  IconCheck,
  IconCreditCard,
  IconLoader2,
  IconRefresh,
  IconShieldCheck,
  IconX,
} from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { initiateDonation, verifyDonation } from "@/app/actions/donate"

// ── Constants ──────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const

const AMOUNTS = [
  { value: 2500, label: "₵25", desc: "Water access" },
  { value: 5000, label: "₵50", desc: "School supplies" },
  { value: 10000, label: "₵100", desc: "Livelihoods" },
  { value: 20000, label: "₵200", desc: "Full scholarship" },
  { value: 0, label: "Custom", desc: "Your choice" },
] as const

const BREAKDOWN = [
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
    icon: "🛡",
    pct: "10%",
    title: "Core Governance",
    desc: "Essential administrative oversight, financial auditing, and reporting to maintain our high transparency standards.",
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
] as const

// ── Input component ────────────────────────────────────────────────────────────

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-1.5">
        {label}
        {optional && <span className="text-gray-300 normal-case tracking-normal font-medium">(optional)</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400 transition"

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function DonatePage() {
  // Form state
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time")
  const [selected, setSelected] = useState(5000)
  const [custom, setCustom] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Flow state
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "failed">("idle")
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState<string | null>(null)

  const paystackTabRef = useRef<Window | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  // ── Derived ──────────────────────────────────────────────────────────────────

  const getAmount = useCallback(() => {
    if (selected === 0) return Math.round(parseFloat(custom || "0") * 100)
    return selected
  }, [selected, custom])

  const displayAmount =
    selected === 0
      ? custom
        ? `₵${parseFloat(custom).toFixed(2)}`
        : "₵0"
      : (AMOUNTS.find((a) => a.value === selected)?.label ?? "")

  // ── SSE — real-time webhook listener ─────────────────────────────────────────

  useEffect(() => {
    if (!reference || status !== "pending") return

    const es = new EventSource(`/api/payments/stream?reference=${reference}`)
    eventSourceRef.current = es

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.connected) return

        if (data.status === "success") {
          setStatus("success")
          paystackTabRef.current?.close()
          es.close()
          toast.success("Donation received!", {
            description: "A receipt has been sent to your email.",
            duration: 6000,
          })
        } else if (data.status === "failed") {
          setStatus("failed")
          paystackTabRef.current?.close()
          es.close()
          toast.error("Payment not completed", {
            description: "Your payment did not go through. You can try again below.",
          })
        }
      } catch {
        // Malformed SSE frame — ignore
      }
    }

    es.onerror = () => es.close()

    return () => {
      es.close()
      eventSourceRef.current = null
    }
  }, [reference, status])

  // ── Fallback verify when Paystack tab closes ──────────────────────────────────

  useEffect(() => {
    if (status !== "pending" || !reference) return

    const onFocus = async () => {
      if (paystackTabRef.current && !paystackTabRef.current.closed) return

      const result = await verifyDonation(reference)
      if (result.success) {
        setStatus("success")
        toast.success("Donation received!", {
          description: "A receipt has been sent to your email.",
          duration: 6000,
        })
      } else if (result.error && result.error !== "Payment verification failed") {
        setStatus("failed")
        toast.error("Verification failed", { description: result.error })
      }
    }

    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [status, reference])

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    const amount = getAmount()
    if (amount < 100) {
      toast.error("Invalid amount", { description: "Minimum donation is ₵1.00" })
      return
    }
    if (!name.trim() || !email.trim()) {
      toast.error("Missing details", { description: "Please fill in your name and email." })
      return
    }

    setLoading(true)

    const result = await initiateDonation({
      email: email.trim(),
      name: name.trim(),
      amount,
      frequency,
      phone: phone.trim() || undefined,
    })

    setLoading(false)

    if (result.success && result.authorizationUrl) {
      setReference(result.reference!)
      setStatus("pending")
      // Open Paystack in a new tab — keeps this page alive so SSE stays connected
      paystackTabRef.current = window.open(result.authorizationUrl, "_blank", "noopener,noreferrer")
    } else {
      toast.error("Could not start payment", {
        description: result.error || "Something went wrong. Please try again.",
      })
    }
  }, [name, email, phone, frequency, getAmount])

  const handleRetry = useCallback(() => {
    eventSourceRef.current?.close()
    paystackTabRef.current?.close()
    setStatus("idle")
    setReference(null)
  }, [])

  const handleReset = useCallback(() => {
    setStatus("idle")
    setReference(null)
    setSelected(5000)
    setCustom("")
    setName("")
    setEmail("")
    setPhone("")
    setFrequency("one-time")
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen w-full bg-white">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-zinc-50 pt-32 pb-20 px-8 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
            className="space-y-6">
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <span className="h-px w-8 bg-purple-400" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-500">Our Shared Mission</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.05]">
              Invest in a <br />
              Future of <br />
              <span className="text-purple-600">Dignity</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Your contribution directly funds community-led initiatives in Ghana, fostering long-term resilience and
              narrative sovereignty.
            </motion.p>

            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "K", "M"].map((initial) => (
                  <div
                    key={initial}
                    className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                    {initial}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Joined by <span className="font-bold text-gray-700">12,400+</span> global donors
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="w-full aspect-[4/3] rounded-2xl bg-gray-200 overflow-hidden relative shadow-lg">
            <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-300" />
            <div className="absolute inset-0 bg-linear-to-t from-purple-900/20 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* ── Donation Form ── */}
      <section className="w-full py-20 px-8 md:px-16 bg-[#eef0f8]">
        <div className="max-w-xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* ─── SUCCESS ────────────────────────────────────────────── */}
              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="p-10 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto">
                    <IconCheck size={36} className="text-green-500" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Thank you!</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
                      Your donation has been confirmed. A receipt is on its way to your inbox.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase text-purple-600 border border-purple-200 hover:bg-purple-50 transition">
                    Donate again
                  </button>
                </motion.div>
              )}

              {/* ─── PENDING ────────────────────────────────────────────── */}
              {status === "pending" && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="p-10 text-center space-y-6">
                  {/* Animated ring */}
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconCreditCard size={24} className="text-purple-400" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Awaiting payment</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
                      Complete your payment in the Paystack tab that just opened. This page will update automatically.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 max-w-xs mx-auto">
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Payment steps</p>
                    {["Choose card, mobile money, or bank", "Enter your payment details", "Confirm & complete"].map(
                      (step, i) => (
                        <div key={step} className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-xs text-gray-600">{step}</span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => paystackTabRef.current?.focus()}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.98] transition">
                      <IconCreditCard size={14} />
                      Open payment tab
                    </button>
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition">
                      <IconX size={12} />
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ─── FAILED ─────────────────────────────────────────────── */}
              {status === "failed" && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="p-10 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
                    <IconX size={36} className="text-red-400" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Payment not completed</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
                      Your payment was not completed or was declined by Paystack. No charge was made.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase text-white bg-gray-900 hover:bg-gray-800 transition">
                    <IconRefresh size={14} />
                    Try again
                  </button>
                </motion.div>
              )}

              {/* ─── FORM ───────────────────────────────────────────────── */}
              {status === "idle" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}>
                  {/* Form header */}
                  <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                    <h2 className="text-lg font-black text-gray-900">Make a donation</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Processed securely via Paystack</p>
                  </div>

                  <div className="px-8 py-6 space-y-6">
                    {/* ── Frequency ── */}
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Frequency</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(["one-time", "monthly"] as const).map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setFrequency(f)}
                            className={`py-3 rounded-xl text-sm font-bold tracking-wide border transition-all duration-200 ${
                              frequency === f
                                ? "border-purple-600 text-purple-600 bg-purple-50 shadow-sm"
                                : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                            }`}>
                            {f === "one-time" ? "One-time" : "Monthly"}
                            {f === "monthly" && frequency === f && (
                              <span className="ml-1.5 text-[9px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded-full">
                                RECURRING
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                      {frequency === "monthly" && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[11px] text-purple-500 mt-2 font-medium">
                          Your card will be charged automatically each month. Cancel anytime.
                        </motion.p>
                      )}
                    </div>

                    {/* ── Amount ── */}
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">
                        Amount (GHS)
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {AMOUNTS.map((a) => (
                          <button
                            key={a.value}
                            type="button"
                            onClick={() => {
                              setSelected(a.value)
                              setCustom("")
                            }}
                            className={`py-3 px-1 rounded-xl text-sm font-bold border transition-all duration-200 flex flex-col items-center gap-0.5 ${
                              selected === a.value
                                ? "border-purple-600 bg-purple-600 text-white shadow-sm shadow-purple-200"
                                : "border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50/50"
                            }`}>
                            <span>{a.label}</span>
                            <span
                              className={`text-[9px] font-medium leading-tight text-center ${
                                selected === a.value ? "text-purple-200" : "text-gray-400"
                              }`}>
                              {a.desc}
                            </span>
                          </button>
                        ))}
                      </div>

                      <AnimatePresence>
                        {selected === 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="mt-2 overflow-hidden">
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                                ₵
                              </span>
                              <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={custom}
                                onChange={(e) => setCustom(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400 transition"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* ── Donor info ── */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Your details</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Full Name">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Kwame Mensah"
                            className={inputCls}
                          />
                        </Field>
                        <Field label="Email">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="kwame@example.com"
                            className={inputCls}
                          />
                        </Field>
                      </div>
                      <Field label="Phone" optional>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+233 20 000 0000"
                          className={inputCls}
                        />
                      </Field>
                    </div>

                    {/* ── Submit ── */}
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase text-white flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-violet-700 hover:opacity-90 active:scale-[0.99] disabled:opacity-60 transition-all shadow-md shadow-violet-200">
                      {loading ? (
                        <>
                          <IconLoader2 size={16} className="animate-spin" />
                          Opening Paystack…
                        </>
                      ) : (
                        <>
                          Donate {displayAmount}
                          <IconArrowNarrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Trust footer */}
                  <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <IconShieldCheck size={13} className="text-emerald-500" />
                      SSL encrypted
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <IconCreditCard size={13} className="text-blue-400" />
                      Card · Mobile Money · Bank
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <span className="text-emerald-500 font-bold text-[10px]">✓</span>
                      Powered by Paystack
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Impact Transparency ── */}
      <section className="w-full py-24 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Direct Impact Transparency</h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              Every cedi is optimized for community growth. Here's how we distribute our funds.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BREAKDOWN.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
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
    </main>
  )
}
