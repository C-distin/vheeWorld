"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconMail, IconLock, IconEye, IconEyeOff } from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"
import { signInSchema, type SignInInput } from "@/lib/validation/auth"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { signInAction } from "@/app/actions/auth"
import { toast } from "sonner"
import { dancingScript, platypi } from "@/components/fonts"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true)
    try {
      const { success, error } = await signInAction(data)
      if (success) {
        toast.success("Successfully signed in.")
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
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* ── Left panel: branding ── */}
      <div className="relative hidden lg:flex flex-col justify-between bg-[#1a0533] overflow-hidden p-12">
        {/* Atmospheric glows */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6d28d9 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/logo.png" alt="VheeWorld" width={44} height={44} priority />
          <div className="text-xl font-semibold">
            <span className={`text-blue-400 tracking-tight ${platypi.className}`}>Vhee</span>
            <span className={`text-purple-400 tracking-tight ${dancingScript.className}`}>World</span>
          </div>
        </div>

        {/* Center quote */}
        <div className="relative z-10 space-y-6">
          <div className="text-5xl font-serif text-purple-300/30 leading-none select-none">"</div>
          <p className="text-2xl font-black text-white leading-snug max-w-sm">Streetism should not be an option.</p>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs">
            Sign in to manage your contributions, track impact, and stay connected with our mission.
          </p>
        </div>

        {/* Bottom tag */}
        {/* <div className="relative z-10"> */}
        {/*   <p className="text-xs text-white/20 tracking-widest uppercase"> */}
        {/*     © {new Date().getFullYear()} VheeWorld Foundation */}
        {/*   </p> */}
        {/* </div> */}
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex items-center justify-center px-6 py-16 bg-[#f7f7fb]">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-2">
            <Image src="/logo.png" alt="VheeWorld" width={36} height={36} priority />
            <div className="text-lg font-semibold">
              <span className={`text-blue-500 tracking-tight ${platypi.className}`}>Vhee</span>
              <span className={`text-purple-500 tracking-tight ${dancingScript.className}`}>World</span>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-gray-400">Sign in to your account to continue.</p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Email Address</label>
                <InputGroup>
                  <InputGroupAddon>
                    <IconMail size={16} stroke={1.5} className="text-gray-400" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="email"
                    placeholder="name@example.com"
                    {...register("email")}
                    className={errors.email ? "border-red-300 focus-visible:ring-red-200" : ""}
                  />
                </InputGroup>
                {errors.email && <p className="text-[11px] font-medium text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-purple-500 hover:text-purple-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>
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
                {errors.password && <p className="text-[11px] font-medium text-red-500">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase text-white flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-2"
                style={{ background: "linear-gradient(90deg, #7c3aed, #6d28d9)" }}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
