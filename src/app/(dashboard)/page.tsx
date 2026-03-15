import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { DashboardStats } from '@/components/dashboard-stats'
import { RecentJobs } from '@/components/recent-jobs'
import { UpcomingSchedule } from '@/components/upcoming-schedule'
import { ActivityFeed } from '@/components/activity-feed'
import { formatCurrency } from '@/lib/utils'

async function getDashboardStats(companyId: string) {
  const [
    totalJobs,
    pendingJobs,
    completedJobs,
    jobsThisWeek,
    totalRevenue,
    revenueThisMonth,
    outstandingInvoices,
    upcomingJobs,
    recentActivity
  ] = await Promise.all([
    prisma.job.count({ where: { companyId } }),
    prisma.job.count({ where: { companyId, status: { in: ['PENDING', 'SCHEDULED'] } } }),
    prisma.job.count({ where: { companyId, status: 'COMPLETED' } }),
    prisma.job.count({
      where: {
        companyId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    }),
    prisma.invoice.aggregate({
      where: { companyId },
      _sum: { total: true }
    }),
    prisma.invoice.aggregate({
      where: {
        companyId,
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      },
      _sum: { total: true }
    }),
    prisma.invoice.aggregate({
      where: {
        companyId,
        status: { in: ['SENT', 'VIEWED', 'OVERDUE'] }
      },
      _sum: { total: true }
    }),
    prisma.job.findMany({
      where: {
        companyId,
        scheduledDate: { gte: new Date() }
      },
      include: { customer: true, assignedTo: true },
      orderBy: { scheduledDate: 'asc' },
      take: 5
    }),
    prisma.activity.findMany({
      where: { job: { companyId } },
      include: { user: true, job: { include: { customer: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ])

  return {
    totalJobs,
    jobsThisWeek,
    pendingJobs,
    completedJobs,
    totalRevenue: totalRevenue._sum.total || 0,
    revenueThisMonth: revenueThisMonth._sum.total || 0,
    outstandingInvoices: outstandingInvoices._sum.total || 0,
    upcomingJobs,
    recentActivity
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login')
  }

  const user = session.user as any
  const companyId = user.companyId

  if (!companyId) {
    redirect('/auth/login')
  }

  const stats = await getDashboardStats(companyId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      <DashboardStats stats={{
        totalJobs: stats.totalJobs,
        jobsThisWeek: stats.jobsThisWeek,
        pendingJobs: stats.pendingJobs,
        completedJobs: stats.completedJobs,
        totalRevenue: Number(stats.totalRevenue),
        revenueThisMonth: Number(stats.revenueThisMonth),
        outstandingInvoices: Number(stats.outstandingInvoices)
      }} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentJobs />
        </div>
        <UpcomingSchedule jobs={stats.upcomingJobs} />
     </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ActivityFeed activities={stats.recentActivity} />
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionCard
              title="New Job"
              description="Create a new work order"
              href="/jobs/new"
              icon="📝"
            />
            <QuickActionCard
              title="New Customer"
              description="Add a customer"
              href="/customers/new"
              icon="👤"
            />
            <QuickActionCard
              title="Schedule"
              description="View calendar"
              href="/schedule"
              icon="📅"
            />
            <QuickActionCard
              title="Invoice"
              description="Create invoice"
              href="/invoices/new"
              icon="💰"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({ title, description, href, icon }: {
  title: string
  description: string
  href: string
  icon: string
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center p-4 rounded-lg border bg-background hover:bg-accent transition-colors"
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="font-medium text-sm">{title}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </a>
  )
}