"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconUser, IconMail, IconLock, IconEye, IconEyeOff, IconAt } from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { signUpSchema, type SignUpInput } from "@/lib/validation/auth"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { signUpAction } from "@/app/actions/auth"
import { toast } from "sonner"
import { dancingScript, platypi } from "@/components/fonts"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true)
    try {
      const { success, error } = await signUpAction(data)
      if (success) {
        toast.success("Account created successfully!")
        reset()
      } else {
        toast.error(error)
      }
    } catch (error) {
      toast.error("Something went wrong.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* ── Right branding panel ── */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: 32 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
        }}
        initial="hidden"
        animate="visible"
        className="relative hidden lg:flex flex-col justify-center bg-[#1a0533] overflow-hidden p-12 order-last">
        {/* Animated orbs */}
        <motion.div
          variants={{
            animate: {
              scale: [1, 1.15, 1],
              x: [0, 20, 0],
              y: [0, -15, 0],
              transition: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            },
          }}
          animate="animate"
          className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
        />
        <motion.div
          variants={{
            animate: {
              scale: [1.1, 1, 1.1],
              x: [0, -15, 0],
              y: [0, 20, 0],
              transition: { duration: 13, repeat: Infinity, ease: "easeInOut" },
            },
          }}
          animate="animate"
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6d28d9 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Center content */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
          initial="hidden"
          animate="visible"
          className="relative z-10 space-y-6">
          {/* Steps */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="space-y-4">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-yellow-400/70">Getting started</p>
            {[
              { step: "01", label: "Create your account", desc: "Fill in your details to get started." },
              { step: "02", label: "Explore our mission", desc: "Discover how your support creates change." },
              { step: "03", label: "Make an impact", desc: "Donate, volunteer, or spread the word." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                  },
                }}
                className="flex items-start gap-4">
                <span className="text-xs font-black text-purple-400/40 mt-0.5 w-6 flex-shrink-0">{item.step}</span>
                <div>
                  <p className="text-sm font-black text-white">{item.label}</p>
                  <p className="text-xs text-white/35 mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Animated rule */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="origin-left h-px w-24"
            style={{ background: "linear-gradient(90deg, #facc15, transparent)" }}
          />

          {/* Quote */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="border-l-2 border-purple-400/30 pl-4">
            <p className="text-sm italic text-white/50 leading-relaxed">"Streetism should not be an option."</p>
            <p className="text-[10px] text-purple-400/50 mt-1 font-bold tracking-widest uppercase">
              — VheeWorld Foundation
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Left form panel ── */}
      <div className="flex items-center justify-center px-6 py-16 bg-[#f7f7fb]">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="flex lg:hidden items-center gap-3">
            <Image src="/logo.png" alt="VheeWorld" width={36} height={36} priority />
            <div className="text-lg font-semibold">
              <span className={`text-blue-500 tracking-tight ${platypi.className}`}>Vhee</span>
              <span className={`text-purple-500 tracking-tight ${dancingScript.className}`}>World</span>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create an account</h1>
            <p className="text-sm text-gray-400">Join our mission. Fill in your details below.</p>
          </motion.div>

          {/* Form card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name + Username row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                    },
                  }}
                  className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Full Name</label>
                  <InputGroup>
                    <InputGroupAddon>
                      <IconUser size={16} stroke={1.5} className="text-gray-400" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="text"
                      placeholder="Ama Mensah"
                      {...register("name")}
                      className={errors.name ? "border-red-300 focus-visible:ring-red-200" : ""}
                    />
                  </InputGroup>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] font-medium text-red-500">
                      {errors.name.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Username */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                    },
                  }}
                  className="col-span-2 sm:col-span-1 space-y-1.5">
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Username</label>
                  <InputGroup>
                    <InputGroupAddon>
                      <IconAt size={16} stroke={1.5} className="text-gray-400" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="text"
                      placeholder="amensah99"
                      {...register("username")}
                      className={errors.username ? "border-red-300 focus-visible:ring-red-200" : ""}
                    />
                  </InputGroup>
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] font-medium text-red-500">
                      {errors.username.message}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Email */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                  },
                }}
                className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Email Address</label>
                <InputGroup>
                  <InputGroupAddon>
                    <IconMail size={16} stroke={1.5} className="text-gray-400" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="email"
                    placeholder="ama@example.com"
                    {...register("email")}
                    className={errors.email ? "border-red-300 focus-visible:ring-red-200" : ""}
                  />
                </InputGroup>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] font-medium text-red-500">
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                  },
                }}
                className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Password</label>
                <InputGroup>
                  <InputGroupAddon>
                    <IconLock size={16} stroke={1.5} className="text-gray-400" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={errors.password ? "border-red-300 focus-visible:ring-red-200" : ""}
                  />
                  <InputGroupAddon position="right">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <IconEyeOff size={16} stroke={1.5} /> : <IconEye size={16} stroke={1.5} />}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] font-medium text-red-500">
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Terms note */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                  },
                }}
                className="text-[11px] text-gray-400 leading-relaxed">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="font-semibold text-purple-500 hover:text-purple-700 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-purple-500 hover:text-purple-700 transition-colors">
                  Privacy Policy
                </Link>
                .
              </motion.p>

              {/* Submit */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                  },
                }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase text-white flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 transition-all"
                  style={{ background: "linear-gradient(90deg, #7c3aed, #6d28d9)" }}>
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>

          {/* Footer */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
