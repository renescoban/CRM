import { TagModel } from "@/models/TagsModel"

export async function GET( req: Request  ) {

    try {
    const tags = await TagModel.getAll()
    return Response.json(tags)
  } catch (error) {
    console.error(`Error in GET /api/tags:`, error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}