'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { contacts } from '@/data/contacts'
import { Activity, Contact } from '@/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Reports() {
  const [reportType, setReportType] = useState<'activities' | 'tags'>('activities')

  const activityData = contacts.reduce((acc, contact) => {
    contact.activities?.forEach(activity => {
      if (acc[activity.type]) {
        acc[activity.type]++
      } else {
        acc[activity.type] = 1
      }
    })
    return acc
  }, {} as Record<string, number>)

  const tagData = contacts.reduce((acc, contact) => {
    contact.tags?.forEach(tag => {
      if (acc[tag]) {
        acc[tag]++
      } else {
        acc[tag] = 1
      }
    })
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(reportType === 'activities' ? activityData : tagData).map(([name, value]) => ({ name, value }))

  return (
    <div className="min-h-screen ">
      <main className="mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reports</h1>
        <Card className="mb-8">
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
        <Card>
          <CardHeader>
            <CardTitle>{reportType === 'activities' ? 'Activity' : 'Tag'} Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
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

