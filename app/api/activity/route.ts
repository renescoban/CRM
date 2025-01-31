import { createClient } from "@/utils/supabase/server"
import { ActivityModel } from '@/models/ActivityModel'
import { checkAuth } from "@/utils/utils"

export async function GET() {
  const authCheck = await checkAuth(true)
  if (authCheck) return authCheck

  try {
    const activities = await ActivityModel.getAll()
    return Response.json(activities)
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authCheck = await checkAuth(true)
  if (authCheck) return authCheck

  try {
    const contactData = await request.json()
    const newContact = await ActivityModel.create(contactData)
    return Response.json(newContact, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}