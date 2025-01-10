import { createClient } from "@/utils/supabase/server"
import { ContactModel } from '@/models/ContactModel'

export async function GET() {
  try {
    const contacts = await ContactModel.getAll()
    return Response.json(contacts)
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const contactData = await request.json()
    const newContact = await ContactModel.create(contactData)
    return Response.json(newContact, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}