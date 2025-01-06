import { Contact } from '../types'

export const contacts: Contact[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    activities: [
      { id: 1, contactId: 1, type: 'call', description: 'Discussed new product features', date: '2023-06-01' },
      { id: 2, contactId: 1, type: 'email', description: 'Sent follow-up email', date: '2023-06-02' },
    ],
    customFields: [
      { id: 1, name: 'Company', value: 'Acme Inc.' },
      { id: 2, name: 'Position', value: 'Manager' },
    ],
    tags: ['client', 'tech']
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    activities: [
      { id: 3, contactId: 2, type: 'meeting', description: 'Quarterly review meeting', date: '2023-06-03' },
      { id: 4, contactId: 2, type: 'task', description: 'Prepare proposal', date: '2023-06-04' },
    ],
    customFields: [
      { id: 3, name: 'Industry', value: 'Technology' },
      { id: 4, name: 'Preferred Contact', value: 'Email' },
    ],
    tags: ['prospect', 'finance']
  },
]

