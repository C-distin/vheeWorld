import { IconBell } from "@tabler/icons-react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth/auth"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  const { name, email, role } = session.user

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role={role as "admin" | "user"} user={{ name, email }} />

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* ── Topbar ── */}
          <header className="flex items-center gap-3 h-14 px-4 border-b bg-[#080d1f] flex-shrink-0">
            <SidebarTrigger className="h-7 w-7 text-white/60 hover:text-white transition-colors" />
            <Separator orientation="vertical" className="h-4 bg-white/10" />

            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/dashboard"
                    className="text-xs text-white/40 hover:text-white transition-colors">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/20" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs text-white/70 font-medium capitalize">{role}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex-1" />

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <button className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors">
                <IconBell size={17} className="text-white/60" />
                {/* Unread dot */}
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400" />
              </button>

              <Separator orientation="vertical" className="h-4 bg-white/10" />

              {/* User chip */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-[11px] font-black text-white flex-shrink-0">
                  {name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-white leading-none">{name}</p>
                  <p className="text-[10px] text-white/35 mt-0.5 leading-none capitalize">{role}</p>
                </div>
              </div>
            </div>
          </header>

          {/* ── Page content ── */}
          <main className="flex-1 overflow-y-auto p-6 bg-[#f7f7fb]">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
