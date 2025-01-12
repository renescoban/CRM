import Link from 'next/link'
import { Order } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OrderListProps {
  orders: Order[]
} 

export default function OrderList({ orders }: OrderListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => {

        console.log(order);
        const totalPaid = order.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0
        const remainingBalance = order.total - totalPaid

        return (
          <Link href={`/orders/${order.id}`} key={order.id}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Order #{order.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total: ${order.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Paid: ${totalPaid.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Remaining: ${remainingBalance.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Customer: {order.contact?.name}</p>
                    <p className="text-sm text-gray-600">Created: {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

