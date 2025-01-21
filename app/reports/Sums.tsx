import { Activity, Tag } from "@/types";

interface ReportSumsProps {
    initialActivities: Activity[]
    initialTags: Tag[]
    monthlySales: { month: string; sales: number }[]
    customerData: {
      id: string
      revenue: number
      orderCount: number
      firstOrderDate: string
      lastOrderDate: string
      daysSinceFirstOrder: number
    }[]
  }
export default async function SumsPage({monthlySales, customerData,}:ReportSumsProps){
    const customerValueData = customerData
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map((customer) => ({
      id: customer.id,
      value: customer.revenue,
    }))

}