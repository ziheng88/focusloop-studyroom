import type { CollectionSchema } from 'deepspace/schema'

export const mistakesSchema: CollectionSchema = {
  name: 'mistakes',
  columns: [
    { name: 'roomId', storage: 'text', interpretation: 'plain', required: true },
    { name: 'problemTitle', storage: 'text', interpretation: 'plain', required: true, maxLength: 160 },
    { name: 'topic', storage: 'text', interpretation: 'plain', required: true, maxLength: 80 },
    { name: 'reflection', storage: 'text', interpretation: 'plain', maxLength: 600 },
    { name: 'state', storage: 'text', interpretation: { kind: 'select', options: ['incorrect', 'blocked', 'reviewed'] }, required: true },
    { name: 'needsHelp', storage: 'number', interpretation: { kind: 'boolean' }, required: true },
  ],
  permissions: {
    member: { read: true, create: true, update: 'own', delete: 'own' },
    admin: { read: true, create: true, update: true, delete: true },
  },
}
