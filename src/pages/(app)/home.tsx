import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, CircleHelp, Copy, FileUp, GraduationCap, ListChecks, Plus, Sparkles, Users, X } from 'lucide-react'
import { useAuthProfileReady, useMutations, usePresenceRoom, useQuery, useR2Files } from 'deepspace'
import { QuestionLibrary } from '../../components/QuestionLibrary'
import { practiceQuestions } from '../../data/practice-questions'

type Room = { name: string; subject: string; description: string; inviteCode: string }
type StudyTask = { roomId: string; title: string; topic: string; status: 'planned' | 'in_progress' | 'done' }
type Mistake = { roomId: string; problemTitle: string; topic: string; reflection: string; state: 'incorrect' | 'blocked' | 'reviewed'; needsHelp: boolean }
type Attachment = { roomId: string; fileKey: string; fileName: string; url: string }

const taskColor: Record<StudyTask['status'], string> = { planned: 'bg-slate-100 text-slate-600', in_progress: 'bg-violet-100 text-violet-700', done: 'bg-emerald-100 text-emerald-700' }

export default function HomePage() {
  const location = useLocation()
  const { isSignedIn, user, userLoading } = useAuthProfileReady({ requireUser: true })
  const { records: rooms, status: roomsStatus } = useQuery<Room>('rooms', { orderBy: 'createdAt', orderDir: 'desc' })
  const { records: tasks } = useQuery<StudyTask>('study_tasks', { orderBy: 'createdAt', orderDir: 'desc' })
  const { records: mistakes } = useQuery<Mistake>('mistakes', { orderBy: 'createdAt', orderDir: 'desc' })
  const { records: attachments } = useQuery<Attachment>('attachments', { orderBy: 'createdAt', orderDir: 'desc' })
  const roomWrite = useMutations<Room>('rooms')
  const taskWrite = useMutations<StudyTask>('study_tasks')
  const mistakeWrite = useMutations<Mistake>('mistakes')
  const attachmentWrite = useMutations<Attachment>('attachments')
  const { upload, isUploading } = useR2Files({ scope: 'app' })
  const [roomId, setRoomId] = useState<string | null>(null)
  const [initialRoomResolved, setInitialRoomResolved] = useState(false)
  const [showRoomForm, setShowRoomForm] = useState(false)
  const [showDeleteRoomForm, setShowDeleteRoomForm] = useState(false)
  const [showMistakeForm, setShowMistakeForm] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskTopic, setTaskTopic] = useState('')
  const [problemTitle, setProblemTitle] = useState('')
  const [mistakeTopic, setMistakeTopic] = useState('')
  const [reflection, setReflection] = useState('')
  const [needsHelp, setNeedsHelp] = useState(true)
  const [notice, setNotice] = useState<string | null>(null)
  const [selectedQuestionId, setSelectedQuestionId] = useState(practiceQuestions[0]?.id ?? '')
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
  const [activeQuestionRoomId, setActiveQuestionRoomId] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const observedRoomIds = useRef(new Set<string>())

  useEffect(() => {
    rooms.forEach((room) => observedRoomIds.current.add(room.recordId))
  }, [rooms])

  useEffect(() => {
    if (roomsStatus === 'loading') return
    const linkedRoom = new URLSearchParams(location.search).get('room')
    const linkedRoomExists = Boolean(linkedRoom && rooms.some((room) => room.recordId === linkedRoom))
    if (!initialRoomResolved) {
      setRoomId(linkedRoomExists ? linkedRoom : rooms[0]?.recordId ?? null)
      if (linkedRoom && !linkedRoomExists) setNotice('This room is no longer available.')
      setInitialRoomResolved(true)
      return
    }
    if (linkedRoom && linkedRoom !== roomId) {
      if (linkedRoomExists) setRoomId(linkedRoom)
      else if (roomId !== null) {
        setRoomId(null)
        setNotice('This room is no longer available.')
      }
      return
    }
    // A confirmed create can resolve before the subscription has delivered the
    // new row. Treat a missing room as deleted only after this client saw it.
    if (roomId && observedRoomIds.current.has(roomId) && !rooms.some((room) => room.recordId === roomId)) {
      setRoomId(null)
      setActiveQuestionId(null)
      setActiveQuestionRoomId(null)
      setNotice('This room was deleted by its owner.')
    }
  }, [initialRoomResolved, location.search, roomId, rooms, roomsStatus])

  const activeRoom = rooms.find((room) => room.recordId === roomId) ?? null
  const activeId = activeRoom?.recordId ?? null
  const { peers, connected, updateState } = usePresenceRoom(`focusloop:${activeId ?? 'lobby'}`)
  const roomTasks = useMemo(() => tasks.filter((task) => task.data.roomId === activeId), [tasks, activeId])
  const roomMistakes = useMemo(() => mistakes.filter((mistake) => mistake.data.roomId === activeId), [mistakes, activeId])
  const roomAttachments = useMemo(() => attachments.filter((attachment) => attachment.data.roomId === activeId), [attachments, activeId])
  const completedTasks = useMemo(() => roomTasks.filter((task) => task.data.status === 'done').length, [roomTasks])
  const helpRequests = useMemo(() => roomMistakes.filter((mistake) => mistake.data.needsHelp).length, [roomMistakes])
  const selectedQuestion = practiceQuestions.find((question) => question.id === selectedQuestionId) ?? null
  const activeQuestion = activeQuestionRoomId === activeId ? practiceQuestions.find((question) => question.id === activeQuestionId) ?? null : null
  const weakTopics = useMemo(() => Object.entries(roomMistakes.reduce<Record<string, number>>((counts, item) => {
    const topic = item.data.topic.trim() || 'Uncategorized'
    counts[topic] = (counts[topic] ?? 0) + 1
    return counts
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 4), [roomMistakes])
  const canWrite = isSignedIn && roomWrite.ready && taskWrite.ready && mistakeWrite.ready
  const canDeleteActiveRoom = Boolean(activeRoom && canWrite && (activeRoom.createdBy === user?.id || user?.isAdmin))

  useEffect(() => {
    updateState(activeQuestion ? { activity: 'solving', questionTitle: activeQuestion.title, questionTopic: activeQuestion.topic } : { activity: 'browsing' })
  }, [activeId, activeQuestion, updateState])

  async function createRoom(e: React.FormEvent) {
    e.preventDefault()
    if (!roomName.trim() || !subject.trim()) return
    try {
      const id = await roomWrite.createConfirmed({ name: roomName.trim(), subject: subject.trim(), description: description.trim(), inviteCode: crypto.randomUUID().slice(0, 8) })
      setRoomId(id); setRoomName(''); setSubject(''); setDescription(''); setShowRoomForm(false)
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not create room.') }
  }
  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!activeId || !taskTitle.trim()) return
    try { await taskWrite.createConfirmed({ roomId: activeId, title: taskTitle.trim(), topic: taskTopic.trim(), status: 'planned' }); setTaskTitle(''); setTaskTopic('') }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Could not add task.') }
  }
  async function toggleTask(recordId: string, status: StudyTask['status']) {
    const next = status === 'planned' ? 'in_progress' : status === 'in_progress' ? 'done' : 'planned'
    try { await taskWrite.putConfirmed(recordId, { status: next }) } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not update task.') }
  }
  async function addMistake(e: React.FormEvent) {
    e.preventDefault()
    if (!activeId || !problemTitle.trim() || !mistakeTopic.trim()) return
    try {
      await mistakeWrite.createConfirmed({ roomId: activeId, problemTitle: problemTitle.trim(), topic: mistakeTopic.trim(), reflection: reflection.trim(), state: 'incorrect', needsHelp })
      setProblemTitle(''); setMistakeTopic(''); setReflection(''); setNeedsHelp(true); setShowMistakeForm(false)
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not log mistake.') }
  }
  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !activeId) return
    try {
      const result = await upload(file, file.name, { key: `focusloop/${activeId}/${crypto.randomUUID()}-${file.name}` })
      if (!result.success || !result.key || !result.url) throw new Error(result.error ?? 'Upload failed.')
      await attachmentWrite.createConfirmed({ roomId: activeId, fileKey: result.key, fileName: file.name, url: result.url })
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not upload file.') } finally { e.target.value = '' }
  }
  async function copyInvite() {
    if (!activeId) return
    await navigator.clipboard.writeText(`${window.location.origin}/home?room=${activeId}`)
    setNotice('Room link copied. Share it with a study partner.')
  }
  async function deleteActiveRoom() {
    if (!activeRoom) return
    try {
      await roomWrite.removeConfirmed(activeRoom.recordId)
      setRoomId(null)
      setActiveQuestionId(null)
      setActiveQuestionRoomId(null)
      setShowDeleteRoomForm(false)
      setNotice('Room deleted. Shared records are no longer shown in FocusLoop.')
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not delete room.') }
  }

  return <div className="min-h-full bg-[#f7f7fb] text-slate-900"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
    <section className="mb-6 flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-[#2f2268] to-[#5b3eae] px-6 py-7 text-white sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Collaborative interview prep</p><h1 className="text-3xl font-semibold tracking-tight">Study together. Learn from the misses.</h1><p className="mt-2 max-w-xl text-sm text-violet-100">FocusLoop turns individual mistakes into a live group review plan.</p></div><div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-violet-100"><span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-300' : 'bg-amber-300'}`} />{connected ? 'Live room connected' : 'Connecting…'}</div></section>
    {notice && <div role="alert" className="mb-5 flex justify-between rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-800"><span>{notice}</span><button onClick={() => setNotice(null)}><X className="h-4 w-4" /></button></div>}
    {!isSignedIn && !userLoading && <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Sign in from the navigation bar to create rooms, tasks, mistakes, and attachments.</div>}
    <div className="grid gap-5 lg:grid-cols-[265px_minmax(0,1fr)]"><aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex items-center justify-between px-2 py-2"><h2 className="text-sm font-semibold">Study rooms</h2><button disabled={!canWrite} onClick={() => setShowRoomForm(true)} className="rounded-lg bg-violet-600 p-1.5 text-white disabled:opacity-40" aria-label="Create room"><Plus className="h-4 w-4" /></button></div>{roomsStatus === 'loading' ? <p className="p-3 text-sm text-slate-500">Loading rooms…</p> : rooms.length === 0 ? <p className="m-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Create the first room for your study group.</p> : <div className="space-y-1">{rooms.map((room) => <button key={room.recordId} onClick={() => setRoomId(room.recordId)} className={`w-full rounded-xl p-3 text-left ${room.recordId === activeId ? 'bg-violet-50 ring-1 ring-violet-200' : 'hover:bg-slate-50'}`}><p className="font-medium">{room.data.name}</p><p className="mt-1 text-xs text-slate-500">{room.data.subject}</p></button>)}</div>}<p className="m-2 mt-5 border-t pt-4 text-xs leading-5 text-slate-400">Rooms are shared prototype spaces for signed-in users. Private membership is intentionally out of scope for v1.</p></aside>
      <main className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">{activeRoom ? <><div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:justify-between"><div><div className="flex items-center gap-2 text-xs font-medium text-violet-700"><GraduationCap className="h-4 w-4" />{activeRoom.data.subject}</div><h2 className="mt-2 text-3xl font-semibold tracking-tight">{activeRoom.data.name}</h2><p className="mt-2 max-w-2xl text-sm text-slate-600">{activeRoom.data.description || 'Add tasks and log mistakes your group should revisit.'}</p></div><div className="flex h-fit flex-wrap gap-2"><button onClick={copyInvite} className="inline-flex items-center gap-2 rounded-xl border border-violet-200 px-3 py-2 text-sm font-medium text-violet-700"><Copy className="h-4 w-4" />Copy invite link</button>{canDeleteActiveRoom && <button onClick={() => setShowDeleteRoomForm(true)} className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50">Delete room</button>}</div></div>
        <div className="mt-5 flex items-center gap-2 text-sm text-slate-600"><Users className="h-4 w-4 text-violet-600" />{peers.length ? `${peers.map((peer) => peer.userName).join(', ')} ${peers.length === 1 ? 'is' : 'are'} in this room` : 'You are the only active member right now.'}</div>
        <section aria-label="Room pulse" className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500"><ListChecks className="h-3.5 w-3.5" />Task progress</div><p className="mt-2 text-xl font-semibold text-slate-900">{completedTasks}<span className="text-sm font-normal text-slate-500"> / {roomTasks.length} done</span></p></div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-3"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-700"><CircleHelp className="h-3.5 w-3.5" />Help requests</div><p className="mt-2 text-xl font-semibold text-amber-900">{helpRequests}<span className="text-sm font-normal text-amber-700"> open</span></p></div>
          <div className="rounded-xl border border-violet-100 bg-violet-50 p-3"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-violet-700"><Users className="h-3.5 w-3.5" />Studying now</div><p className="mt-2 text-xl font-semibold text-violet-900">{peers.length + 1}<span className="text-sm font-normal text-violet-700"> active</span></p></div>
        </section>
        <section aria-label="People studying in this room" className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold">People studying now</h3><p className="mt-1 text-sm text-slate-500">Live presence shows what each online learner has chosen to work on.</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">{peers.length + 1} online</span></div><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"><article className="rounded-xl border border-violet-100 bg-white p-3"><p className="font-medium text-slate-900">{user?.name || user?.email || 'You'} <span className="text-xs font-normal text-violet-700">(you)</span></p><p className="mt-1 text-sm text-slate-600">{activeQuestion ? `Solving · ${activeQuestion.title}` : 'Browsing the practice library'}</p></article>{peers.map((peer) => <article key={peer.userId} className="rounded-xl border border-slate-200 bg-white p-3"><p className="font-medium text-slate-900">{peer.userName}</p><p className="mt-1 text-sm text-slate-600">{presenceActivityLabel(peer.state)}</p></article>)}</div></section>
        <QuestionLibrary selectedQuestion={selectedQuestion} activeQuestionId={activeQuestion?.id ?? null} canStart={Boolean(activeId && isSignedIn)} onSelect={setSelectedQuestionId} onStart={() => { if (selectedQuestion && activeId) { setActiveQuestionId(selectedQuestion.id); setActiveQuestionRoomId(activeId) } }} onStop={() => { setActiveQuestionId(null); setActiveQuestionRoomId(null) }} />
        <div className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_.75fr]"><section><div className="flex items-center justify-between"><h3 className="font-semibold">Shared tasks</h3><span className="text-xs text-slate-500">Any room member can advance a task</span></div><form onSubmit={addTask} className="mt-3 flex flex-col gap-2 rounded-xl bg-slate-50 p-3 sm:flex-row"><input aria-label="Task title" disabled={!canWrite} value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Add a task, e.g. solve 3 graph problems" className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" /><input aria-label="Task topic" disabled={!canWrite} value={taskTopic} onChange={(e) => setTaskTopic(e.target.value)} placeholder="Topic (optional)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:w-36" /><button disabled={!canWrite || !taskTitle.trim()} className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-40">Add</button></form><div className="mt-3 space-y-2">{roomTasks.length === 0 ? <p className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">No shared tasks yet.</p> : roomTasks.map((task) => <button key={task.recordId} disabled={!canWrite} aria-label={`Advance ${task.data.title} from ${task.data.status}`} onClick={() => toggleTask(task.recordId, task.data.status)} className="flex w-full items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-left hover:border-violet-200 disabled:cursor-not-allowed disabled:opacity-60"><div><p className="text-sm font-medium">{task.data.title}</p>{task.data.topic && <p className="mt-1 text-xs text-slate-500">{task.data.topic}</p>}</div><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${taskColor[task.data.status]}`}>{task.data.status.replace('_', ' ')}</span></button>)}</div></section>
          <section className="rounded-2xl bg-[#f5f3ff] p-5"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-violet-600" /><h3 className="font-semibold">Weak-topic signal</h3></div><p className="mt-2 text-sm text-slate-600">Built from mistakes logged in this room.</p>{weakTopics.length ? <ol className="mt-5 space-y-3">{weakTopics.map(([topic, count], index) => <li key={topic} className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm"><b className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs text-violet-700">{index + 1}</b>{topic}</span><span className="text-sm font-semibold text-violet-700">{count}</span></li>)}</ol> : <p className="mt-5 text-sm text-slate-500">Log a mistake to reveal your first review priority.</p>}</section></div>
        <section className="mt-8 border-t border-slate-100 pt-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">Mistake log</h3><p className="mt-1 text-sm text-slate-500">Share what went wrong so the group can review it together.</p></div><button disabled={!canWrite} onClick={() => setShowMistakeForm(true)} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-40">Log a mistake</button></div><div className="mt-4 grid gap-3 md:grid-cols-2">{roomMistakes.length === 0 ? <p className="col-span-full rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">No mistakes logged. That means the group has no review signal yet.</p> : roomMistakes.map((mistake) => <article key={mistake.recordId} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">{mistake.data.topic}</span>{mistake.data.needsHelp && <span className="text-xs text-amber-700">Needs help</span>}</div><h4 className="mt-3 font-medium">{mistake.data.problemTitle}</h4>{mistake.data.reflection && <p className="mt-2 text-sm leading-6 text-slate-600">{mistake.data.reflection}</p>}</article>)}</div></section>
        <section className="mt-8 border-t border-slate-100 pt-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">Study materials</h3><p className="mt-1 text-sm text-slate-500">Share a PDF, text note, PNG, or JPG with the room.</p></div><button disabled={!canWrite || isUploading} onClick={() => fileInput.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium disabled:opacity-40"><FileUp className="h-4 w-4" />{isUploading ? 'Uploading…' : 'Attach material'}</button></div>{roomAttachments.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{roomAttachments.map((file) => <a key={file.recordId} href={file.data.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />{file.data.fileName}</a>)}</div>}</section>
      </> : <div className="grid min-h-100 place-items-center text-center"><div><GraduationCap className="mx-auto h-9 w-9 text-violet-600" /><h2 className="mt-4 text-xl font-semibold">Create a room to begin.</h2><p className="mt-2 max-w-sm text-sm text-slate-500">Start a focused space for your interview-prep group.</p>{isSignedIn && <button onClick={() => setShowRoomForm(true)} className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white">Create study room</button>}</div></div>}</main></div>
    <input ref={fileInput} onChange={uploadFile} type="file" accept=".pdf,.txt,image/png,image/jpeg" className="hidden" aria-label="Upload study material" />
  </div>
  {showRoomForm && <Modal title="Create a study room" onClose={() => setShowRoomForm(false)}><form onSubmit={createRoom} className="space-y-4"><Field label="Room name" value={roomName} onChange={setRoomName} placeholder="Algorithms sprint" /><Field label="Subject" value={subject} onChange={setSubject} placeholder="Interview preparation" /><label className="block text-sm font-medium">Purpose<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will this group focus on?" className="mt-1.5 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2" /></label><button className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white">Create room</button></form></Modal>}
  {showDeleteRoomForm && activeRoom && <Modal title="Delete this study room?" onClose={() => setShowDeleteRoomForm(false)}><div className="space-y-4"><p className="text-sm leading-6 text-slate-600">This permanently removes <b>{activeRoom.data.name}</b> from the shared room list. This action cannot be undone.</p><div className="flex gap-3"><button type="button" onClick={() => setShowDeleteRoomForm(false)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700">Cancel</button><button type="button" onClick={deleteActiveRoom} className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-medium text-white">Delete room</button></div></div></Modal>}
  {showMistakeForm && <Modal title="Log a mistake" onClose={() => setShowMistakeForm(false)}><form onSubmit={addMistake} className="space-y-4"><Field label="Problem title or link label" value={problemTitle} onChange={setProblemTitle} placeholder="Two Sum" /><Field label="Topic" value={mistakeTopic} onChange={setMistakeTopic} placeholder="Hash Map" /><label className="block text-sm font-medium">What went wrong?<textarea value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="I forgot to check the complement before insertion." className="mt-1.5 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2" /></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={needsHelp} onChange={(e) => setNeedsHelp(e.target.checked)} />I would like help from a teammate</label><button className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white">Save mistake</button></form></Modal>}
  </div>
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block text-sm font-medium">{label}<input required value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
}

function presenceActivityLabel(state: Record<string, unknown>) {
  const title = typeof state.questionTitle === 'string' ? state.questionTitle : null
  return title ? `Solving · ${title}` : 'Browsing the practice library'
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/40 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><button type="button" onClick={onClose}><X className="h-5 w-5 text-slate-500" /></button></div>{children}</div></div>
}
