import { TagModel } from "@/models/TagsModel"
import { createClient } from "@/utils/supabase/server"


export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const  id  = (await params).id 

    try {
        const { tagName } = await request.json()
        // First, check if the tag exists, if not create it
      let tag = await TagModel.getAll().then(tags => tags.find(t => t.name === tagName))
      if (!tag) {
        tag = await TagModel.create({ name: tagName })
      }

      // Then, add the tag to the contact
      const { data, error } = await supabase
        .from('contact_tags')
        .insert({ contact_id: id, tag_id: tag.id })
        .select()
        return Response.json(data, { status: 201 })
      } catch (error) {
        console.error(`Error in POST /api/contacts/${id}/tags:`, error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
      }

}