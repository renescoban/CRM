import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ActivityList from '@/components/ActivityList'
import { Contact, Activity, CustomField } from '@/types'

async function getContactData(id: string): Promise<{
  contact: Contact;
}> {
  const contactRes = await fetch(`/api/contacts/${id}`, { cache: 'no-store' })
  if (!contactRes.ok) {
    notFound()
  }
  const contact = await contactRes.json()
  return { contact }
}

export default async function ContactDetails({ params }: { params: Promise<{ id: string }> }) {
  const{ id }= await params
  const { contact } = await getContactData(id)

  return (
    <div className="min-h-screen bg-gray-100">
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
                  <p><strong>Name:</strong> {contact.name}</p>
                  <p><strong>Email:</strong> {contact.email}</p>
                  <p><strong>Phone:</strong> {contact.phone}</p>
                </div>
              </CardContent>
            </Card>

           

            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Orders functionality to be implemented</p>
              </CardContent>
            </Card>
          </div>

          
        </div>
      </main>
    </div>
  )
}

