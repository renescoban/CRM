import { ActivityModel } from '@/models/ActivityModel'
import { checkAuth } from '@/utils/utils'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authCheck = await checkAuth(true)
  if (authCheck) return authCheck

  const  id  = (await params).id

  try {
    const activity = await ActivityModel.getById(id)
    return Response.json(activity)
  } catch (error) {
    return Response.json({ error: 'Error fetching activity' }, { status: 500 })
  }
}

export async function PUT(  request: Request,  { params }: { params: Promise<{ id: string }> }) {
  const authCheck = await checkAuth(true)
  if (authCheck) return authCheck
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
  const authCheck = await checkAuth(true)
  if (authCheck) return authCheck

  const  id  = (await params).id 

  try {
  await ActivityModel.delete(id)
    return new Response(null, {
      status: 204,
    })
  } catch (error) {
    return Response.json({ error: 'Error deleting activity' }, { status: 500 });
  }
}