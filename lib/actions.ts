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



export async function getReport(data:any) {
return 0
}
