'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {  Loader2  } from 'lucide-react'


export default function AddContact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/contacts",{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({ name, email, phone }),
      })
      if (response.ok) {
        setName("")
        setEmail("")
        setPhone("")
  
        router.push('/contacts')
      } else console.error('Failed to add contact')
    } catch (error) {
      console.error('Error adding contact:', error)
    }finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="">
      <title>{"Add Contact"}</title>
       {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Add New Contact</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Add Contact</Button>
        </form>
      </main>
      }
    </div>
  )
}

