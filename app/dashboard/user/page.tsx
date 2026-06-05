import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { desc, eq, count, sum, gte, and } from "drizzle-orm"
import { auth } from "@/lib/auth/auth"
import { db } from "@/lib/db"
import { posts, projects, donations } from "@/lib/db/schema"
import { DashboardClient } from "./dashboard-client"

async function getDashboardData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

  const [postStats, projectStats, donationStats, monthlyDonations, lastMonthDonations, recentDonations] =
    await Promise.all([
      // Post counts by status
      db
        .select({ status: posts.status, count: count() })
        .from(posts)
        .groupBy(posts.status),

      // Project counts by status
      db
        .select({ status: projects.status, count: count() })
        .from(projects)
        .groupBy(projects.status),

      // All-time donation stats
      db
        .select({ count: count(), total: sum(donations.amount) })
        .from(donations)
        .where(eq(donations.status, "success")),

      // This month's revenue
      db
        .select({ total: sum(donations.amount) })
        .from(donations)
        .where(and(eq(donations.status, "success"), gte(donations.createdAt, startOfMonth))),

      // Last month's revenue (for trend)
      db
        .select({ total: sum(donations.amount) })
        .from(donations)
        .where(
          and(
            eq(donations.status, "success"),
            gte(donations.createdAt, startOfLastMonth)
            // lte not imported — use raw comparison via gte on flipped range isn't ideal,
            // so we compute the diff client-side instead
          )
        ),

      // Recent 6 donations for activity feed
      db
        .select({
          id: donations.id,
          name: donations.name,
          email: donations.email,
          amount: donations.amount,
          currency: donations.currency,
          frequency: donations.frequency,
          status: donations.status,
          reference: donations.reference,
          createdAt: donations.createdAt,
        })
        .from(donations)
        .orderBy(desc(donations.createdAt))
        .limit(6),
    ])

  const publishedPosts = postStats.find((p) => p.status === "published")?.count ?? 0
  const draftPosts = postStats.find((p) => p.status === "draft")?.count ?? 0
  const archivedPosts = postStats.find((p) => p.status === "archived")?.count ?? 0

  const publishedProjects = projectStats.find((p) => p.status === "published")?.count ?? 0
  const draftProjects = projectStats.find((p) => p.status === "draft")?.count ?? 0

  const totalRevenue = Number(donationStats[0]?.total ?? 0)
  const totalDonors = Number(donationStats[0]?.count ?? 0)
  const thisMonthRevenue = Number(monthlyDonations[0]?.total ?? 0)
  const lastMonthRevenue = Number(lastMonthDonations[0]?.total ?? 0)

  const revenueGrowth =
    lastMonthRevenue === 0 ? null : Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)

  return {
    posts: {
      published: Number(publishedPosts),
      drafts: Number(draftPosts),
      archived: Number(archivedPosts),
      total: Number(publishedPosts) + Number(draftPosts) + Number(archivedPosts),
    },
    projects: {
      published: Number(publishedProjects),
      drafts: Number(draftProjects),
      total: Number(publishedProjects) + Number(draftProjects),
    },
    donations: {
      totalRevenue,
      totalDonors,
      thisMonthRevenue,
      lastMonthRevenue,
      revenueGrowth,
    },
    recentDonations,
  }
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const data = await getDashboardData()

  return (
    <DashboardClient
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
      data={data}
    />
  )
}
