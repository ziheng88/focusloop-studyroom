import type { CollectionSchema } from 'deepspace/schema'

export const roomsSchema: CollectionSchema = {
  name: 'rooms',
  columns: [
    { name: 'name', storage: 'text', interpretation: 'plain', required: true, maxLength: 80 },
    { name: 'subject', storage: 'text', interpretation: 'plain', required: true, maxLength: 80 },
    { name: 'description', storage: 'text', interpretation: 'plain', maxLength: 320 },
    { name: 'inviteCode', storage: 'text', interpretation: 'plain', required: true, immutable: true },
  ],
  permissions: {
    member: { read: true, create: true, update: 'own', delete: 'own' },
    admin: { read: true, create: true, update: true, delete: true },
  },
}
