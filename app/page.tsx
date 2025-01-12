import Hero from "@/components/hero";
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Reminders from '@/components/Reminders'

export default async function Home() {
  // const recentActivities = contacts
  //   .flatMap(contact => contact.activities.map(activity => ({ ...activity, contactName: contact.name })))
  //   .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  //   .slice(0, 5)
  return (
    <>
      {/* <Hero /> */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">contacts length</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
               
                  <li  className="text-sm">
                    <span className="font-semibold capitalize">type</span> with contactName - date
                  </li>
            
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link className="mb-2" href="/contacts/add">
                <Button className="w-full">Add New Contact</Button>
              </Link>
              <Link href="/contacts">
                <Button variant="outline" className="w-full">View All Contacts</Button>
              </Link>
            </CardContent>
          </Card>
          reminders
          {/* <Reminders activities={contacts.flatMap(contact => contact.activities)} /> */}
        </div>
      </main>
    </>
  );
}
