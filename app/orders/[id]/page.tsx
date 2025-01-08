'use client'

import { use } from "react";
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { updateOrder, deleteOrder, processPayment } from '@/lib/actions'
import { orders } from '@/data/orders'
import { contacts } from '@/data/contacts'
import { Order, Payment } from '@/types'

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<Payment['method']>('credit_card')
  const [paymentNotes, setPaymentNotes] = useState('')

  const { toast } = useToast()

  useEffect(() => {
    const foundOrder = orders.find(o => o.id === parseInt(id))
    if (foundOrder) {
      setOrder(foundOrder)
      setPaymentAmount(foundOrder.remainingBalance.toFixed(2))
    }
  }, [id])

  if (!order) {
    return <div>Order not found</div>
  }

  const contact = contacts.find(c => c.id === order.contactId)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateOrder(order.id, order)
      setIsEditing(false)
      toast({
        title: "Order updated",
        description: "The order has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteOrder(order.id)
      setIsDeleteDialogOpen(false)
      router.push('/orders')
      toast({
        title: "Order deleted",
        description: "The order has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0 || amount > order.remainingBalance) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      })
      return
    }
    try {
      const result = await processPayment(order.id, amount, paymentMethod, paymentNotes)
      if (result.success) {
        const newPayment: Payment = {
          id: order.payments.length + 1,
          amount,
          date: new Date().toISOString(),
          method: paymentMethod,
          notes: paymentNotes,
        }
        const updatedOrder: Order = {
          ...order,
          payments: [...order.payments, newPayment],
          remainingBalance: order.remainingBalance - amount,
        }
        setOrder(updatedOrder)
        await updateOrder(order.id, updatedOrder)
        setIsPaymentDialogOpen(false)
        setPaymentAmount('')
        setPaymentMethod('credit_card')
        setPaymentNotes('')
        toast({
          title: "Payment processed",
          description: `A payment of $${amount} has been processed for this order.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing the payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <div>
            <Button onClick={() => setIsEditing(!isEditing)} className="mr-2">
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Delete</Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={order.status} 
                    onValueChange={(value: Order['status']) => setOrder({...order, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                  <Input
                    type="date"
                    id="estimatedDelivery"
                    value={order.estimatedDelivery}
                    onChange={(e) => setOrder({...order, estimatedDelivery: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="orderNote">Order Note</Label>
                  <Textarea
                    id="orderNote"
                    value={order.orderNote || ''}
                    onChange={(e) => setOrder({...order, orderNote: e.target.value})}
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            ) : (
              <div className="space-y-2">
                <p><strong>Contact:</strong> {contact?.name}</p>
                <p><strong>Status:</strong> <Badge>{order.status}</Badge></p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                <p><strong>Remaining Balance:</strong> ${order.remainingBalance.toFixed(2)}</p>
                <p><strong>Created At:</strong> {order.createdAt}</p>
                <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery}</p>
                {order.orderNote && <p><strong>Order Note:</strong> {order.orderNote}</p>}
              </div>
            )}
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
                  <th className="text-left">Count</th>
                  <th className="text-left">Subtotal</th>
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {order.payments.length === 0 ? (
              <p>No payments have been made yet.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Date</th>
                    <th className="text-left">Amount</th>
                    <th className="text-left">Method</th>
                    <th className="text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {order.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{new Date(payment.date).toLocaleDateString()}</td>
                      <td>${payment.amount.toFixed(2)}</td>
                      <td>{payment.method}</td>
                      <td>{payment.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Button onClick={() => setIsPaymentDialogOpen(true)}>Add Payment</Button>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this order? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(value: Payment['method']) => setPaymentMethod(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentNotes">Payment Notes</Label>
                <Textarea
                  id="paymentNotes"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Add any additional notes for this payment"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Process Payment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

