"use client"

import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconCurrencyDollar,
  IconDownload,
  IconRefresh,
  IconSearch,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useState, useTransition } from "react"
import type { DonationRow, DonationStats } from "@/app/actions/donations-admin"
import { getDonationStats, getDonations } from "@/app/actions/donations-admin"

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatGHS(pesewas: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(pesewas / 100)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

type StatusFilter = "all" | "success" | "failed" | "pending"

const STATUS_CONFIG = {
  success: {
    label: "Success",
    icon: IconCircleCheck,
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  failed: {
    label: "Failed",
    icon: IconCircleX,
    pill: "bg-red-50 text-red-600 border border-red-200",
    dot: "bg-red-500",
  },
  pending: {
    label: "Pending",
    icon: IconClock,
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
} as const

// ── Stat Card ──────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  delay = 0,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  accent: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon size={16} strokeWidth={2} />
        </div>
      </div>
      <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
    </motion.div>
  )
}

// ── Status Pill ────────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
  if (!cfg) return <span className="text-xs text-gray-400">{status}</span>

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function DonationsAdminPage() {
  const [stats, setStats] = useState<DonationStats | null>(null)
  const [rows, setRows] = useState<DonationRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(15)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [isPending, startTransition] = useTransition()

  const totalPages = Math.ceil(total / pageSize)

  const load = useCallback(() => {
    startTransition(async () => {
      const [statsData, donationsData] = await Promise.all([
        getDonationStats(),
        getDonations({ page, pageSize, status: statusFilter, search, from, to }),
      ])
      setStats(statsData)
      setRows(donationsData.rows)
      setTotal(donationsData.total)
    })
  }, [page, pageSize, statusFilter, search, from, to])

  useEffect(() => {
    load()
  }, [load])

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [searchInput])

  const handleStatusFilter = (s: StatusFilter) => {
    setStatusFilter(s)
    setPage(1)
  }

  const exportCSV = () => {
    const header = ["ID", "Name", "Email", "Amount (GHS)", "Frequency", "Status", "Reference", "Paystack TX", "Date"]
    const csvRows = rows.map((r) => [
      r.id,
      `"${r.name}"`,
      r.email,
      (r.amount / 100).toFixed(2),
      r.frequency,
      r.status,
      r.reference,
      r.paystackTxId ?? "",
      formatDate(r.createdAt),
    ])
    const csv = [header, ...csvRows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-sans">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Donations</h1>
            <p className="text-xs text-gray-400 mt-0.5">VheeWorld Foundation · Payment Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={load}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-gray-500 border border-gray-200 bg-white hover:bg-gray-50 transition disabled:opacity-50">
              <IconRefresh size={13} className={isPending ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 transition">
              <IconDownload size={13} />
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={stats ? formatGHS(stats.totalRevenue) : "—"}
            sub="All time successful"
            icon={IconCurrencyDollar}
            accent="bg-emerald-50 text-emerald-600"
            delay={0}
          />
          <StatCard
            label="This Month"
            value={stats ? formatGHS(stats.monthlyRevenue) : "—"}
            sub="Current month"
            icon={IconTrendingUp}
            accent="bg-blue-50 text-blue-600"
            delay={0.05}
          />
          <StatCard
            label="Success Rate"
            value={stats ? `${stats.successRate}%` : "—"}
            sub={stats ? `${stats.totalSuccessful} successful` : undefined}
            icon={IconCircleCheck}
            accent="bg-violet-50 text-violet-600"
            delay={0.1}
          />
          <StatCard
            label="Failed"
            value={stats ? stats.totalFailed.toString() : "—"}
            sub="Incomplete payments"
            icon={IconUsers}
            accent="bg-red-50 text-red-500"
            delay={0.15}
          />
        </div>

        {/* ── Table Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          {/* ── Filters ── */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
            {/* Status tabs */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
              {(["all", "success", "failed", "pending"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition ${
                    statusFilter === s ? "bg-white text-gray-900 shadow-xs" : "text-gray-400 hover:text-gray-600"
                  }`}>
                  {s === "all" ? "All" : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 min-w-48 relative">
              <IconSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, email, reference…"
                className="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
              />
            </div>

            {/* Date range */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <IconCalendar
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                />
                <input
                  type="date"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value)
                    setPage(1)
                  }}
                  className="pl-8 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
                />
              </div>
              <span className="text-xs text-gray-300 font-medium">to</span>
              <div className="relative">
                <IconCalendar
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                />
                <input
                  type="date"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value)
                    setPage(1)
                  }}
                  className="pl-8 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
                />
              </div>
              {(from || to) && (
                <button
                  type="button"
                  onClick={() => {
                    setFrom("")
                    setTo("")
                    setPage(1)
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition">
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Donor", "Amount", "Frequency", "Status", "Reference", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {isPending ? (
                    // Skeleton
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <div
                              className="h-3 rounded-full bg-gray-100 animate-pulse"
                              style={{ width: `${60 + Math.random() * 30}%` }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <p className="text-sm font-bold text-gray-300">No donations found</p>
                        <p className="text-xs text-gray-300 mt-1">Try adjusting your filters</p>
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, i) => (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group">
                        {/* Donor */}
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-gray-900">{row.name}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{row.email}</p>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-gray-900">{formatGHS(row.amount)}</span>
                        </td>

                        {/* Frequency */}
                        <td className="px-6 py-4">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                              row.frequency === "monthly"
                                ? "bg-violet-50 text-violet-600 border border-violet-200"
                                : "bg-gray-50 text-gray-500 border border-gray-200"
                            }`}>
                            {row.frequency === "monthly" ? "Monthly" : "One-time"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusPill status={row.status} />
                        </td>

                        {/* Reference */}
                        <td className="px-6 py-4">
                          <code className="text-[11px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            {row.reference}
                          </code>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <span className="text-xs text-gray-400">{formatDate(row.createdAt)}</span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-bold text-gray-600">
                {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)}
              </span>{" "}
              of <span className="font-bold text-gray-600">{total}</span> donations
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isPending}
                className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
                <IconChevronLeft size={14} />
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p: number
                  if (totalPages <= 5) {
                    p = i + 1
                  } else if (page <= 3) {
                    p = i + 1
                  } else if (page >= totalPages - 2) {
                    p = totalPages - 4 + i
                  } else {
                    p = page - 2 + i
                  }
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                        page === p ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                      }`}>
                      {p}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isPending || totalPages === 0}
                className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
                <IconChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
