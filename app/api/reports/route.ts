import { ContactModel } from "@/models/ContactModel"
import { OrderModel } from "@/models/OrderModel"
import { NextResponse } from "next/server"

export async function GET( req : Request ){
    try {
        const orders = await OrderModel.getAll()
        const contacts = await ContactModel.getAll()
    
        // Calculate metrics
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
        const totalOrders = orders.length
        const AOV = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
        const customerData = contacts.map((contact) => {
          const customerOrders = orders.filter((order) => order.contact_id === contact.id)
          const customerRevenue = customerOrders.reduce((sum, order) => sum + order.total, 0)
          const firstOrderDate = new Date(Math.min(...customerOrders.map((o) => new Date(o.created_at).getTime())))
          const lastOrderDate = new Date(Math.max(...customerOrders.map((o) => new Date(o.created_at).getTime())))
          const daysSinceFirstOrder = (new Date().getTime() - firstOrderDate.getTime()) / (1000 * 3600 * 24)
    
          return {
            id: contact.id,
            revenue: customerRevenue,
            orderCount: customerOrders.length,
            firstOrderDate,
            lastOrderDate,
            daysSinceFirstOrder,
          }
        })
    
        const totalCustomers = customerData.length
        const CLV = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
    
        // Calculate retention rate (simplified: customers with more than one order)
        const repeatCustomers = customerData.filter((c) => c.orderCount > 1).length
        const retentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0
    
        // Prepare data for predictive analytics
        const last12Months = Array.from({ length: 12 }, (_, i) => {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          return date.toISOString().slice(0, 7) // YYYY-MM format
        }).reverse()
    
        const monthlySales = last12Months.map((month) => {
          const monthOrders = orders.filter((order) => order.created_at.startsWith(month))
          return {
            month,
            sales: monthOrders.reduce((sum, order) => sum + order.total, 0),
          }
        })
    
        return NextResponse.json({
          totalRevenue,
          totalOrders,
          AOV,
          CLV,
          retentionRate,
          customerData,
          monthlySales,
        })
      } catch (error) {
        console.error("Error in GET /api/reports:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
      }
}