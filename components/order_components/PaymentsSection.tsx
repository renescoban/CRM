// PaymentsSection.tsx
import { useState } from 'react'
import { Order, Payment } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrashIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PaymentsSectionProps {
  order: Order
  payments: Payment[]
  setPayments: (payments: Payment[]) => void
  remainingBalance: number
  onPaymentUpdate: () => void
}

export default function PaymentsSection({
  order,
  payments,
  setPayments,
  remainingBalance,
  onPaymentUpdate
}: PaymentsSectionProps) {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPayment, setNewPayment] = useState<Omit<Payment, 'id' | 'created_at' | 'updated_at'>>({
    amount: 0,
    method: 'credit_card',
    status: 'completed',
    order_id: order.id
  })

  const handleAddPayment = async () => {
    try {
      const res = await fetch(`/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment),
      })

      if (!res.ok) throw new Error('Failed to add payment')

      const addedPayment = await res.json()
      setPayments([...payments, addedPayment])
      setIsAddDialogOpen(false)
      setNewPayment({
        amount: 0,
        method: 'credit_card',
        status: 'completed',
        order_id: order.id
      })
      onPaymentUpdate()

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentId),
      })

      if (!res.ok) throw new Error('Failed to delete payment')

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

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-2">Add Payment</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Payment</DialogTitle>
            <form onSubmit={(e) => { e.preventDefault(); handleAddPayment(); }} className="space-y-4">
              {/* Payment form fields */}
              {/* ... (same as original) ... */}
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Date</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Method</th>
                  <th className="text-left">Note</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="space-y-12">
                {payments.map((payment) => (
                  <tr className="h-9" key={payment.id}>
                    <td>{new Date(payment.created_at).toLocaleString()}</td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td>{payment.method}</td>
                    <td>{payment.note}</td>
                    <td>
                      <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td>
                      <TrashIcon 
                        className="w-8 h-8 p-1 cursor-pointer text-red-500 hover:bg-slate-200 rounded" 
                        onClick={() => handleDeletePayment(payment.id)} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No payments recorded for this order.</p>
          )}
        </CardContent>
      </Card>
    </>
  )
}