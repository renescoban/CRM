import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Contact, Activity, CustomField, Order } from '@/types'
import { ContactModel } from '@/models/ContactModel'
import { Badge } from "@/components/ui/badge"
import ActivityList from '@/components/ActivityList'
import { ActivityModel } from '@/models/ActivityModel'
import { OrderModel } from '@/models/OrderModel'
import OrderList from '@/components/OrderList'


async function getContactData(id: string){
  const contact = await ContactModel.getById(id)
  return contact 
}
async function getActivityData(id: string){
  const activities = await ActivityModel.getByContactId(id)
  return activities 
}
async function getOrderData(id: string){
  const orders = await OrderModel.getByContactId(id)
  return orders 
}

export default async function ContactDetails({ params }: { params: Promise<{ id: string }> }) {
  const{ id }= await params
  const  contact: Contact  = await getContactData(id)
  const  activities: Activity[]  = await getActivityData(id)
  const  orders: Order[]  = await getOrderData(id)

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contact Details</h1>
          <div>
            <Link href={`/contacts/${id}/edit`}>
              <Button className="mr-2">Edit</Button>
            </Link>
            <Button variant="destructive">Delete</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Name:</strong> { contact.name }</p>
                  <p><strong>Email:</strong> { contact.email }</p>
                  <p><strong>Phone:</strong> { contact.phone }</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
              {orders.length > 0 ? (
                  <OrderList orders={orders} />
                ) : (
                  <p>No orders available for this contact.</p>
                )}
              </CardContent>
            </Card>
          </div>
          <div className=''>
            <ActivityList activities = {activities} />
          </div>

          
        </div>
      </main>
    </div>
  )
}

