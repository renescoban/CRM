import { TagModel } from "@/models/TagsModel"
import { checkAuth } from "@/utils/utils"

export async function GET( req: Request  ) {
  const authCheck = await checkAuth(true)
  if (authCheck) return authCheck
  
    try {
    const tags = await TagModel.getAll()
    return Response.json(tags)
  } catch (error) {
    console.error(`Error in GET /api/tags:`, error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}