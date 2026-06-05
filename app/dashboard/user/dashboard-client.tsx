"use client"

import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconArticle,
  IconBuildingCommunity,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconCurrencyDollar,
  IconExternalLink,
  IconLayoutGrid,
  IconNotes,
  IconRepeat,
  IconSettings,
  IconTrendingUp,
} from "@tabler/icons-react"
import { motion } from "motion/react"
import Link from "next/link"

// ── Types ──────────────────────────────────────────────────────────────────────

interface DashboardProps {
  user: { name: string; email: string }
  data: {
    posts: { published: number; drafts: number; archived: number; total: number }
    projects: { published: number; drafts: number; total: number }
    donations: {
      totalRevenue: number
      totalDonors: number
      thisMonthRevenue: number
      lastMonthRevenue: number
      revenueGrowth: number | null
    }
    recentDonations: {
      id: number
      name: string
      email: string
      amount: number
      currency: string
      frequency: string
      status: string
      reference: string
      createdAt: Date
    }[]
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatGHS(pesewas: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(pesewas / 100)
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function getGreeting(name: string) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
  const firstName = name.split(" ")[0]
  return `${greeting}, ${firstName}.`
}

// ── Stat Card ──────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  href,
  delay = 0,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  accent: string
  href: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      <Link
        href={href}
        className="group block bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400">{label}</p>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
            <Icon size={16} strokeWidth={2} />
          </div>
        </div>
        <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
        <div className="flex items-center gap-1 mt-4 text-[11px] font-bold text-gray-300 group-hover:text-gray-500 transition-colors">
          <span>View all</span>
          <IconExternalLink size={11} />
        </div>
      </Link>
    </motion.div>
  )
}

// ── Status Pill ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  success: {
    label: "Success",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  failed: { label: "Failed", pill: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-500" },
  pending: { label: "Pending", pill: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400" },
} as const

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
  if (!cfg) return <span className="text-xs text-gray-400">{status}</span>
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ── Quick Link ─────────────────────────────────────────────────────────────────

function QuickLink({
  href,
  icon: Icon,
  label,
  desc,
  accent,
  delay,
}: {
  href: string
  icon: React.ElementType
  label: string
  desc: string
  accent: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      <Link
        href={href}
        className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-sm hover:border-gray-200 transition-all duration-200">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{label}</p>
          <p className="text-xs text-gray-400 truncate">{desc}</p>
        </div>
        <IconArrowUpRight
          size={15}
          className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
        />
      </Link>
    </motion.div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function DashboardClient({ user, data }: DashboardProps) {
  const { posts, projects, donations, recentDonations } = data

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">{getGreeting(user.name)}</h1>
        <p className="text-sm text-gray-400 mt-0.5">Here's what's happening with VheeWorld Foundation today.</p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={formatGHS(donations.totalRevenue)}
          sub={`${donations.totalDonors} donors all time`}
          icon={IconCurrencyDollar}
          accent="bg-emerald-50 text-emerald-600"
          href="/dashboard/user/donations"
          delay={0}
        />
        <StatCard
          label="This Month"
          value={formatGHS(donations.thisMonthRevenue)}
          sub={
            donations.revenueGrowth === null
              ? "No prior month data"
              : donations.revenueGrowth >= 0
                ? `↑ ${donations.revenueGrowth}% vs last month`
                : `↓ ${Math.abs(donations.revenueGrowth)}% vs last month`
          }
          icon={IconTrendingUp}
          accent="bg-blue-50 text-blue-600"
          href="/dashboard/user/donations"
          delay={0.05}
        />
        <StatCard
          label="Blog Posts"
          value={posts.total}
          sub={`${posts.published} published · ${posts.drafts} drafts`}
          icon={IconArticle}
          accent="bg-violet-50 text-violet-600"
          href="/dashboard/user/blog"
          delay={0.1}
        />
        <StatCard
          label="Projects"
          value={projects.total}
          sub={`${projects.published} published · ${projects.drafts} drafts`}
          icon={IconLayoutGrid}
          accent="bg-orange-50 text-orange-500"
          href="/dashboard/user/projects"
          delay={0.15}
        />
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Recent Donations ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-gray-900">Recent Donations</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Latest payment activity</p>
            </div>
            <Link
              href="/dashboard/user/donations"
              className="flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:text-purple-700 transition">
              View all
              <IconExternalLink size={11} />
            </Link>
          </div>

          {recentDonations.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-bold text-gray-300">No donations yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentDonations.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/60 transition-colors">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-purple-600">{d.name.charAt(0).toUpperCase()}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{d.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{d.email}</p>
                  </div>

                  {/* Frequency badge */}
                  {d.frequency === "monthly" && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                      <IconRepeat size={9} />
                      Monthly
                    </span>
                  )}

                  {/* Status */}
                  <StatusPill status={d.status} />

                  {/* Amount + time */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-black text-gray-900">{formatGHS(d.amount)}</p>
                    <p className="text-[10px] text-gray-400">{timeAgo(d.createdAt)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Right column ── */}
        <div className="space-y-6">
          {/* Content Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
            <h2 className="text-sm font-black text-gray-900 mb-4">Content Overview</h2>
            <div className="space-y-3">
              {[
                { label: "Published posts", value: posts.published, color: "bg-emerald-500", total: posts.total },
                { label: "Draft posts", value: posts.drafts, color: "bg-amber-400", total: posts.total },
                { label: "Published projects", value: projects.published, color: "bg-blue-500", total: projects.total },
                { label: "Draft projects", value: projects.drafts, color: "bg-gray-300", total: projects.total },
              ].map((item) => {
                const pct = item.total === 0 ? 0 : Math.round((item.value / item.total) * 100)
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-gray-500">{item.label}</span>
                      <span className="text-[11px] font-bold text-gray-700">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}>
            <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-3 px-1">Quick Actions</h2>
            <div className="space-y-2">
              <QuickLink
                href="/dashboard/user/blog"
                icon={IconNotes}
                label="Write a post"
                desc="Create or edit blog content"
                accent="bg-violet-50 text-violet-600"
                delay={0.32}
              />
              <QuickLink
                href="/dashboard/user/projects"
                icon={IconBuildingCommunity}
                label="Add a project"
                desc="Publish a new initiative"
                accent="bg-orange-50 text-orange-500"
                delay={0.36}
              />
              <QuickLink
                href="/dashboard/user/donations"
                icon={IconCurrencyDollar}
                label="View donations"
                desc="Monitor payment activity"
                accent="bg-emerald-50 text-emerald-600"
                delay={0.4}
              />
              <QuickLink
                href="/dashboard/user/settings"
                icon={IconSettings}
                label="Settings"
                desc="Manage your account"
                accent="bg-gray-100 text-gray-500"
                delay={0.44}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
