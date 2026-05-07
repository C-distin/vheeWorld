"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconAlertTriangle, IconLoader2, IconTrash } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/auth-client"

interface User {
  id: string
  name: string
  email: string
}

const schema = z.object({
  confirmation: z.string(),
  password: z.string().min(1, "Password is required"),
})

// Renamed type to avoid collision with Input component
type FormValues = z.infer<typeof schema>

export function DeleteAccountSection({ user }: { user: User }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const confirmation = watch("confirmation")
  const confirmationMatch = confirmation === user.email

  const onSubmit = async (data: FormValues) => {
    if (!confirmationMatch) return
    setIsDeleting(true)
    try {
      await authClient.deleteUser({ password: data.password })
      toast.success("Account deleted")
      router.push("/")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete account. Check your password.")
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-red-100 bg-red-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
              <IconAlertTriangle size={17} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-sm font-black text-red-700">Danger Zone</h2>
              <p className="text-xs text-red-400 mt-0.5">Irreversible and destructive actions</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-red-100 p-5 space-y-3">
            <div>
              <p className="text-sm font-black text-gray-900">Delete Account</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white">
              <IconTrash size={14} className="mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v)
          if (!v) reset()
        }}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-700">Delete your account?</AlertDialogTitle>
            {/*
              Replaced AlertDialogDescription with a div.
              1. Removed 'asChild' to fix type error.
              2. Avoids invalid HTML nesting (div/ul inside p tag).
            */}
            <div className="text-sm text-gray-500 space-y-1">
              <p>This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li>Your account and profile</li>
                <li>All session data</li>
                <li>Access to the dashboard</li>
              </ul>
              <p className="pt-1">
                This action <strong>cannot</strong> be undone.
              </p>
            </div>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            {/* Email confirmation */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
                Type <span className="font-mono text-gray-600">{user.email}</span> to confirm
              </Label>
              <Input
                {...register("confirmation")}
                placeholder={user.email}
                className={!confirmationMatch && confirmation ? "border-red-300" : ""}
                autoComplete="off"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">Your Password</Label>
              <Input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className={errors.password ? "border-red-300" : ""}
              />
              {errors.password && <p className="text-[11px] text-red-500">{errors.password.message}</p>}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => reset()}>Cancel</AlertDialogCancel>
              <Button
                type="submit"
                disabled={isDeleting || !confirmationMatch}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50">
                {isDeleting && <IconLoader2 size={14} className="animate-spin mr-2" />}
                Delete Account
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
