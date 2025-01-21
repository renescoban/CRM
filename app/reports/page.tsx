import { getActivities, getTags } from '@/lib/actions'
import ReportsClient from './client'
import { Metadata } from 'next';
import SumsPage from './Sums';
import PredictiveAnalytics from './PredictiveAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderModel } from '@/models/OrderModel';
import { ContactModel } from '@/models/ContactModel';
import { PaymentModel } from '@/models/PaymentModel';
import OrderPaymentChart from './OrderPaymentChart';

export const metadata: Metadata = {
  title: "Reports",
  description: "...",
};

async function getReportData() {
  const orders = await OrderModel.getAll()
  const contacts = await ContactModel.getAll()
  const payments = await PaymentModel.getAll()
  const period = "daily"

  const ordersByDate = groupByDate(orders, period)
  const paymentsByDate = groupByDate(payments, period)

  const chartData = combineOrdersAndPayments(ordersByDate, paymentsByDate)

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const AOV = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const customerData = payments.map((payment) => {
    const customerOrders = orders.filter((order) => order.contact_id === payment.contact_id)
    const customerRevenue = customerOrders.reduce((sum, order) => sum + order.total, 0)
    const firstOrderDate = new Date(Math.min(...customerOrders.map((o) => new Date(o.created_at).getTime())))
    const lastOrderDate = new Date(Math.max(...customerOrders.map((o) => new Date(o.created_at).getTime())))
    const daysSinceFirstOrder = (new Date().getTime() - firstOrderDate.getTime()) / (1000 * 3600 * 24)

    return {
      id: payment.contact_id,
      revenue: customerRevenue,
      orderCount: customerOrders.length,
      firstOrderDate,
      lastOrderDate,
      daysSinceFirstOrder,
    }
  })

  const totalCustomers = customerData.length
  const CLV = totalCustomers > 0 ? totalRevenue / totalCustomers : 0

  // Calculate retention rate (simplified: customers with more than one order)
  const repeatCustomers = customerData.filter((c) => c.orderCount > 1).length
  const retentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0

  // Prepare data for predictive analytics
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return date.toISOString().slice(0, 7) // YYYY-MM format
  }).reverse()

  const monthlySales = last12Months.map((month) => {
    const monthOrders = orders.filter((order) => order.created_at.startsWith(month))
    return {
      month,
      sales: monthOrders.reduce((sum, order) => sum + order.total, 0),
    }
  })

  const reportData = {
    chartData,
    totalRevenue,
    totalOrders,
    AOV,
    CLV,
    retentionRate,
    customerData,
    monthlySales,
  }
  return (reportData)
}

function groupByDate(items: any[], period: string) {
  return items.reduce((acc, item) => {
    const date = new Date(item.created_at)
    const key =
      period === "daily"
        ? date.toISOString().split("T")[0]
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

    if (!acc[key]) {
      acc[key] = { orders: 0, payments: 0 }
    }

    if ("total" in item) {
      acc[key].orders += item.total
    } else if ("amount" in item) {
      acc[key].payments += item.amount
    }

    return acc
  }, {})
}

function combineOrdersAndPayments(orders: { [x: string]: { orders: any; }; }, payments: { [x: string]: { payments: any; }; }) {
  const allDates = new Set([...Object.keys(orders), ...Object.keys(payments)])
  return Array.from(allDates)
    .map((date) => ({
      date,
      orders: orders[date]?.orders || 0,
      payments: payments[date]?.payments || 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export default async function Reports() {

  try {
    const [activities, tags, reportData] = await Promise.all([getActivities(), getTags(), getReportData()])
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Reports</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${reportData.totalRevenue.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{reportData.totalOrders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Order Value (AOV)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${reportData.AOV.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value (CLV)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${reportData.CLV.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{reportData.retentionRate.toFixed(2)}%</p>
              </CardContent>
            </Card>
          </div>
          <div className="md:flex">
            <OrderPaymentChart data={reportData.chartData} />
            <PredictiveAnalytics monthlySales={reportData.monthlySales} />
            <ReportsClient initialActivities={activities} initialTags={tags} />
          </div>
        </main>
      </div>

    )
  } catch (error) {
    console.error('Error fetching report data:', error)
    return <div>Error loading report data. Please try again later.</div>
  }
}