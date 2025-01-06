'use client'
import { use } from "react";
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import ActivityList from '@/components/ActivityList'
import { updateContact, deleteContact, addActivity, updateActivity, deleteActivity, addCustomField, addTag, removeTag } from '../../../lib/actions'
import { contacts } from '@/data/contacts'
import { Contact, Activity, ActivityType, CustomField } from '@/types'

export default function ContactDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params);
  const contact = contacts.find(c => c.id === parseInt(id))
  const { toast } = useToast()
  if (!contact) {
    return <div>Contact not found</div>
  }

  const [name, setName] = useState(contact.name)
  const [email, setEmail] = useState(contact.email)
  const [phone, setPhone] = useState(contact.phone)
  const [tags, setTags] = useState(contact.tags || [])
  const [isEditing, setIsEditing] = useState(false)
  const [newActivityType, setNewActivityType] = useState<ActivityType>('note')
  const [newActivityDescription, setNewActivityDescription] = useState('')
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [newCustomFieldName, setNewCustomFieldName] = useState('')
  const [newCustomFieldValue, setNewCustomFieldValue] = useState('')
  const [newTag, setNewTag] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateContact(contact.id, { name, email, phone })
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

  const handleDelete = async () => {
    try {
      await deleteContact(contact.id)
      setIsDeleteDialogOpen(false)
      router.push('/contacts')
      toast({
        title: "Contact deleted",
        description: "The contact has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the contact. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addActivity(contact.id, {
        type: newActivityType,
        description: newActivityDescription,
        date: new Date().toISOString().split('T')[0],
        dueDate: newActivityType === 'task' ? new Date().toISOString().split('T')[0] : undefined
      })
      setNewActivityType('note')
      setNewActivityDescription('')
      router.refresh()
      toast({
        title: "Activity added",
        description: "The new activity has been successfully added.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding the activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingActivity) {
      try {
        await updateActivity(editingActivity.id, editingActivity)
        setEditingActivity(null)
        router.refresh()
        toast({
          title: "Activity updated",
          description: "The activity has been successfully updated.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error updating the activity. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteActivity = async (activityId: number) => {
    try {
      await deleteActivity(activityId)
      router.refresh()
      toast({
        title: "Activity deleted",
        description: "The activity has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddCustomField = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addCustomField(contact.id, { name: newCustomFieldName, value: newCustomFieldValue })
      setNewCustomFieldName('')
      setNewCustomFieldValue('')
      router.refresh()
      toast({
        title: "Custom field added",
        description: "The new custom field has been successfully added.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding the custom field. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTag && !tags.includes(newTag)) {
      try {
        await addTag(contact.id, newTag)
        setTags([...tags, newTag])
        setNewTag('')
        toast({
          title: "Tag added",
          description: `The tag "${newTag}" has been successfully added.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error adding the tag. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleRemoveTag = async (tag: string) => {
    try {
      await removeTag(contact.id, tag)
      setTags(tags.filter(t => t !== tag))
      toast({
        title: "Tag removed",
        description: `The tag "${tag}" has been successfully removed.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error removing the tag. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contact Details</h1>
          <div>
            <Button onClick={() => setIsEditing(!isEditing)} className="mr-2">
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Delete</Button>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="custom-fields">Custom Fields</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>View and edit basic contact details</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
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
                ) : (
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Phone:</strong> {phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Activities</CardTitle>
                <CardDescription>Manage contact activities and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityList 
                  activities={contact.activities || []} 
                  onEdit={setEditingActivity} 
                  onDelete={handleDeleteActivity}
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4">Add New Activity</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Activity</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddActivity} className="space-y-4">
                      <div>
                        <Label htmlFor="activityType">Activity Type</Label>
                        <Select onValueChange={(value: ActivityType) => setNewActivityType(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="call">Call</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="note">Note</SelectItem>
                            <SelectItem value="task">Task</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="activityDescription">Description</Label>
                        <Textarea
                          id="activityDescription"
                          value={newActivityDescription}
                          onChange={(e) => setNewActivityDescription(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit">Add Activity</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom-fields">
            <Card>
              <CardHeader>
                <CardTitle>Custom Fields</CardTitle>
                <CardDescription>Manage additional information about the contact</CardDescription>
              </CardHeader>
              <CardContent>
                {contact.customFields && contact.customFields.map((field) => (
                  <div key={field.id} className="mb-2">
                    <strong>{field.name}:</strong> {field.value}
                  </div>
                ))}
                <form onSubmit={handleAddCustomField} className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="customFieldName">Field Name</Label>
                    <Input
                      id="customFieldName"
                      value={newCustomFieldName}
                      onChange={(e) => setNewCustomFieldName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customFieldValue">Field Value</Label>
                    <Input
                      id="customFieldValue"
                      value={newCustomFieldValue}
                      onChange={(e) => setNewCustomFieldValue(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit">Add Custom Field</Button>
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
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-xs">&times;</button>
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

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this contact? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {editingActivity && (
          <Dialog open={!!editingActivity} onOpenChange={() => setEditingActivity(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Activity</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditActivity} className="space-y-4">
                <div>
                  <Label htmlFor="editActivityType">Activity Type</Label>
                  <Select 
                    value={editingActivity.type} 
                    onValueChange={(value: ActivityType) => setEditingActivity({...editingActivity, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editActivityDescription">Description</Label>
                  <Textarea
                    id="editActivityDescription"
                    value={editingActivity.description}
                    onChange={(e) => setEditingActivity({...editingActivity, description: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit">Update Activity</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}

