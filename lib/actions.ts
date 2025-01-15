'use server'

import { Contact, Activity, CustomField, Order, Payment } from '@/types'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export async function getActivities(){
  const res = await fetch(`${defaultUrl}/api/activity`)
  if (!res.ok) {
    throw new Error('Failed to fetch activity')
  }
  return res.json()
}
export async function getTags(){
  const res = await fetch(`${defaultUrl}/api/tags`, )
  if (!res.ok) {
    throw new Error('Failed to fetch tags')
  }
  return res.json()
}



export async function addContact(data: Omit<Contact, 'id' | 'activities'>) {
return 0
}

export async function updateContact(id: number, data: Partial<Contact>) {
  return 0
}

export async function deleteContact(id: number) {
  return 0
}

export async function addActivity(contactId: number, data: Omit<Activity, 'id' | 'contactId'>) {
  return 0
}

export async function updateActivity(id: number, data: Partial<Activity>) {
  return 0
}

export async function deleteActivity(id: number) {
  return 0
}

export async function addCustomField(contactId: number, data: Omit<CustomField, 'id'>) {
  return 0
}

export async function addTag(contactId: number, tag: string) {
  return 0
}

export async function removeTag(contactId: number, tag: string) {
  return 0
}

export async function makeOrder(data: Omit<Order, 'id' | 'createdAt'>) {
  return 0
}

export async function updateOrder(id: number, data: Partial<Order>) {
  return 0
}

export async function deleteOrder(id: number) {
  return 0
}

export async function processPayment(orderId: number, amount: number, method: Payment['method'], notes?: string) {
  return 0
}

