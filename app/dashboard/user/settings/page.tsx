import { headers } from "next/headers"
import { auth } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import { SettingsPageClient } from "./settings-page-client"

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  return (
    <SettingsPageClient
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        username: (session.user as any).username ?? "",
      }}
    />
  )
}
