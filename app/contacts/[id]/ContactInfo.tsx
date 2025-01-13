'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@radix-ui/react-label"

import Link from "next/link"
import { ReactNode, useState } from "react"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
}
interface Tag {
  id: string
  name: string
  created_at: string
  updated_at: string
}
interface ContactInfoProps {
  contact:Contact
  tags: Tag[];
}

export default function ContactInfo({ contact, tags }:  ContactInfoProps  ){
  const [name, setName] = useState(contact.name)
  const [email, setEmail] = useState(contact.email)
  const [phone, setPhone] = useState(contact.phone)
  const [isEditing, setIsEditing] = useState(false)
  const [newCustomFieldName, setNewCustomFieldName] = useState("")
  const [newCustomFieldValue, setNewCustomFieldValue] = useState("")
  const [tagsX, setTags] = useState(tags)
  const [newTag, setNewTag] = useState("")

  const { toast } = useToast()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
        }),
      })
      setIsEditing(false)
      toast({
        title: "Contact updated",
        description: "The contact information has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the contact. Please try again.",
        variant: "destructive",
      })
    }
  }
  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/contacts/${contact.id}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name:newTag,
        }),
      })
      toast({
        title: "Contact updated",
        description: "The contact tag information has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the tags. Please try again.",
        variant: "destructive",
      })
    }
  }


  return (
    <Card>
      <CardHeader className='flex justify-between items-center'>
        <CardTitle>Contact Information</CardTitle>
        
        <Button className="mr-2" onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</Button>
        
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <Button type="submit">Save Changes</Button>
            </form>

            <Tabs defaultValue="tags" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>

              <TabsContent value="custom-fields">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Fields</CardTitle>
                    <CardDescription>Manage additional information about the contact</CardDescription>
                  </CardHeader>
                  <CardContent>field
                    {/* {customFields && customFields.map((field) => (
                      <div key={field.id} className="mb-2">
                        <strong>{field.name}:</strong> {field.value}
                      </div>
                    ))}
                    <form onSubmit={handleAddCustomField} className="mt-4 space-y-4">
                      <Label htmlFor="customFieldName">Field Name</Label>
                      <Input
                        id="customFieldName"
                        value={newCustomFieldName}
                        onChange={(e) => setNewCustomFieldName(e.target.value)}
                        required
                      />
                      <Label htmlFor="customFieldValue">Field Value</Label>
                      <Input
                        id="customFieldValue"
                        value={newCustomFieldValue}
                        onChange={(e) => setNewCustomFieldValue(e.target.value)}
                        required
                      />

                      <Button type="submit">Add Custom Field</Button>
                    </form> */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tags">
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                    <CardDescription>Manage tags associated with this contact</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tags.map(tag => (
                        <Badge key={tag.id} variant="secondary" className="text-sm">
                          {tag.name}
                          <button className="ml-2 text-xs">&times;</button>
                        </Badge>
                      ))}
                    </div>
                    <form onSubmit={handleAddTag} className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="New tag"
                        className="flex-grow"
                      />
                      <Button type="submit">Add Tag</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>
        ) : (
          <div className="space-y-2">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
          </div>
        )
        }
      </CardContent >
    </Card >
  )

}