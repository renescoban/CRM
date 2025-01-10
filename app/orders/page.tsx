import Link from 'next/link'
import { Button } from "@/components/ui/button"
import OrderList from '@/components/OrderList'
import OrdersSummary from '@/components/OrdersSummary'
import { Order } from "@/types"

async function getOrdersData():  Promise<Order[]>{
  const res = await fetch(`/api/order/`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch orders')
  }
  return res.json()
}

export default async function Orders() {

const orders  = await getOrdersData()

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

