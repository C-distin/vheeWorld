"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconEye, IconEyeOff, IconLoader2, IconLock } from "@tabler/icons-react"
import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/auth-client"

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof schema>

function PasswordField({
  label,
  error,
  ...props
}: {
  label: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">{label}</Label>
      <div className="relative">
        <Input
          {...props}
          type={show ? "text" : "password"}
          className={`pr-10 ${error ? "border-red-300" : ""} ${props.className ?? ""}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          {show ? <IconEyeOff size={15} /> : <IconEye size={15} />}
        </button>
      </div>
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  )
}

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      await authClient.changePassword({
        currentPassword: data.currentPassword, // FIX: Changed 'oldPassword' back to 'currentPassword'
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      })
      toast.success("Password changed successfully")
      reset()
    } catch (error) {
      console.error(error)
      toast.error("Failed to change password. Check your current password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <IconLock size={17} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-sm font-black text-gray-900">Change Password</h2>
            <p className="text-xs text-gray-400 mt-0.5">Update password and revoke all other sessions</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        <PasswordField
          label="Current Password"
          placeholder="••••••••"
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
        <PasswordField
          label="New Password"
          placeholder="••••••••"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <PasswordField
          label="Confirm New Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {/* Password rules hint */}
        <ul className="space-y-1">
          {["At least 8 characters", "At least one uppercase letter", "At least one number"].map((rule) => (
            <li key={rule} className="flex items-center gap-2 text-[11px] text-gray-400">
              <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
              {rule}
            </li>
          ))}
        </ul>

        <div className="pt-2">
          <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
            {isLoading && <IconLoader2 size={15} className="animate-spin mr-2" />}
            Change Password
          </Button>
        </div>
      </form>
    </div>
  )
}
