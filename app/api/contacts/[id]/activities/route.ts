import { NextRequest, NextResponse } from 'next/server'
import { ActivityModel } from '@/models/ActivityModel'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const  id  = (await params).id 
  try {
    const activities = await ActivityModel.getById(id)
    return NextResponse.json(activities)
  } catch (error) {
    console.error(`Error in GET /api/contacts/${id}/activities:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

