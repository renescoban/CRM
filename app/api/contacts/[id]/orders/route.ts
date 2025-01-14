import { OrderModel } from "@/models/OrderModel"

export async function GET( req: Request ,{ params }: { params:Promise<{ id: string }> } ) {
    const  {id}  = await params
  try {
    const orders = await OrderModel.getByContactId(id)
    return Response.json(orders)
  } catch (error) {
    console.error(`Error in GET /api/contacts/${id}/orders:`, error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}