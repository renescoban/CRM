import { OrderModel } from '@/models/OrderModel'
import { checkAuth } from '@/utils/utils'

export async function GET() {
    const authCheck = await checkAuth(true)
    if (authCheck) return authCheck

  try {
    const orders = await OrderModel.getAll()
    return Response.json(orders)
  } catch (error) {
    console.error('Error in GET /api/orders:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authCheck = await checkAuth(true)
  if (authCheck) return authCheck
  
  try {
    const orderData = await request.json()
    const newOrder = await OrderModel.create(orderData)
    return Response.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/orders:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

