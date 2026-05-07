"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconLoader2, IconUser } from "@tabler/icons-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/auth-client"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
})

// Renamed type to avoid collision with Input component
type FormValues = z.infer<typeof schema>

interface User {
  id: string
  name: string
  email: string
  username: string
}

export function UpdateUsernameForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name, username: user.username },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      // better-auth allows updating username via updateUser when the plugin is active
      await authClient.updateUser({
        name: data.name,
        username: data.username,
      })
      toast.success("Profile updated")
    } catch (error) {
      console.error(error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <IconUser size={17} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-sm font-black text-gray-900">Profile</h2>
            <p className="text-xs text-gray-400 mt-0.5">Update your display name and username</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Email — read only */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Email Address</Label>
          <Input value={user.email} disabled className="bg-gray-50 text-gray-400 cursor-not-allowed" />
          <p className="text-[11px] text-gray-400">Email cannot be changed</p>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Display Name</Label>
          <Input {...register("name")} placeholder="Your full name" className={errors.name ? "border-red-300" : ""} />
          {errors.name && <p className="text-[11px] text-red-500">{errors.name.message}</p>}
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Username</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 font-mono">@</span>
            <Input
              {...register("username")}
              placeholder="yourhandle"
              className={`font-mono ${errors.username ? "border-red-300" : ""}`}
            />
          </div>
          {errors.username && <p className="text-[11px] text-red-500">{errors.username.message}</p>}
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
            {isLoading && <IconLoader2 size={15} className="animate-spin mr-2" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
