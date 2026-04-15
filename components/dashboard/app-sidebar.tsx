"use client"

import { IconLogout } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/auth-client"
import { adminNav, userNav } from "@/lib/nav"
import { dancingScript, platypi } from "../fonts"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar"

interface AppSidebarProps {
  role: "admin" | "user"
  user: { name: string; email: string }
}

export function AppSidebar({ role, user }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const nav = role === "admin" ? adminNav : userNav

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/sign-in")
  }

  return (
    <Sidebar>
      {/* ── Header ── */}
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4 space-y-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://2qh3exphzw.ufs.sh/f/2ZIw3S0QKedpwvVGtabI0aCoDfLcHhZi8y5Tg1Yues2EO3d7"
            alt="VheeWorld"
            width={36}
            height={36}
          />
          <div className="text-lg font-semibold">
            <span className={`text-blue-500 ${platypi.className}`}>Vhee</span>
            <span className={`text-purple-500 ${dancingScript.className}`}>World</span>
          </div>
        </Link>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
            role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
          }`}>
          {role === "admin" ? "Admin Panel" : "My Account"}
        </span>
      </SidebarHeader>

      {/* ── Nav ── */}
      <SidebarContent>
        {nav.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active =
                    pathname === item.href ||
                    (item.href !== "/dashboard/admin" &&
                      item.href !== "/dashboard/user" &&
                      pathname.startsWith(item.href))

                  return (
                    <SidebarMenuItem key={item.label}>
                      <Link href={item.href} className="w-full">
                        <SidebarMenuButton isActive={active} tooltip={item.label}>
                          <Icon size={17} />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="border-t border-sidebar-border p-4 space-y-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-black text-purple-700 flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">{user.email}</p>
          </div>
        </div>

        <SidebarMenuButton
          onClick={handleSignOut}
          className="w-full text-sidebar-foreground/60 hover:text-sidebar-foreground"
          tooltip="Sign Out">
          <IconLogout size={15} />
          <span>Sign Out</span>
        </SidebarMenuButton>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
