"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Contact } from '@/types'
import { useState } from "react";
import ContactCard from "./ContactCard";

export function ContactsContent({ contacts }: { contacts: Contact[] }) {
    const [searchTerm, setSearchTerm] = useState('');
  
    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
    );
  
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contacts</h1>
          <Link href="/contacts/add">
            <Button>Add New Contact</Button>
          </Link>
        </div>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Link key={contact.id} href={`/contacts/${contact.id}`}>
              <ContactCard contact={contact} />
            </Link>
          ))}
        </div>
      </main>
    );
  }
  