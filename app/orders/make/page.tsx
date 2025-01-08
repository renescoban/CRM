'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast'
import { contacts } from '@/data/contacts'
import { makeOrder } from '@/lib/actions'
import { Order } from '@/types'

export default function MakeOrder() {
  const router = useRouter()
  const [contactId, setContactId] = useState('')
  const [products, setProducts] = useState([{ name: '', price: 0, count: 1 }])
  const [status, setStatus] = useState<Order['status']>('pending')
  const [estimatedDelivery, setEstimatedDelivery] = useState('')
  const [orderNote, setOrderNote] = useState('')

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const total = products.reduce((sum, product) => sum + product.price * product.count, 0)
      await makeOrder({
        contactId: parseInt(contactId),
        products,
        total,
        status,
        estimatedDelivery,
        orderNote,
        payments: [],
        remainingBalance: total,
      })
      router.push('/orders')
      toast({
        title: "Order created",
        description: "The order has been successfully created.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addProduct = () => {
    setProducts([...products, { name: '', price: 0, count: 1 }])
  }

  const updateProduct = (index: number, field: string, value: string | number) => {
    const updatedProducts = [...products]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setProducts(updatedProducts)
  }

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Make New Order</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div>
            <Label htmlFor="contact">Contact</Label>
            <Select value={contactId} onValueChange={setContactId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id.toString()}>
                    {contact.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Products</Label>
            {products.map((product, index) => (
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
            <Button type="button" onClick={addProduct} className="mt-2">Add Product</Button>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: Order['status']) => setStatus(value)}>
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
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="orderNote">Order Note</Label>
            <Textarea
              id="orderNote"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Add any additional notes here"
            />
          </div>

          <Button type="submit">Create Order</Button>
        </form>
      </main>
    </div>
  )
}

