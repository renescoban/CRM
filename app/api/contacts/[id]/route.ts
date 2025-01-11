import { createClient } from "@/utils/supabase/server"
import { ContactModel } from '@/models/ContactModel'

type Params = Promise<{ id: string }>;

export async function GET(req: Request,{ params }: { params:Params }) {
  const  {id}  = await params

const supabase = createClient()
    const { data: { user } } = await (await supabase).auth.getUser()
    
    if (!user) {
        return Response.json({ error: 'Unauthorized' },{status:500})
    }
	
  try {
    const contact = await ContactModel.getById(id)
    return Response.json(contact)
  } catch (error) {
    return Response.json({ error: 'Error fetching users' }, { status: 500 })
  }
}

export async function PUT(  request: Request,  { params }: { params:Params}) {
  const  {id}  = await params

  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 500 });
  }
  try {
    const contactData = await request.json()
    const newContact = await ContactModel.update(id, contactData)
    return Response.json(newContact, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Error updating user' }, { status: 500 });
  }
}
export async function DELETE( req: Request, { params }: { params: Params }) {
  const {id} = await params

  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 500 });
  }
  try {
  
    const newContact = await ContactModel.delete(id)
    return new Response(null, {
      status: 204,
    })
  } catch (error) {
    return Response.json({ error: 'Error deleting user' }, { status: 500 });
  }
}
