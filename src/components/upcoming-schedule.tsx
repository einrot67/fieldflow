import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatTime } from '@/lib/utils'
import { Calendar } from 'lucide-react'

interface UpcomingScheduleProps {
  jobs: any[]
}

export function UpcomingSchedule({ jobs }: UpcomingScheduleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No upcoming jobs scheduled
            </p>
          ) : (
            jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 text-center">
                    <div className="text-xs font-medium text-muted-foreground uppercase">
                      {job.scheduledDate
                        ? new Date(job.scheduledDate).toLocaleDateString('en-US', {
                            month: 'short',
                          })
                        : 'TBD'}
                    </div>
                    <div className="text-lg font-bold">
                      {job.scheduledDate
                        ? new Date(job.scheduledDate).getDate()
                        : '-'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{job.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.customer?.firstName} {job.customer?.lastName}
                    </p>
                    {job.startTime && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(job.startTime)}
                        {job.assignedTo && (
                          <span className="ml-2">
                            • {job.assignedTo.name}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
