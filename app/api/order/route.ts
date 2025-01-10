import { NextRequest, NextResponse } from 'next/server'
import { OrderModel } from '@/models/OrderModel'

export async function GET() {
  try {
    const orders = await OrderModel.getAll()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error in GET /api/orders:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    const newOrder = await OrderModel.create(orderData)
    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/orders:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

