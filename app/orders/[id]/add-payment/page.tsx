'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Payment } from '@/types'
import { Textarea } from '@/components/ui/textarea'

export default function AddPayment() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<Payment['method']>('credit_card')
  const [note, setNote] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const  {id}  = useParams<{ id: string; }>()
  
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: id,
          amount: parseFloat(amount),
          method,
          note,
          status: 'completed', // You might want to adjust this based on your payment flow
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to add payment')
      }

      toast({
        title: "Payment added",
        description: "The payment has been successfully added to the order.",
      })
      router.push(`/orders/${id}`)
    } catch (error) {
      console.error('Error adding payment:', error)
      toast({
        title: "Error",
        description: "There was an error adding the payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Add Payment to Order #{id}</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="method">Payment Method</Label>
            <Select value={method} onValueChange={(value: Payment['method']) => setMethod(value)}>
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
            <Label htmlFor="orderNote">Payment Note</Label>
            <Textarea
              id="orderNote"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any additional notes here"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding Payment...' : 'Add Payment'}
          </Button>
        </form>
      </main>
    </div>
  )
}

