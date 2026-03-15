import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, getInitials } from '@/lib/utils'
import { Activity, FileText, CheckCircle, UserPlus, Calendar } from 'lucide-react'

interface ActivityFeedProps {
  activities: any[]
}

const activityIcons: Record<string, any> = {
  job_created: FileText,
  job_updated: FileText,
  job_completed: CheckCircle,
  customer_created: UserPlus,
  scheduled: Calendar,
  default: Activity,
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No recent activity
            </p>
          ) : (
            activities.map((activity) => {
              const Icon = activityIcons[activity.action] || activityIcons.default
              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.description}</p>
                    {activity.job && (
                      <Link
                        href={`/jobs/${activity.job.id}`}
                        className="text-xs text-muted-foreground hover:text-primary"
                      >
                        {activity.job.customer?.firstName} {activity.job.customer?.lastName} • {activity.job.title}
                      </Link>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(activity.createdAt)}
                      {activity.user && (
                        <span className="ml-1">by {activity.user.name}</span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
