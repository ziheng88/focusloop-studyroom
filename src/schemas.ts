/**
 * Collection Schemas
 *
 * All collections with columns and RBAC permissions.
 * Single source of truth — imported by both worker and frontend.
 *
 * Add schemas by creating a file in src/schemas/ and importing it here.
 */

import type { CollectionSchema } from 'deepspace/schema'
import { usersSchema } from './schemas/users-schema'
import { settingsSchema } from './schemas/admin-schema'
import { attachmentsSchema } from './schemas/attachments-schema'
import { mistakesSchema } from './schemas/mistakes-schema'
import { roomsSchema } from './schemas/rooms-schema'
import { studyTasksSchema } from './schemas/study-tasks-schema'

export const schemas: CollectionSchema[] = [
  usersSchema,
  settingsSchema,
  roomsSchema,
  studyTasksSchema,
  mistakesSchema,
  attachmentsSchema,
]
