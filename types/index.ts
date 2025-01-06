export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task'

export interface Activity {
  id: number
  contactId: number
  type: ActivityType
  description: string
  date: string
  dueDate?: string
}

export interface CustomField {
  id: number
  name: string
  value: string
}

export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  activities: Activity[]
  customFields: CustomField[]
  tags: string[]
}

