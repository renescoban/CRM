'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Order, Payment } from '@/types'

export default function OrderDetails() {
  const router = useRouter()
  const  {id}  = useParams<{ id: string; }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`)
        if (!res.ok) {
          throw new Error('Failed to fetch order')
        }
        const data = await res.json()
        console.log(data);
        setOrder(data)
      } catch (error) {
        console.error('Error fetching order:', error)
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!order) {
    return <div>Order not found</div>
  }

  const totalPaid = order.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0
  const remainingBalance = order.total - totalPaid

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold block">Order #{order.id}</h1>

          <Button>Edit Order</Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Customer:</strong> {order.contact?.name}</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                <p><strong>Paid:</strong> ${totalPaid.toFixed(2)}</p>
                <p><strong>Remaining Balance:</strong> ${remainingBalance.toFixed(2)}</p>
              </div>
              <div>
                <p><strong>Status:</strong> <Badge>{order.status}</Badge></p>
                <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(order.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Name</th>
                  <th className="text-left">Price</th>
                  <th className="text-left">Quantity</th>
                  <th className="text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.count}</td>
                    <td>${(product.price * product.count).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Link className='block justify-self-end mb-3' href={`/orders/${order.id}/add-payment`}>
            <Button>Add Payment</Button>
          </Link>
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {order.payments && order.payments.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Date</th>
                    <th className="text-left">Amount</th>
                    <th className="text-left">Method</th>
                    <th className="text-left">Note</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {order.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{new Date(payment.created_at).toLocaleString()}</td>
                      <td>${payment.amount.toFixed(2)}</td>
                      <td>{payment.method}</td>
                      <td>{payment.note}</td>
                      <td><Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>{payment.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No payments recorded for this order.</p>
            )}
          </CardContent>
        </Card>

        <Button variant="destructive" className='mt-8'>Delete Order</Button>

      </main>
    </div>
  )
}

