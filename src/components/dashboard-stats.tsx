'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import {
  Briefcase,
  Clock,
  CheckCircle,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

interface DashboardStatsProps {
  stats: {
    totalJobs: number
    jobsThisWeek: number
    pendingJobs: number
    completedJobs: number
    totalRevenue: number
    revenueThisMonth: number
    outstandingInvoices: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const items = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      change: `+${stats.jobsThisWeek} this week`,
      icon: Briefcase,
      trend: 'up',
    },
    {
      title: 'Pending Jobs',
      value: stats.pendingJobs,
      change: 'Awaiting schedule',
      icon: Clock,
      trend: 'neutral',
    },
    {
      title: 'Completed',
      value: stats.completedJobs,
      change: 'All time',
      icon: CheckCircle,
      trend: 'up',
    },
    {
      title: 'Revenue (Month)',
      value: formatCurrency(stats.revenueThisMonth),
      change: formatCurrency(stats.totalRevenue) + ' total',
      icon: DollarSign,
      trend: 'up',
    },
    {
      title: 'Outstanding',
      value: formatCurrency(stats.outstandingInvoices),
      change: 'Unpaid invoices',
      icon: AlertCircle,
      trend: stats.outstandingInvoices > 10000 ? 'down' : 'neutral',
    },
    {
      title: 'Job Growth',
      value: stats.totalJobs > 0 ? `${Math.round((stats.jobsThisWeek / stats.totalJobs) * 100)}%` : '0%',
      change: 'Weekly growth',
      icon: TrendingUp,
      trend: 'up',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">
              {item.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
