import { Activity } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ActivityListProps {
  activities: Activity[]
}

export default function ActivityList( {activities}: ActivityListProps) {


  return (
    <div className="space-y-4 border-t pt-4">
      <Button>Add Activity</Button>
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardHeader>
            <CardTitle className="capitalize flex justify-between items-center">
              {activity.type}  
              <div className='space-x-2'>
                <Button size="sm">Edit</Button>
                <Button size="sm" variant="destructive" >Delete</Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
            <p className="text-xs text-gray-500 mb-2">Date: {activity.date}</p>
            {activity.dueDate && (
              <p className="text-xs text-gray-500 mb-2">Due: {activity.dueDate}</p>
            )}
            <div className="flex space-x-2">
              
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

