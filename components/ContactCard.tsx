import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Contact {
  id: number
  name: string
  email: string
  phone: string
}

export default function ContactCard({ contact }: { contact: Contact }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>{contact.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-1">Email: {contact.email}</p>
        <p className="text-sm text-gray-600">Phone: {contact.phone}</p>
      </CardContent>
    </Card>
  )
}

