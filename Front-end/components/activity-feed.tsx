import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const activities = [
  { user: 'John Doe', action: 'completed a transaction', time: '2 minutes ago' },
  { user: 'Jane Smith', action: 'updated their profile', time: '1 hour ago' },
  { user: 'Mike Johnson', action: 'generated a new report', time: '3 hours ago' },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium">
                  {activity.user} {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

