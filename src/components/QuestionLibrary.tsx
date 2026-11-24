import { BookOpen, Play, Search, Square } from 'lucide-react'
import { useMemo, useState } from 'react'
import { practiceQuestions, questionCategories, questionCategory, type Difficulty, type PracticeQuestion, type QuestionCategory } from '../data/practice-questions'

type Props = {
  selectedQuestion: PracticeQuestion | null
  activeQuestionId: string | null
  canStart: boolean
  onSelect: (questionId: string) => void
  onStart: () => void
  onStop: () => void
}

const difficultyStyle: Record<Difficulty, string> = {
  Easy: 'bg-emerald-50 text-emerald-700',
  Medium: 'bg-amber-50 text-amber-700',
  Hard: 'bg-rose-50 text-rose-700',
}

export function QuestionLibrary({ selectedQuestion, activeQuestionId, canStart, onSelect, onStart, onStop }: Props) {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<'All' | Difficulty>('All')
  const [category, setCategory] = useState<'All' | QuestionCategory>('All')
  const visibleQuestions = useMemo(() => practiceQuestions.filter((question) => {
    const term = search.trim().toLowerCase()
    const matchesSearch = !term || `${question.title} ${question.topic} ${question.prompt}`.toLowerCase().includes(term)
    const matchesCategory = category === 'All' || questionCategory(question.topic) === category
    return matchesSearch && matchesCategory && (difficulty === 'All' || question.difficulty === difficulty)
  }), [search, category, difficulty])

  return <section aria-label="Practice question library" className="mt-7 border-t border-slate-100 pt-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-violet-600" /><h3 className="font-semibold">Practice library</h3></div><p className="mt-1 text-sm text-slate-500">100 original interview prompts, ready to start in this room.</p></div><p className="text-sm font-medium text-violet-700">{visibleQuestions.length} of {practiceQuestions.length} questions</p></div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(260px,.7fr)]">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto_auto]"><label className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search practice questions" placeholder="Search title, topic, or concept" className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" /></label><select value={category} onChange={(event) => setCategory(event.target.value as 'All' | QuestionCategory)} aria-label="Filter questions by topic category" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="All">All topics</option>{questionCategories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><select value={difficulty} onChange={(event) => setDifficulty(event.target.value as 'All' | Difficulty)} aria-label="Filter questions by difficulty" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="All">All levels</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select></div>
        <div className="mt-3 grid max-h-96 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">{visibleQuestions.map((question) => <button key={question.id} onClick={() => onSelect(question.id)} aria-label={`Select ${question.title}`} className={`rounded-xl border p-3 text-left transition ${selectedQuestion?.id === question.id ? 'border-violet-300 bg-violet-50 ring-1 ring-violet-200' : 'border-slate-200 bg-white hover:border-violet-200'}`}><div className="flex items-start justify-between gap-2"><p className="text-sm font-medium text-slate-900">{question.title}</p><span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${difficultyStyle[question.difficulty]}`}>{question.difficulty}</span></div><p className="mt-1 text-xs text-slate-500">{questionCategories.find((item) => item.id === questionCategory(question.topic))?.label} · {question.topic}</p></button>)}</div>
        {visibleQuestions.length === 0 && <p className="p-5 text-center text-sm text-slate-500">No question matches those filters.</p>}
      </div>
      <aside className="rounded-2xl border border-violet-100 bg-violet-50 p-5">{selectedQuestion ? <><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-violet-700">{selectedQuestion.topic}</span><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${difficultyStyle[selectedQuestion.difficulty]}`}>{selectedQuestion.difficulty}</span></div><h4 className="mt-4 text-lg font-semibold text-slate-900">{selectedQuestion.title}</h4><p className="mt-3 text-sm leading-6 text-slate-600">{selectedQuestion.prompt}</p>{activeQuestionId === selectedQuestion.id ? <div className="mt-5"><p className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-violet-800">You are working on this question now.</p><button onClick={onStop} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-sm font-medium text-violet-700"><Square className="h-4 w-4" />Stop sharing status</button></div> : <button disabled={!canStart} onClick={onStart} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-medium text-white disabled:opacity-40"><Play className="h-4 w-4" />Start working on this</button>}<p className="mt-3 text-xs leading-5 text-slate-500">Starting a question shares only its title and topic with people currently online in this room.</p></> : <p className="text-sm text-slate-500">Choose a question from the library to see its prompt.</p>}</aside>
    </div>
  </section>
}
