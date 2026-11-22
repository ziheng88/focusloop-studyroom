import type { CollectionSchema } from 'deepspace/schema'

export const attachmentsSchema: CollectionSchema = {
  name: 'attachments',
  columns: [
    { name: 'roomId', storage: 'text', interpretation: 'plain', required: true },
    { name: 'fileKey', storage: 'text', interpretation: 'plain', required: true },
    { name: 'fileName', storage: 'text', interpretation: 'plain', required: true, maxLength: 240 },
    { name: 'url', storage: 'text', interpretation: { kind: 'url' }, required: true },
  ],
  permissions: {
    member: { read: true, create: true, update: 'own', delete: 'own' },
    admin: { read: true, create: true, update: true, delete: true },
  },
}
