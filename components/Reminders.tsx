"use client"
import { useEffect, useState } from 'react'
import { Activity } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RemindersProps {
  activities: Activity[]
}

export default function Reminders({ activities }: RemindersProps) {
  const [upcomingTasks, setUpcomingTasks] = useState<Activity[]>([])

  useEffect(() => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const tasks = activities
      .filter(activity => 
        activity.type === 'task' && 
        activity.dueDate && 
        new Date(activity.dueDate) > today &&
        new Date(activity.dueDate) <= nextWeek
      )
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())

    setUpcomingTasks(tasks)
  }, [activities])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingTasks.length === 0 ? (
          <p>No upcoming tasks for the next 7 days.</p>
        ) : (
          <ul className="space-y-2">
            {upcomingTasks.map(task => (
              <li key={task.id} className="text-sm">
                <span className="font-semibold">{task.description}</span> - Due: {task.dueDate}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

