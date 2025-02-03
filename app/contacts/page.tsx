
import { Suspense } from 'react'
import {  Loader2  } from 'lucide-react'
import { ContactsContent } from '@/components/Contacts-Content'
import { getContacts } from '@/lib/actions'

export default async function Contacts() {
 const contacts = await getContacts()
  return (
    <div className="">
      <title>{"Contacts"}</title>
      <Suspense fallback={<Loader2 className="mr-2 h-4 w-4 animate-spin" />}>
          <ContactsContent contacts={contacts} />
       </Suspense>
    </div>
  )
}

