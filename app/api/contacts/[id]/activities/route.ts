import { NextRequest, NextResponse } from 'next/server'
import { ActivityModel } from '@/models/ActivityModel'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const activities = await ActivityModel.getById(params.id)
    return NextResponse.json(activities)
  } catch (error) {
    console.error(`Error in GET /api/contacts/${params.id}/activities:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

