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


export interface Payment {
  id: number;
  amount: number;
  date: string;
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'other';
  notes?: string;
}

export interface Order {
  id: number;
  contactId: number;
  products: {
    name: string;
    price: number;
    count: number;
    stock?: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  orderNote?: string;
  createdAt: string;
  payments: Payment[];
  remainingBalance: number;
}