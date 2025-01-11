import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Order } from '../types'

interface OrdersSummaryProps {
  orders: Order[]
}

export default function OrdersSummary({ orders }: OrdersSummaryProps) {
  const totalPaid = orders.reduce((sum, order) => sum + (order.total - order.remainingBalance), 0)
  const totalUnpaid = orders.reduce((sum, order) => sum + order.remainingBalance, 0)
  const totalReceivable = orders.reduce((sum, order) => sum + order.total, 0)

  const today = new Date()
  const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const upcomingPayments = orders
    .filter(order => order.remainingBalance > 0 && new Date(order.estimated_delivery) <= oneWeekFromNow)
    .reduce((sum, order) => sum + order.remainingBalance, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Paid</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalPaid.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Unpaid</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalUnpaid.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Receivable</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalReceivable.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${upcomingPayments.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Due in the next 7 days</p>
        </CardContent>
      </Card>
    </div>
  )
}

