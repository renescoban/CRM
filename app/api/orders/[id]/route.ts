import { createClient } from "@/utils/supabase/server"
import { OrderModel } from '@/models/OrderModel'

type Params = Promise<{ id: string }>;

export async function GET(req: Request,{ params }: { params:Params }) {
  const  {id}  = await params

const supabase = createClient()
    const { data: { user } } = await (await supabase).auth.getUser()
    
    if (!user) {
        return Response.json({ error: 'Unauthorized' },{status:500})
    }
    
  try {
    const order = await OrderModel.getById(id)
    console.log(order);
    return Response.json(order)
  } catch (error) {
    return Response.json({ error: 'Error fetching users' }, { status: 500 })
  }
}