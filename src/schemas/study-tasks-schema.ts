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
    // A study-room task is a shared checklist item: any signed-in member can
    // move it forward, while only its creator can remove it.
    member: { read: true, create: true, update: true, delete: 'own' },
    admin: { read: true, create: true, update: true, delete: true },
  },
}
