// OrderHeader.tsx
import { Button } from "@/components/ui/button"

interface OrderHeaderProps {
  orderId: string
  isEditing: boolean
  setIsEditing: (value: boolean) => void
}

export default function OrderHeader({ orderId, isEditing, setIsEditing }: OrderHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold block">Order #{orderId}</h1>
      {!isEditing && (
        <Button onClick={() => setIsEditing(true)}>Edit Order</Button>
      )}
    </div>
  )
}