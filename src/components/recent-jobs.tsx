'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStatusColor, formatDate, truncate } from '@/lib/utils'
import { JobStatus } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function RecentJobs() {
  const { data, error, isLoading } = useSWR('/api/jobs?limit=5', fetcher)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load jobs</p>
        </CardContent>
      </Card>
    )
  }

  const jobs = data?.data || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Jobs</CardTitle>
        <Link href="/jobs">
          <Button variant="ghost" size="sm">
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No jobs yet. Create your first job!
            </p>
          ) : (
            jobs.map((job: any) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{job.title}</p>
                    <Badge
                      variant="outline"
                      className={getStatusColor(job.status)}
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {job.customer?.firstName} {job.customer?.lastName} • {' '}
                    {formatDate(job.scheduledDate)}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
