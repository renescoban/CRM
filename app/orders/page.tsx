import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import OrderTable from '@/components/OrderTable'
import { Order } from '@/types'
import { OrderModel } from '@/models/OrderModel'
import { Metadata } from 'next'
import { getOrders } from '@/lib/actions'

export const metadata: Metadata = {
  title: 'Orders',
  description: '...',
}



export default async function Orders() {
  const orders = await getOrders()

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalPaid = orders.reduce((sum, order) => {
    const paidAmount = order.payments?.reduce((paidSum, payment) => paidSum + payment.amount, 0) || 0
    return sum + paidAmount
  }, 0)
  const pendingPayments = totalRevenue - totalPaid

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Orders</h1>
          <Link href="/orders/make">
            <Button>Create New Order</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pendingPayments.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* <OrderList orders={orders} /> */}
        <OrderTable orders={orders} />

      </main>
    </div>
  )
}

