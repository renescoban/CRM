import { Activity } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ActivityListProps {
  activities: Activity[]
  onEdit: (activity: Activity) => void
  onDelete: (activityId: number) => void
}

export default function ActivityList({ activities, onEdit, onDelete }: ActivityListProps) {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardHeader>
            <CardTitle className="capitalize">{activity.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
            <p className="text-xs text-gray-500 mb-2">Date: {activity.date}</p>
            {activity.dueDate && (
              <p className="text-xs text-gray-500 mb-2">Due: {activity.dueDate}</p>
            )}
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => onEdit(activity)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(activity.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

