import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Header from '@/components/Header'
import OrderList from '@/components/OrderList'
import OrdersSummary from '@/components/OrdersSummary'
import { orders } from '@/data/orders'

export default function Orders() {
  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Orders</h1>
          <Link href="/orders/make">
            <Button>Make New Order</Button>
          </Link>
        </div>
        <OrdersSummary orders={orders} />
        <OrderList orders={orders} />
      </main>
    </div>
  )
}

