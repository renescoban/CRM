import { checkAuth } from '@/utils/utils'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const authCheck = await checkAuth(true)
    if (authCheck) return authCheck
  
  const  id  = (await params).id 
  try {
    
    return NextResponse.json("activities")
  } catch (error) {
    console.error(`Error in GET /api/contacts/${id}/activities:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

