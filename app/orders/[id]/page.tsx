'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Order, Payment } from '@/types'
import { TrashIcon } from 'lucide-react'
import StarRating from '@/components/StarRating'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EditedOrder {
  status: string;
  note?: string;
  importance:number
  products:{ name: string, price: number, count: number }[]
}

export default function OrderDetails() {
  const { id } = useParams<{ id: string; }>()
  const route = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const [order, setOrder] = useState<Order | null>(null)
  const [editedOrder, setEditedOrder] = useState<EditedOrder>({
    status: "",
    importance: 0,
    products: [],
    note: "",
  })
  const [products, setProducts] = useState([{ name: '', price: 0, count: 1 }])
  const [payments, setPayments] = useState<Payment[]>([])
  const [newPayment, setNewPayment] = useState<Omit<Payment, 'id' | 'created_at' | 'updated_at'>>({
    amount: 0,
    method: 'credit_card',
    status: 'completed',
    order_id: id
  })

  const { toast } = useToast()

  const fetchOrderAndPayments = async () => {
    try {
      const orderRes = await
        fetch(`/api/orders/${id}`,  )

      if (!orderRes.ok) {
        throw new Error('Failed to fetch order or payments')
      }

      const orderData = await orderRes.json()

      setOrder(orderData)
      setProducts(orderData.products)
      setEditedOrder({ status: orderData.status, note: orderData.note, importance: orderData.importance, products:orderData.products })
      setPayments( orderData.payments )
    } catch (error) {
      console.error('Error fetching order and payments:', error)
      toast({
        title: "Error",
        description: "Failed to load order details and payments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    
    fetchOrderAndPayments()
  }, [id])

  const handleEditOrder = async () => {
    try {
      const total = editedOrder.products.reduce((sum, product) => sum + product.price * product.count, 0) 
      const remainingBalance = total  - totalPaid 

      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...editedOrder, total, remaining_balance:remainingBalance}),
        
      })

      if (!res.ok) {
        // Handle API errors here (e.g., status code errors)
        const error = await res.text();
        console.error("Update contact API error:", error);
        throw new Error(error);
      }

      fetchOrderAndPayments()

      setIsEditing(false)
      toast({
        title: "Order updated",
        description: "The order has been successfully updated.",
      })
    } catch (error) {
      console.error('Error updating order:', error)
      toast({
        title: "Error",
        description: "Failed to update the order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddPayment = async () => {
    try {
      const res = await fetch(`/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPayment),
      })

      if (!res.ok) {
        throw new Error('Failed to add payment')
      }

      const addedPayment = await res.json()
      setPayments([...payments, addedPayment])
      setIsAddDialogOpen(false)
      setNewPayment({
        amount: 0,
        method: 'credit_card',
        status: 'completed',
        order_id: id
      })
      fetchOrderAndPayments()

      toast({
        title: "Payment added",
        description: "The payment has been successfully added to the order.",
      })
    } catch (error) {
      console.error('Error adding payment:', error)
      toast({
        title: "Error",
        description: "Failed to add the payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    try {
      const res = await fetch(`/api/payments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( paymentId ),
      })

      if (!res.ok) {
        throw new Error('Failed to delete payment')
      }

      setPayments(payments.filter(payment => payment.id !== paymentId))
      toast({
        title: "Payment deleted",
        description: "The payment has been successfully deleted from the order.",
      })
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast({
        title: "Error",
        description: "Failed to delete the payment. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  const handleDeleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( orderId ),
      })

      if (!res.ok) {
        throw new Error('Failed to delete payment')
      }
      if (res.ok) {
        route.push('/orders')
      }

    } catch (error) {
      console.error('Error deleting payment:', error)
      toast({
        title: "Error",
        description: "Failed to delete the order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateProduct = (index: number, field: string, value: string | number) => {
    const updatedProducts = [...products]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setEditedOrder({...editedOrder, products: updatedProducts})
  }

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
      <title>{"Order id"}</title>
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold block">Order #{order.id}</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Order</Button>
          )}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={(e) => { e.preventDefault(); handleEditOrder(); }} className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editedOrder.status}
                    onValueChange={(value) => setEditedOrder({ ...editedOrder, status: value as Order['status'] })}
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
                <StarRating displayMode={!isEditing} maxStars={3} onChange={(value) =>setEditedOrder({ ...editedOrder, importance:value})} />
                <div>
                  <Label htmlFor="note">Order Note</Label>
                  <Textarea
                    id="note"
                    value={editedOrder.note || ''}
                    onChange={(e) => setEditedOrder({ ...editedOrder, note: e.target.value })}
                    placeholder="Add any additional notes here"
                  />
                </div>
                
                <div>
                <Label>Products</Label>
            {editedOrder.products?.map((product, index) => (
              <div key={index} className="flex space-x-2 mt-2">
                <Input
                  placeholder="Product name"
                  value={product.name}
                  onChange={(e) => updateProduct(index, 'name', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={product.price}
                  onChange={(e) => updateProduct(index, 'price', parseFloat(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Count"
                  value={product.count}
                  onChange={(e) => updateProduct(index, 'count', parseInt(e.target.value))}
                />
              </div>
            ))}
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2  gap-x-4">
                <div>
                  <p><strong>Customer:</strong> {order.contacts?.name}</p>
                  <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                  <p><strong>Paid:</strong> ${totalPaid.toFixed(2)}</p>
                  <p><strong>Remaining Balance:</strong> ${remainingBalance.toFixed(2)}</p>
                </div>
                <div>
                  <p><strong>Status:</strong> <Badge>{order.status}</Badge></p>
                  <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(order.updated_at).toLocaleString()}</p>
                  <StarRating displayMode={true} maxStars={order.importance} />
                </div>
                <div>
                  {order.note && <p><strong>Note:</strong> {order.note}</p>}
                  </div>
              </div>)
            }
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
        <hr className='mb-6' />
        <Dialog  open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-2">Add Payment</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <form onSubmit={(e) => { e.preventDefault(); handleAddPayment(); }} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={newPayment.amount}
              onChange={(e) =>{ 
                setNewPayment({ ...newPayment, amount:Math.min(remainingBalance, Math.max(0, parseFloat(e.target.value) ))  });
            }}
              required
            />
            <input id='max' type='checkbox' checked={newPayment.amount == remainingBalance} onChange={()=>setNewPayment({ ...newPayment, amount:remainingBalance })} />
            <label htmlFor="max">max</label> <span>kalan - {remainingBalance-newPayment.amount}</span>
          </div>
          <div>
            <Label htmlFor="method">Payment Method</Label>
            <Select
              value={newPayment.method}
              onValueChange={(value) => setNewPayment({ ...newPayment, method: value as Payment['method'] })}
            >
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
            <Label htmlFor="status">Payment Status</Label>
            <Select
              value={newPayment.status}
              onValueChange={(value) => setNewPayment({ ...newPayment, status: value as Payment['status'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="orderNote">Payment Note</Label>
            <Textarea
              id="orderNote"
              value={newPayment.note}
              onChange={(event) => setNewPayment({ ...newPayment, note: event.target.value })}

              placeholder="Add any additional notes here"
            />
          </div>
          <Button type="submit">Add Payment</Button>
        </form>
          </DialogHeader>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle>
                <CardTitle>Payment History</CardTitle>
              </CardTitle>
          </CardHeader>
          <CardContent>
            {order.payments && order.payments.length > 0 ? (
              <table className="w-full ">
                <thead>
                  <tr>
                    <th className="text-left">Date</th>
                    <th className="text-left">Amount</th>
                    <th className="text-left">Method</th>
                    <th className="text-left">Note</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>
                <tbody className='space-y-12'>
                  {order.payments.map((payment) => (
                  
                    <tr className='h-9' key={payment.id}>
                      <td>{new Date(payment.created_at).toLocaleString()}</td>
                      <td>${payment.amount.toFixed(2)}</td>
                      <td>{payment.method}</td>
                      <td>{payment.note}</td>
                      <td><Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>{payment.status}</Badge></td>
                      <td><TrashIcon className="w-8 h-8 p-1  cursor-pointer text-red-500 hover:bg-slate-200 rounded" onClick={() => handleDeletePayment(payment.id)}/></td>
                    </tr>
                    
                    ))}
                </tbody>
              </table>
            ) : (
              <p>No payments recorded for this order.</p>
            )}


          </CardContent>
        </Card>


        

        

        <Button variant="destructive" className='mt-8' onClick={() => handleDeleteOrder(id)}>Delete Order</Button>

      </main>
    </div>
  )
}

