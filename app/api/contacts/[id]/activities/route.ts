import { ActivityModel } from "@/models/ActivityModel"


export async function GET( req: Request ,{ params }: { params:Promise<{ id: string }> } ) {
    const  {id}  = await params
  try {
    const activities = await ActivityModel.getByContactId(id)
    return Response.json(activities)
  } catch (error) {
    console.error(`Error in GET /api/contacts/${id}/activities:`, error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
export async function POST( req: Request ,{ params }: { params:Promise<{ id: string }> } ) {
  const  {id}  = await params
try {
  const activityData = await req.json()
  const newActivity = await ActivityModel.create(activityData)
  return Response.json(newActivity, {status:200})
} catch (error) {
  console.error(`Error in GET /api/contacts/${id}/activities:`, error)
  return Response.json({ error: 'Internal Server Error' }, { status: 500 })
}
}

