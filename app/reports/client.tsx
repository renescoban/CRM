'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Tag } from '@/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ReportsClientProps {
  initialActivities: Activity[]
  initialTags: Tag[]
}

export default function ReportsClient({ initialActivities, initialTags }: ReportsClientProps) {
  const [reportType, setReportType] = useState<'activities' | 'tags'>('activities')

  const activityData = initialActivities.reduce((acc, activity) => {
    if (acc[activity.type]) {
      acc[activity.type]++
    } else {
      acc[activity.type] = 1
    }
    return acc
  }, {} as Record<string, number>)

  const tagData = initialTags.reduce((acc, tag) => {
    if (acc[tag.name]) {
      acc[tag.name]++
    } else {
      acc[tag.name] = 1
    }
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(reportType === 'activities' ? activityData : tagData).map(([name, value]) => ({ name, value }))

  return (
    <div className="min-h-screen ">
        <main className=" mx-auto px-4 py-1">
        
        <Card className="mb-5">
          <CardHeader>
            <CardTitle>Report Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={reportType} onValueChange={(value: 'activities' | 'tags') => setReportType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activities">Activities</SelectItem>
                <SelectItem value="tags">Tags</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card className="w-96">
          <CardHeader>
            <CardTitle>{reportType === 'activities' ? 'Activity' : 'Tag'} Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

