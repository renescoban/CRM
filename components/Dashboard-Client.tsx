'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Contact, Order, Activity } from '../types'
import { useToast } from '@/hooks/use-toast'

interface DashboardClientProps {
  initialContacts: Contact[]
  initialOrders: Order[]
  initialActivities: Activity[]
}

export default function DashboardClient({
  initialContacts,
  initialOrders,
  initialActivities
}: DashboardClientProps) {
  const [contacts] = useState<Contact[]>(initialContacts)
  const [orders] = useState<Order[]>(initialOrders)
  const [activities] = useState<Activity[]>(initialActivities)
  const { toast } = useToast()

  const today = new Date()
  const getReminders = () => {
    const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return activities
      .filter(activity => 
        new Date(activity.date) > today &&
        new Date(activity.date) <= oneWeekFromNow
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const recentActivities = activities
    .filter(activity => new Date(activity.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalPaid = orders.reduce((sum, order) => {
    const paidAmount = order.payments?.reduce((paidSum, payment) => paidSum + payment.amount, 0) || 0
    return sum + paidAmount
  }, 0)
  const pendingPayments = totalRevenue - totalPaid

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{contacts.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities <Link href="/activities">
                <Button variant="outline" size={"sm"}>More {"->"} </Button>
              </Link></CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recentActivities.slice(0, 3).map((activity) => (
                  <li key={activity.id} className="text-sm">
                    <span className="font-semibold capitalize">{activity.type}</span> with <Link className='font-semibold text-blue-600 hover:underline' href={`/contacts/${activity.contact_id}`}>{activity.contacts.name}</Link> 
                    <br />
                    {activity.description.slice(0, 50)}...
                    <br />
                    <span className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</span>
                    <hr />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-1 gap-y-2">
              <Link href="/contacts/add">
                <Button className="w-full">Add New Contact</Button>
              </Link>
              <Link href="/contacts">
                <Button variant="outline" className="w-full">View All Contacts</Button>
              </Link>
              <Link href="/orders">
                <Button className="w-full">View Orders</Button>
              </Link>
              <Link href="/orders/make">
                <Button variant="outline" className="w-full">Make an order</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getReminders().map((reminder) => (
                  <li key={reminder.id} className="text-sm">
                    <span className="font-semibold capitalize">{reminder.type}</span> with <Link className='font-semibold text-blue-600 hover:underline' href={`/contacts/${reminder.contact_id}`}>{reminder.contacts.name}</Link> 
                    <br />
                    {reminder.description.slice(0, 50)}...
                    <br />
                    <span className="text-xs text-gray-500">{new Date(reminder.date).toLocaleDateString()}</span>
                    <hr />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">Total Revenue: <span className="font-bold">${totalRevenue.toFixed(2)}</span></p>
              <p className="text-sm mb-2">Total Paid: <span className="font-bold">${totalPaid.toFixed(2)}</span></p>
              <p className="text-sm">Pending Payments: <span className="font-bold">${pendingPayments.toFixed(2)}</span></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {orders.slice(0, 3).map((order) => (
                  <li key={order.id} className="text-sm">
                    <Link href={`/orders/${order.id}`} className="line-clamp-1 text-blue-600 hover:underline">
                      Order #{order.id}
                    </Link>
                    <span className="text-xs text-gray-500">
                      Total: ${order.total.toFixed(2)} - Status: {order.status} - Date: {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <hr />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}