import { Order } from '../types';
import { contacts } from './contacts';

export const orders: Order[] = [
  {
    id: 1,
    contactId: contacts[0].id,
    products: [
      { name: 'Product A', price: 50, count: 2, stock: 100 },
      { name: 'Product B', price: 30, count: 1, stock: 50 },
    ],
    total: 130,
    status: 'processing',
    estimated_delivery: '2023-06-15',
    orderNote: 'Please handle with care',
    createdAt: '2023-06-01',
    payments: [
      { id: 1, amount: 50, date: '2023-06-02', method: 'credit_card' },
    ],
    remainingBalance: 80,
  },
  {
    id: 2,
    contactId: contacts[1].id,
    products: [
      { name: 'Product C', price: 100, count: 1, stock: 25 },
    ],
    total: 100,
    status: 'shipped',
    estimated_delivery: '2023-06-10',
    createdAt: '2023-06-02',
    payments: [
      { id: 1, amount: 75, date: '2023-06-03', method: 'bank_transfer' },
    ],
    remainingBalance: 25,
  },
  {
    id: 3,
    contactId: contacts[0].id,
    products: [
      { name: 'Product D', price: 200, count: 1, stock: 10 },
      { name: 'Product E', price: 50, count: 2, stock: 30 },
    ],
    total: 300,
    status: 'pending',
    estimated_delivery: '2023-06-20',
    createdAt: '2023-06-05',
    payments: [],
    remainingBalance: 300,
  },
  {
    id: 4,
    contactId: contacts[1].id,
    products: [
      { name: 'Product F', price: 150, count: 1, stock: 15 },
    ],
    total: 150,
    status: 'delivered',
    estimated_delivery: '2023-06-08',
    createdAt: '2023-06-03',
    payments: [
      { id: 1, amount: 150, date: '2023-06-04', method: 'credit_card' },
    ],
    remainingBalance: 0,
  },
];

