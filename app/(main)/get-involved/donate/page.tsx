"use client"

import { IconArrowNarrowRight, IconLoader2, IconX } from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { initiateDonation, verifyDonation } from "@/app/actions/donate"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const

const amounts = [
  { value: 2500, label: "₵25", desc: "Water access" },
  { value: 5000, label: "₵50", desc: "School supplies" },
  { value: 10000, label: "₵100", desc: "Livelihoods" },
  { value: 20000, label: "₵200", desc: "Full scholarship" },
  { value: 0, label: "Other", desc: "Custom" },
] as const

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
    icon: "🛡",
    pct: "10%",
    title: "Core Governance",
    desc: "Essential administrative oversight, financial auditing, and reporting to maintain our high transparency standards.",
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
] as const

export default function DonatePage() {
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time")
  const [selected, setSelected] = useState(5000)
  const [custom, setCustom] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "failed">("idle")
  const [reference, setReference] = useState<string | null>(null)
  const paystackTabRef = useRef<Window | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  // SSE: subscribe to real-time webhook events while waiting for payment
  useEffect(() => {
    if (!reference || status !== "pending") return

    const es = new EventSource(`/api/payments/stream?reference=${reference}`)
    eventSourceRef.current = es

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        // Ignore the initial connection handshake
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
            description: "Your payment was not completed. Please try again.",
          })
        }
      } catch {
        // Malformed SSE frame — ignore
      }
    }

    es.onerror = () => {
      // SSE connection dropped (tab was backgrounded, network hiccup, etc.)
      // Don't surface an error — the user may just be completing payment
      es.close()
    }

    return () => {
      es.close()
      eventSourceRef.current = null
    }
  }, [reference, status])

  // Fallback: if the user closes the Paystack tab manually and comes back,
  // verify the payment server-side so they're not stuck on "pending"
  useEffect(() => {
    if (status !== "pending" || !reference) return

    const checkOnFocus = async () => {
      // Only fire when the Paystack tab is known to be closed
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
      // If still pending (Paystack tab may still be open), do nothing
    }

    window.addEventListener("focus", checkOnFocus)
    return () => window.removeEventListener("focus", checkOnFocus)
  }, [status, reference])

  const handleAmountSelect = useCallback((value: number) => {
    setSelected(value)
    setCustom("")
  }, [])

  const getAmount = useCallback(() => {
    if (selected === 0) {
      return Math.round(parseFloat(custom || "0") * 100)
    }
    return selected
  }, [selected, custom])

  const handleSubmit = useCallback(async () => {
    const amount = getAmount()
    if (amount < 100) {
      toast.error("Invalid amount", { description: "Minimum donation is ₵1.00" })
      return
    }
    if (!email || !name) {
      toast.error("Missing details", { description: "Please fill in your name and email." })
      return
    }

    setLoading(true)

    const result = await initiateDonation({
      email,
      name,
      amount,
      frequency,
      phone: phone || undefined,
    })

    if (result.success && result.authorizationUrl) {
      setReference(result.reference!)
      setStatus("pending")
      const tab = window.open(result.authorizationUrl, "_blank", "noopener,noreferrer")
      paystackTabRef.current = tab
    } else {
      setStatus("failed")
      toast.error("Initialization failed", {
        description: result.error || "Something went wrong. Please try again.",
      })
    }

    setLoading(false)
  }, [email, name, frequency, phone, getAmount])

  const cancelPending = useCallback(() => {
    paystackTabRef.current?.close()
    eventSourceRef.current?.close()
    setStatus("idle")
    setReference(null)
  }, [])

  const resetForm = useCallback(() => {
    setStatus("idle")
    setReference(null)
    setSelected(5000)
    setCustom("")
  }, [])

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
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
            <AnimatePresence mode="wait">
              {/* ── Success state ── */}
              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                    <IconCheck size={40} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Thank You!</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                      Your donation has been received. A receipt has been sent to your email.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase text-purple-600 border border-purple-200 hover:bg-purple-50 transition">
                    Make Another Donation
                  </button>
                </motion.div>
              )}

              {/* ── Waiting state ── */}
              {status === "pending" && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mx-auto">
                    <IconLoader2 size={36} className="text-purple-500 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Waiting for Payment</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                      Complete your payment in the tab that just opened. This page will update automatically once
                      confirmed.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={() => paystackTabRef.current?.focus()}
                      className="px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase text-white bg-purple-600 hover:bg-purple-700 transition">
                      Open Payment Tab
                    </button>
                    <button
                      type="button"
                      onClick={cancelPending}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition">
                      <IconX size={12} />
                      Cancel and go back
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Form (idle + failed) ── */}
              {(status === "idle" || status === "failed") && (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Frequency toggle */}
                  <div className="mb-6">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">
                      Gift Frequency
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {(["one-time", "monthly"] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFrequency(f)}
                          className={`py-3 rounded-xl text-sm font-bold tracking-wide border transition duration-200 ${
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
                  <div className="mb-6">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">
                      Select Amount (GHS)
                    </p>
                    <div className="grid grid-cols-5 gap-3">
                      {amounts.map((a) => (
                        <button
                          key={a.value}
                          type="button"
                          onClick={() => handleAmountSelect(a.value)}
                          className={`py-3 px-2 rounded-xl text-sm font-bold border transition duration-200 flex flex-col items-center gap-0.5 ${
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

                    <AnimatePresence>
                      {selected === 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-3 overflow-hidden">
                          <input
                            type="number"
                            min="1"
                            step="0.01"
                            value={custom}
                            onChange={(e) => setCustom(e.target.value)}
                            placeholder="Enter custom amount (GHS)"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400 transition"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Donor info */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-1.5 block">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Kwame Mensah"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400 transition"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-1.5 block">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="kwame@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-1.5 block">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+233 20 933 4967"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase text-white flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-violet-700 hover:opacity-90 active:scale-[0.99] disabled:opacity-70 transition">
                    {loading ? (
                      <>
                        <IconLoader2 size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Donate {selected === 0 ? `₵${custom || "0"}` : amounts.find((a) => a.value === selected)?.label}
                        <IconArrowNarrowRight size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-4">
                    🔒 Secure payment via Paystack. Cancel anytime.
                  </p>
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
              Every cedi is optimized for community growth. Here is how we distribute our funds.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {breakdown.map((item, i) => (
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
