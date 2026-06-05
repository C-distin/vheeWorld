"use server"

import { and, count, desc, eq, gte, ilike, lte, or, sum } from "drizzle-orm"
import { db } from "@/lib/db"
import { donations } from "@/lib/db/schema"

export interface DonationStats {
  totalSuccessful: number
  totalFailed: number
  totalRevenue: number // in pesewas
  monthlyRevenue: number
  successRate: number
}

export interface DonationRow {
  id: number
  email: string
  name: string
  amount: number
  currency: string
  frequency: string
  status: string
  reference: string
  paystackTxId: string | null
  createdAt: Date
}

export interface GetDonationsParams {
  page?: number
  pageSize?: number
  status?: "all" | "success" | "failed" | "pending"
  search?: string
  from?: string
  to?: string
}

export async function getDonationStats(): Promise<DonationStats> {
  const [successResult] = await db
    .select({ count: count(), total: sum(donations.amount) })
    .from(donations)
    .where(eq(donations.status, "success"))

  const [failedResult] = await db.select({ count: count() }).from(donations).where(eq(donations.status, "failed"))

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [monthlyResult] = await db
    .select({ total: sum(donations.amount) })
    .from(donations)
    .where(and(eq(donations.status, "success"), gte(donations.createdAt, startOfMonth)))

  const successCount = Number(successResult?.count ?? 0)
  const failedCount = Number(failedResult?.count ?? 0)
  const total = successCount + failedCount

  return {
    totalSuccessful: successCount,
    totalFailed: failedCount,
    totalRevenue: Number(successResult?.total ?? 0),
    monthlyRevenue: Number(monthlyResult?.total ?? 0),
    successRate: total === 0 ? 0 : Math.round((successCount / total) * 100),
  }
}

export async function getDonations({
  page = 1,
  pageSize = 20,
  status = "all",
  search = "",
  from,
  to,
}: GetDonationsParams = {}): Promise<{ rows: DonationRow[]; total: number }> {
  const conditions = []

  if (status !== "all") {
    conditions.push(eq(donations.status, status))
  }

  if (search) {
    conditions.push(
      or(
        ilike(donations.email, `%${search}%`),
        ilike(donations.name, `%${search}%`),
        ilike(donations.reference, `%${search}%`)
      )
    )
  }

  if (from) {
    conditions.push(gte(donations.createdAt, new Date(from)))
  }

  if (to) {
    const toDate = new Date(to)
    toDate.setHours(23, 59, 59, 999)
    conditions.push(lte(donations.createdAt, toDate))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [{ total }] = await db.select({ total: count() }).from(donations).where(where)

  const rows = await db
    .select()
    .from(donations)
    .where(where)
    .orderBy(desc(donations.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  return { rows, total: Number(total) }
}
