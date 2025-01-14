"use client"
import { Activity } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger,SelectValue } from "@/components/ui/select"
import { Textarea } from './ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface ActivityListProps {
  activities: Activity[]
  contactId: string
  onActivityChange: () => void
}

export default function ActivityList({ activities, contactId, onActivityChange }: ActivityListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'  | 'created_at' | 'updated_at'>>({
    contact_id: contactId,
    type: 'note',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

   const {toast } = useToast()
  const handleAddActivity = async () => {
    try {
      const res = await fetch(`/api/contacts/${contactId}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newActivity),
      })

      if (!res.ok) {
        throw new Error('Failed to add activity')
      }

      setIsAddDialogOpen(false)
      setNewActivity({
        contact_id: contactId,
        type: 'note',
        description: '',
        date: new Date().toISOString().split('T')[0],
      })
      onActivityChange()
      toast({
        title: "Activity added",
        description: "The activity has been successfully added.",
      })
    } catch (error) {
      console.error('Error adding activity:', error)
      toast({
        title: "Error",
        description: "Failed to add the activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditActivity = async () => {
    if (!editingActivity) return

    try {
      const res = await fetch(`/api/activity/${editingActivity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingActivity),
      })

      if (!res.ok) {
        throw new Error('Failed to update activity')
      }

      setIsEditDialogOpen(false)
      setEditingActivity(null)
      onActivityChange()
      toast({
        title: "Activity updated",
        description: "The activity has been successfully updated.",
      })
    } catch (error) {
      console.error('Error updating activity:', error)
      toast({
        title: "Error",
        description: "Failed to update the activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return

    try {
      const res = await fetch(`/api/activity/${activityId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete activity')
      }

      onActivityChange()
      toast({
        title: "Activity deleted",
        description: "The activity has been successfully deleted.",
      })
    } catch (error) {
      console.error('Error deleting activity:', error)
      toast({
        title: "Error",
        description: "Failed to delete the activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardHeader>
            <CardTitle className="capitalize">{activity.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
            <p className="text-xs text-gray-500 mb-2">Date: {new Date(activity.date).toLocaleDateString()}</p>
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => {
                setEditingActivity(activity)
                setIsEditDialogOpen(true)
              }}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDeleteActivity(activity.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">Add Activity</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={newActivity.type}
                onValueChange={(value) => setNewActivity({ ...newActivity, type: value as Activity['type'] })}
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newActivity.date}
                onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
              />
            </div>
            <Button onClick={handleAddActivity}>Add Activity</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          {editingActivity && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select
                  value={editingActivity.type}
                  onValueChange={(value) => setEditingActivity({ ...editingActivity, type: value as Activity['type'] })}
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
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingActivity.description}
                  onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingActivity.date.split('T')[0]}
                  onChange={(e) => setEditingActivity({ ...editingActivity, date: e.target.value })}
                />
              </div>
              <Button onClick={handleEditActivity}>Update Activity</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
