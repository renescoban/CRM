"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ChartData {
  date: string
  orders: number
  payments: number
}

interface OrderPaymentChartProps {
  data: ChartData[]
}

export default function OrderPaymentChart({ data }: OrderPaymentChartProps) {
  const [period, setPeriod] = useState<"daily" | "monthly">("monthly")

  const chartData = period === "daily" ? data : data.filter((_, index) => index % 30 === 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders and Payments Over Time</CardTitle>
        <Select value={period} onValueChange={(value: "daily" | "monthly") => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" stackId="a" fill="#8884d8" name="Orders" />
            <Bar dataKey="payments" stackId="a" fill="#82ca9d" name="Payments" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

