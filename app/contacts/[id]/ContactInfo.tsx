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
import { Tag } from "@/types"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company?:string;
  address?: string;
  website?:string
}


interface ContactInfoProps {
  contact: Contact | null
  tags: Tag[];
  onContactChange: () => void
  onTagsChange: () => void
}

export default function ContactInfo({ contact, tags, onContactChange, onTagsChange }: ContactInfoProps) {

  const [name, setName] = useState(contact?.name)
  const [email, setEmail] = useState(contact?.email)
  const [phone, setPhone] = useState(contact?.phone)
  const [isEditing, setIsEditing] = useState(false)
  const [company, setCompany] = useState("")
  const [address, setAddress] = useState("")
  const [website, setWebsite] = useState("")
  const [newTag, setNewTag] = useState("")

  const { toast } = useToast()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/contacts/${contact?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          address,
          website
        }),
      })

      if (!res.ok) {
        // Handle API errors here (e.g., status code errors)
        const error = await res.text();
        console.error("Update contact API error:", error);
        throw new Error(error);
      }
      onContactChange()
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
      const res = await fetch(`/api/contacts/${contact?.id}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          newTag,
        ),
      })
      if (!res.ok) {
        // Handle API errors here (e.g., status code errors)
        const error = await res.text();
        console.error("Update contact API error:", error);
        throw new Error(error);
      }
      onTagsChange()
      setNewTag("")
      toast({
        title: "Tag Added",
        description: "The contact tag information has been successfully added.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding the tag. Please try again.",
        variant: "destructive",
      })
    }
  }
  const handleDeldeteTag = async (tagId: string) => {
    try {
      const res = await fetch(`/api/contacts/${contact?.id}/tags`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagId),
      })
      if (!res.ok) {
        // Handle API errors here (e.g., status code errors)
        const error = await res.text();
        console.error("Update contact API error:", error);
        throw new Error(error);
      }
      onTagsChange()

      toast({
        title: "Tag deleted",
        description: "The contact tag information has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the tag. Please try again.",
        variant: "destructive",
      })
    }
  }


  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle>Contact Information</CardTitle>
          <Button className="mr-2" onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</Button>
        </div>
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

              {/* <Button type="submit">Save Changes</Button> */}
            </form>
            <hr className="my-2 " />
            <Tabs defaultValue="fields" className="w-full ">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fields">Custom Fields</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>

              <TabsContent value="fields">
                <Card>
                  <CardHeader>
                    <CardTitle>More Fields</CardTitle>
                    <CardDescription>Manage additional information about the contact</CardDescription>
                  </CardHeader>
                  <CardContent>

                    {/* onSubmit={handleAddCustomField} */}
                    <form className=" space-y-4">
                      <div>
                        <Label htmlFor="sirket">şirket</Label>
                        <Input
                          id="sirket"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="adres">adres Name</Label>
                        <Input
                          id="adres"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">website Name</Label>
                        <Input
                          id="website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          required
                        />
                      </div>
                      <Button onClick={handleUpdate}>Save Changes</Button>


                    </form>
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
                          <button className="ml-2 text-xs" onClick={() => handleDeldeteTag(tag.id)}>&times;</button>
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
            <p><strong>Name:</strong> {contact?.name}</p>
            <p><strong>Email:</strong> {contact?.email}</p>
            <p><strong>Phone:</strong> {contact?.phone}</p>
            
            {contact?.company ? <p><strong>Company:</strong> {contact.company}</p> : null }
            {contact?.address ? <p><strong>Address:</strong> {contact.address}</p> : null }
            {contact?.website ? <p> <strong>Website:</strong><Link className="text-blue-600 hover:text-blue-800" href={contact.website}> {contact?.website}</Link></p> : null }
            {tags.map(tag => (
                        <Badge key={tag.id} variant="secondary" className="text-sm cursor-default">
                          {tag.name}
                        </Badge>
                      ))}
          </div>
        )
        }
      </CardContent >
    </Card >
  )

}
