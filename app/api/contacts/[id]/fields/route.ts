import { NextRequest, NextResponse } from 'next/server'


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    
    return NextResponse.json("activities")
  } catch (error) {
    console.error(`Error in GET /api/contacts/${params.id}/activities:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

