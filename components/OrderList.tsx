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
      {orders.map((order) => (
        <Link href={`/orders/${order.id}`} key={order.id}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Order #{order.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total: ${order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Paid: ${(order.total - order.remainingBalance).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Remaining: ${order.remainingBalance.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

