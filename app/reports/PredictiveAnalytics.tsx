"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface SalesData {
  month: string
  sales: number
}

interface PredictiveAnalyticsProps {
  monthlySales: SalesData[]
}

export default function PredictiveAnalytics({ monthlySales }: PredictiveAnalyticsProps) {
  const predictedSales = useMemo(() => {
    // Simple linear regression
    const n = monthlySales.length
    const sumX = monthlySales.reduce((sum, _, i) => sum + i, 0)
    const sumY = monthlySales.reduce((sum, d) => sum + d.sales, 0)
    const sumXY = monthlySales.reduce((sum, d, i) => sum + i * d.sales, 0)
    const sumXX = monthlySales.reduce((sum, _, i) => sum + i * i, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Predict next 3 months
    const lastMonth = new Date(monthlySales[monthlySales.length - 1].month)
    const predictedData = Array.from({ length: 3 }, (_, i) => {
      const predictedMonth = new Date(lastMonth)
      predictedMonth.setMonth(predictedMonth.getMonth() + i + 1)
      const predictedSales = slope * (n + i) + intercept

      return {
        month: predictedMonth.toISOString().slice(0, 7),
        sales: Math.max(0, predictedSales), // Ensure non-negative sales
      }
    })
    
    return [...monthlySales, ...predictedData]
  }, [monthlySales])
  
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Sales Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictedSales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Actual Sales" />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#82ca9d"
              name="Predicted Sales"
              strokeDasharray="5 5"
              data={predictedSales.slice(-3)}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

