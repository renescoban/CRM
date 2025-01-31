import { createClient } from "@/utils/supabase/server"
import { ContactModel } from '@/models/ContactModel'
import { checkAuth } from "@/utils/utils"

export async function GET() {
    const authCheck = await checkAuth(true)
    if (authCheck) return authCheck
    
  try {
    const contacts = await ContactModel.getAll()
    return Response.json(contacts)
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
    const authCheck = await checkAuth(true)
    if (authCheck) return authCheck

  try {
    const contactData = await request.json()
    const newContact = await ContactModel.create(contactData)
    return Response.json(newContact, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}