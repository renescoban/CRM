import { createClient } from "@/utils/supabase/server"
import { ActivityModel } from '@/models/ActivityModel'

export async function GET() {
  try {
    const contacts = await ActivityModel.getAll()
    return Response.json(contacts)
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
	const supabase = createClient()

  try {
    const contactData = await request.json()
    const newContact = await ActivityModel.create(contactData)
    return Response.json(newContact, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}