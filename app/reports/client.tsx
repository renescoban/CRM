'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Tag } from '@/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ReportsClientProps {
  initialActivities: {type: string }[]
  initialTags: { name:string, count:number}[]
}

export default function ReportsClient({ initialActivities, initialTags }: ReportsClientProps) {
  const [reportType, setReportType] = useState<'activities' | 'tags'>('activities')


    const itemMap = new Map<string, { name:string, count: number }>();
  
    for (const item of initialActivities) {

      const name = item.type;
  
      if (itemMap.has(name)) {
        // If the type already exists in the map, increment its count
        const existingItem = itemMap.get(name)!;
        existingItem.count += 1;
      } else {
        // If the type doesn't exist in the map, add it with a count of 1
        itemMap.set(name, {
          name,
          count: 1,
        });
      }
    }
  
    // Convert the map values to an array
    const activityData =  Array.from(itemMap.values());
  
  const chartData = reportType === 'activities' ?  activityData: initialTags

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
                <SelectItem value="tags">Contact Tags</SelectItem>
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
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

