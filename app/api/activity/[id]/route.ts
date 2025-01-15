import { createClient } from "@/utils/supabase/server"
import { ActivityModel } from '@/models/ActivityModel'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const  id  = (await params).id


  try {
    const activity = await ActivityModel.getById(id)
    return Response.json(activity)
  } catch (error) {
    return Response.json({ error: 'Error fetching activity' }, { status: 500 })
  }
}

export async function PUT(  request: Request,  { params }: { params: Promise<{ id: string }> }) {
  const  id  = (await params).id 

  try {
    const activityData = await request.json()
    const newActivity = await ActivityModel.update(id, activityData)
    return Response.json(newActivity, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Error updating activity' }, { status: 500 });
  }
}
export async function DELETE(  request: Request,  { params }: { params: Promise<{ id: string }> }) {
  const  id  = (await params).id 

 // const supabase = createClient();
  //const {    data: { user },  } = await (await supabase).auth.getUser();
  //if (!user) {    return Response.json({ error: "Unauthorized" }, { status: 500 });  }
  try {
  await ActivityModel.delete(id)
    return new Response(null, {
      status: 204,
    })
  } catch (error) {
    return Response.json({ error: 'Error deleting activity' }, { status: 500 });
  }
}