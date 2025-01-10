export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task'

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  contact_id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CustomField {
  id: string;
  contact_id: string;
  name: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ContactTag {
  id: string;
  contact_id: string;
  tag_id: string;
  created_at: string;
  updated_at: string;
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