import { PaymentModel } from "@/models/PaymentModel"


export async function POST(request: Request) {
    try {
      const paymentData = await request.json()
      const newPayment = await PaymentModel.create(paymentData)
      return Response.json(newPayment, { status: 201 })
    } catch (error) {
      console.error('Error in POST /api/payments:', error)
      return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }