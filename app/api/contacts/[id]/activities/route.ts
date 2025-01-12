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

