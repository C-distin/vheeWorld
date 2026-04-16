"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { IconUser, IconLock, IconTrash } from "@tabler/icons-react"
import { UpdateUsernameForm } from "./update-username-form"
import { ChangePasswordForm } from "./change-password-form"
import { DeleteAccountSection } from "./delete-account-section"

interface User {
  id: string
  name: string
  email: string
  username: string
}

const tabs = [
  { id: "username", label: "Username", icon: IconUser },
  { id: "password", label: "Password", icon: IconLock },
  { id: "danger", label: "Danger Zone", icon: IconTrash },
]

export function SettingsPageClient({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("username")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your account preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        {/* ── Vertical tabs ── */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {tabs.map((tab, i) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-colors text-left",
                    i !== tabs.length - 1 && "border-b border-gray-100",
                    active
                      ? tab.id === "danger"
                        ? "bg-red-50 text-red-600"
                        : "bg-purple-50 text-purple-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(
                      active
                        ? tab.id === "danger" ? "text-red-500" : "text-purple-600"
                        : "text-gray-400"
                    )}
                  />
                  {tab.label}
                  {active && (
                    <div className={cn(
                      "ml-auto w-1 h-5 rounded-full",
                      tab.id === "danger" ? "bg-red-400" : "bg-purple-500"
                    )} />
                  )}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* ── Panel ── */}
        <div className="flex-1 min-w-0">
          {activeTab === "username" && <UpdateUsernameForm user={user} />}
          {activeTab === "password" && <ChangePasswordForm />}
          {activeTab === "danger" && <DeleteAccountSection user={user} />}
        </div>
      </div>
    </div>
  )
}
