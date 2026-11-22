# FocusLoop

FocusLoop is a real-time collaborative study room for small interview-prep groups. Members share tasks, log mistakes, find the topics causing the most trouble, and attach useful study material.

## Core workflow

1. Create a room and share its link with study partners.
2. Add a shared task for the room.
3. Log a wrong or blocked problem, with a topic and a short reflection.
4. Watch the room's weak-topic ranking update in real time.
5. Use presence to see who is studying and attach relevant material.

## DeepSpace primitives

- OAuth authentication
- Records with real-time sync
- Presence rooms
- R2-backed file storage

## Deliberate scope

FocusLoop does not embed a third-party question bank, automatically grade answers, host video calls, or provide AI tutoring. The first version focuses on the collaborative learning loop. Rooms are discoverable to signed-in prototype users; private membership controls are a next-step security feature.
