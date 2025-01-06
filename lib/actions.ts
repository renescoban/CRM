'use server'

import { Contact, Activity, CustomField } from '@/types'

export async function addContact(data: Omit<Contact, 'id' | 'activities'>) {
  // In a real application, you would save this data to a database
  console.log('Adding contact:', data)
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Return a success message
  return { success: true, message: 'Contact added successfully' }
}

export async function updateContact(id: number, data: Partial<Contact>) {
  // In a real application, you would update this data in a database
  console.log('Updating contact:', id, data)
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Return a success message
  return { success: true, message: 'Contact updated successfully' }
}

export async function deleteContact(id: number) {
  // In a real application, you would delete this contact from a database
  console.log('Deleting contact:', id)
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Return a success message
  return { success: true, message: 'Contact deleted successfully' }
}

export async function addActivity(contactId: number, data: Omit<Activity, 'id' | 'contactId'>) {
  // In a real application, you would save this data to a database
  console.log('Adding activity for contact:', contactId, data)
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Return a success message
  return { success: true, message: 'Activity added successfully' }
}

export async function updateActivity(id: number, data: Partial<Activity>) {
  // In a real application, you would update this data in a database
  console.log('Updating activity:', id, data)
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Return a success message
  return { success: true, message: 'Activity updated successfully' }
}

export async function deleteActivity(id: number) {
  // In a real application, you would delete this activity from a database
  console.log('Deleting activity:', id)
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Return a success message
  return { success: true, message: 'Activity deleted successfully' }
}

export async function addCustomField(contactId: number, data: Omit<CustomField, 'id'>) {
  // In a real application, you would save this data to a database
  console.log('Adding custom field for contact:', contactId, data)
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Return a success message
  return { success: true, message: 'Custom field added successfully' }
}

export async function addTag(contactId: number, tag: string) {
  // In a real application, you would update this data in a database
  console.log('Adding tag to contact:', contactId, tag)
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Return a success message
  return { success: true, message: 'Tag added successfully' }
}

export async function removeTag(contactId: number, tag: string) {
  // In a real application, you would update this data in a database
  console.log('Removing tag from contact:', contactId, tag)
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Return a success message
  return { success: true, message: 'Tag removed successfully' }
}

