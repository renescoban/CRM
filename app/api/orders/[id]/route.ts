import { createClient } from "@/utils/supabase/server"
import { OrderModel } from '@/models/OrderModel'

type Params = Promise<{ id: string }>;

export async function GET(req: Request,{ params }: { params:Params }) {
  const  {id}  = await params


    
  try {
    const order = await OrderModel.getById(id)
    return Response.json(order)
  } catch (error) {
    return Response.json({ error: 'Error fetching users' }, { status: 500 })
  }
}
export async function PUT(req: Request,{ params }: { params:Params }) {
  const  {id}  = await params

  try {
    const orderData = await req.json()
    const order = await OrderModel.update(id, orderData )
    return Response.json(order, { status: 201 })
  } catch (error) {
    console.error("Update contact API error:", error);
    return Response.json({ error: 'Error updating orders' }, { status: 500 })
  }
}


export async function DELETE(request: Request) {
  try {
    const orderID = await request.json()
    await OrderModel.delete(orderID)
    return Response.json({ message: 'Order deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error in DELETE /api/orders/id:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}