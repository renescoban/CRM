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
  [x: string]: any;
  id: string;
  contact_id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  description: string;
  date: string;
  dueDate?: string;
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



export interface Order {
  id: string;
  contact_id: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  products: {
    name: string;
    price: number;
    count: number;
  }[];
  note?: string;
  created_at: string;
  updated_at: string;
  contacts?: {
    name: string;
  };
  payments?: Payment[];
  remainingBalance: number;
  estimated_delivery: number;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'other';
  status: 'pending' | 'completed' | 'failed';
  note?: string;
  created_at: string;
  updated_at: string;
}