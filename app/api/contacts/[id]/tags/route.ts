import { TagModel } from "@/models/TagsModel"
import { createClient } from "@/utils/supabase/server"


import { OrderModel } from "@/models/OrderModel"

export async function GET( req: Request ,{ params }: { params:Promise<{ id: string }> } ) {
    const  {id}  = await params
  try {
    const tags = await TagModel.getByContactId(id)
    return Response.json(tags)
  } catch (error) {
    console.error(`Error in GET /api/contacts/${id}/tags:`, error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const  id  = (await params).id 

    try {
      const  tagName  = await request.json()
      
      let tag = await TagModel.getAll().then(tags => tags.find(t => t.name === tagName))
      console.log("before tag",tag)
      if (!tag) {
        tag = await TagModel.create({ name: tagName })
      }
      console.log("tag",tag)
      // Then, add the tag to the contact
      const { data, error } = await supabase
        .from('contact_tags')
        .insert({ contact_id: id, tag_id: tag.id })
        .select()
        console.log("DATA: ",data)
        console.error("data error:", error);
        return Response.json(data, { status: 201 })
      } catch (error) {
        console.error(`Error in POST /api/contacts/${id}/tags:`, error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
      }
}

export async function DELETE(request: Request) {
  try {
    const tagID = await request.json()
    await TagModel.delete(tagID)
    return Response.json({ message: 'Tag deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error in DELETE /api/con/id/tag:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}