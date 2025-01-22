"use client"

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartData {
  date: string;
  orders: number;
  payments: number;
}

interface OrderPaymentChartProps {
  dataX: Array<{ created_at: string; total: number }>;
  dataY: Array<{ created_at: string; amount: number }>;
}

const groupByDate = (items: any[], period: "daily" | "monthly") => {
  const dateMap = new Map();

  items.forEach(item => {
    const date = new Date(item.created_at);
    const key = period === "daily"
      ? date.toISOString().split("T")[0]
      : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!dateMap.has(key)) {
      dateMap.set(key, { orders: 0, payments: 0 });
    }

    const entry = dateMap.get(key);
    if ("total" in item) {
      entry.orders += item.total;
    } else if ("amount" in item) {
      entry.payments += item.amount;
    }
  });

  return dateMap;
};

const combineOrdersAndPayments = (orders: Map<string, any>, payments: Map<string, any>): ChartData[] => {
  const allDates = new Set([...orders.keys(), ...payments.keys()]);
  
  return Array.from(allDates)
    .map(date => ({
      date,
      orders: orders.get(date)?.orders || 0,
      payments: payments.get(date)?.payments || 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export default function OrderPaymentChart({ dataX, dataY }: OrderPaymentChartProps) {
  const [period, setPeriod] = useState<"daily" | "monthly">("monthly");

  const chartData = useMemo(() => {
    const ordersByDate = groupByDate(dataX, period);
    const paymentsByDate = groupByDate(dataY, period);
    return combineOrdersAndPayments(ordersByDate, paymentsByDate);
  }, [dataX, dataY, period]);

  const handlePeriodChange = useCallback((value: "daily" | "monthly") => {
    setPeriod(value);
  }, []);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Orders and Payments Over Time</CardTitle>
        <Select value={period} onValueChange={handlePeriodChange}>
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
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              width={80}
            />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="orders" 
              stackId="a" 
              fill="#8884d8" 
              name="Orders"
              isAnimationActive={false}
            />
            <Bar 
              dataKey="payments" 
              stackId="a" 
              fill="#82ca9d" 
              name="Payments"
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}