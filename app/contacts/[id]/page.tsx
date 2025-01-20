"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Contact, Activity, CustomField, Order, Tag } from '@/types'
import ActivityList from '@/components/ActivityList'
import OrderList from '@/components/OrderList'
import ContactInfo from './ContactInfo'
import { useParams } from 'next/navigation'

import { useEffect, useState } from 'react'

export default  function ContactDetails() {

   const { id } = useParams<{ id: string; }>()
  const [contact, setContact] = useState<Contact | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const updateActivity = async ()=>{
    const activitiesRes = await fetch(`/api/contacts/${id}/activities`)
    if(!activitiesRes.ok){
      const error = await activitiesRes.text();
      console.error("error updating activities: ", error)
      throw new Error(error);
    }
    setActivities(await activitiesRes.json() )
  }
  const updateTag = async ()=>{
    const tagsRes = await fetch(`/api/contacts/${id}/tags`)
    if(!tagsRes.ok){
      const error = await tagsRes.text();
      console.error("error updating tags: ", error)
      throw new Error(error);
    }
    setTags(await tagsRes.json() )
  }
  const updateContact = async ()=>{
    const contactRes = await fetch(`/api/contacts/${id}`)
    if(!contactRes.ok){
      const error = await contactRes.text();
      console.error("error updating activities: ", error)
      throw new Error(error);
    }
    setContact(await contactRes.json() )
  }
  
  const fetchContactData = async () => {
    try {
      const [contactRes, activitiesRes, ordersRes, tagsRes] = await Promise.all([
        fetch(`/api/contacts/${id}`),
        fetch(`/api/contacts/${id}/activities`),
        fetch(`/api/contacts/${id}/orders`),
        fetch(`/api/contacts/${id}/tags`)
      ])

      if (!contactRes.ok || !activitiesRes.ok || !ordersRes.ok || !tagsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [contactData, activitiesData, ordersData, tagsData] = await Promise.all([
        contactRes.json(),
        activitiesRes.json(),
        ordersRes.json(),
        tagsRes.json()
      ])

      setContact(contactData)
      setActivities(activitiesData)
      setOrders(ordersData)
      setTags(tagsData)
    } catch (error) {
      console.error('Error fetching contact data:', error)

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContactData()
  }, [id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!contact) {
    return <div>Contact not found</div>
  }
  
  return (
    <div className="min-h-screen ">
      <title>{"Contact id"}</title>
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contact Details</h1>
          <div>
          
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
          <ContactInfo contact={contact} tags={tags} onContactChange={updateContact} onTagsChange={updateTag}/>
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
            <ActivityList contactId={id} activities = {activities} onActivityChange={updateActivity}/>
          </div>

          
        </div>
      </main>
    </div>
  )
}

