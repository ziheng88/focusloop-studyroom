# FocusLoop

FocusLoop is a real-time collaborative study room for small interview-prep groups. Members share tasks, log mistakes, find the topics causing the most trouble, and attach useful study material.

## Core workflow

1. Create a room and share its link with study partners.
2. Search the built-in library of 100 original interview-practice prompts, then start one.
3. Use presence to see which online learners are working on which question.
4. Add a shared task for the room; any signed-in room participant can advance its status.
5. Log a wrong or blocked problem, with a topic and a short reflection.
6. Watch the room's weak-topic ranking update in real time and attach relevant material.

The room pulse summarizes task completion, open help requests, and active study partners so a group can decide what to review next without reading every item.

## DeepSpace primitives

- OAuth authentication
- Records with real-time sync
- Presence rooms
- R2-backed file storage

## Deliberate scope

FocusLoop does not copy a third-party question bank, run or grade user code, host video calls, or provide AI tutoring. The built-in prompts are short, original practice briefs; a production code runner would need a secure execution sandbox and is intentionally outside this five-day scope. Rooms are discoverable to signed-in prototype users; private membership controls are a next-step security feature.
