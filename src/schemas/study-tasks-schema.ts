import type { CollectionSchema } from 'deepspace/schema'

export const studyTasksSchema: CollectionSchema = {
  name: 'study_tasks',
  columns: [
    { name: 'roomId', storage: 'text', interpretation: 'plain', required: true },
    { name: 'title', storage: 'text', interpretation: 'plain', required: true, maxLength: 160 },
    { name: 'topic', storage: 'text', interpretation: 'plain', maxLength: 80 },
    { name: 'status', storage: 'text', interpretation: { kind: 'select', options: ['planned', 'in_progress', 'done'] }, required: true },
  ],
  permissions: {
    member: { read: true, create: true, update: 'own', delete: 'own' },
    admin: { read: true, create: true, update: true, delete: true },
  },
}
