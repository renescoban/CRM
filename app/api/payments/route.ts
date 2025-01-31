import { PaymentModel } from "@/models/PaymentModel"
import { checkAuth } from "@/utils/utils"

export async function POST(request: Request) {
    const authCheck = await checkAuth(true)
    if (authCheck) return authCheck

  try {
    const paymentData = await request.json()
    const newPayment = await PaymentModel.create(paymentData)
    return Response.json(newPayment, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/payments:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
export async function DELETE(request: Request) {
    const authCheck = await checkAuth(true)
    if (authCheck) return authCheck
    
  try {
    const paymentID = await request.json()
    console.log(typeof(paymentID))
    await PaymentModel.delete(paymentID)
    return Response.json({ message: 'Payment deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error in DELETE /api/payments:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}