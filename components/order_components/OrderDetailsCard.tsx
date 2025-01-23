// OrderDetailsCard.tsx
import { useState } from 'react'
import { Order } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import StarRating from '@/components/StarRating'

interface OrderDetailsCardProps {
  order: Order
  setOrder: (order: Order) => void
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  totalPaid: number
  remainingBalance: number
  onOrderUpdate: () => void
}

export default function OrderDetailsCard({
  order,
  setOrder,
  isEditing,
  setIsEditing,
  totalPaid,
  remainingBalance,
  onOrderUpdate
}: OrderDetailsCardProps) {
  const { toast } = useToast()
  const [editedOrder, setEditedOrder] = useState({
    status: order.status,
    note: order.note,
    importance: order.importance,
    products: order.products
  })
  const [newTag, setNewTag] = useState("")

  const handleEditOrder = async () => {
    try {
      const total = editedOrder.products.reduce((sum, product) => sum + product.price * product.count, 0)
      
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editedOrder, total, remaining_balance: remainingBalance }),
      })

      if (!res.ok) throw new Error(await res.text())

      onOrderUpdate()
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

  const handleAddTag = async () => {
    if (!newTag.trim()) return

    try {
      const res = await fetch(`/api/orders/${order.id}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTag.trim() }),
      })

      if (!res.ok) throw new Error("Failed to add tag")

      const addedTag = await res.json()
      setOrder({
        ...order,
        tags: [...(order.tags || []), addedTag],
      })
      setNewTag("")
      toast({
        title: "Tag added",
        description: "The tag has been successfully added to the order.",
      })
    } catch (error) {
      console.error("Error adding tag:", error)
      toast({
        title: "Error",
        description: "Failed to add the tag. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
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

            <StarRating 
              displayMode={false} 
              maxStars={3} 
              onChange={(value) => setEditedOrder({ ...editedOrder, importance: value })} 
            />

            <div>
              <Label htmlFor="note">Order Note</Label>
              <Textarea
                id="note"
                value={editedOrder.note || ''}
                onChange={(e) => setEditedOrder({ ...editedOrder, note: e.target.value })}
                placeholder="Add any additional notes here"
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-x-4">
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
            {order.note && <p><strong>Note:</strong> {order.note}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}