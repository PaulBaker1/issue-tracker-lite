'use client'
import { useEffect, useState } from 'react'
import { listIssues, createIssue, updateIssue, deleteIssue } from '@/lib/api'
import type { Issue, IssueStatus, IssuePriority, IssueUpsert } from '@/lib/types'

// Tiny method badge (Swagger-like) — kept here for simplicity
function MethodBadge({ method }: { method: 'GET'|'POST'|'PUT'|'DELETE' }) {
    const colors = { GET:'#61affe', POST:'#49cc90', PUT:'#fca130', DELETE:'#f93e3e' } as const
    return (
        <span
            className="font-mono text-xs px-2 py-0.5 rounded text-black"
            style={{ background: colors[method] }}
        >{method}</span>
    )
}

export default function Page() {
    const [issues, setIssues]   = useState<Issue[]>([])
    const [q, setQ]             = useState('')
    const [status, setStatus]   = useState<IssueStatus | ''>('')
    const [editing, setEditing] = useState<Issue | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState('')

    async function reload() {
        try {
            setLoading(true); setError('')
            const data = await listIssues({ q, status: status || undefined })
            setIssues(data)
        } catch (e: unknown) {
            const m = e instanceof Error ? e.message : String(e)
            setError(m)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { void reload() }, [q, status])

    // Very simple inline form (create or update)
    async function save(payload: IssueUpsert) {
        setError('')
        if (editing) await updateIssue(editing.id, payload)
        else await createIssue(payload)
        setEditing(null)
        await reload()
    }

    return (
        <div className="space-y-4">
            {/* List section */}
            <div className="panel space-y-3">
                <div className="flex items-center gap-2">
                    <MethodBadge method="GET" />
                    <code>/api/issues</code>
                    <span className="text-sm text-[#9aa5b1]">List (with optional filters)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input className="input" placeholder="q (search)" value={q} onChange={e => setQ(e.target.value)} />
                    <select className="select" value={status} onChange={e => setStatus(e.target.value as IssueStatus | '')}>
                        <option value="">status: all</option>
                        <option value="open">open</option>
                        <option value="in_progress">in_progress</option>
                        <option value="done">done</option>
                    </select>
                    <button className="btn" onClick={() => { setQ(''); setStatus(''); }}>Reset</button>
                </div>

                {loading && <p className="text-[#9aa5b1]">Loading…</p>}
                {error && <p className="text-red-400">{error}</p>}

                {/* Render list as simple cards */}
                {!loading && (
                    <ul className="space-y-2">
                        {issues.map(i => (
                            <li key={i.id} className="panel flex items-start justify-between">
                                <div>
                                    <div className="font-semibold">{i.title}</div>
                                    <div className="text-sm text-[#9aa5b1]">{i.description}</div>
                                    <div className="text-xs mt-1">
                                        priority: <b>{i.priority}</b> | status: <b>{i.status}</b> | created: {new Date(i.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn" onClick={() => setEditing(i)}>Edit</button>
                                    <button className="btn" onClick={async () => { await deleteIssue(i.id); await reload() }}>Delete</button>
                                </div>
                            </li>
                        ))}
                        {issues.length === 0 && <li className="text-[#9aa5b1]">No issues.</li>}
                    </ul>
                )}
            </div>

            {/* Create / Update section */}
            <div className="panel space-y-3">
                <div className="flex items-center gap-2">
                    <MethodBadge method={editing ? 'PUT' : 'POST'} />
                    <code>{editing ? `/api/issues/${editing.id}` : '/api/issues'}</code>
                    <span className="text-sm text-[#9aa5b1]">{editing ? 'Update by id' : 'Create new'}</span>
                </div>

                <SimpleIssueForm
                    initial={editing ?? { title: '', description: '', priority: 'medium', status: 'open' }}
                    onCancel={() => setEditing(null)}
                    onSave={save}
                />
            </div>
        </div>
    )
}

// 🔽 tiny, straightforward form component (kept in same file)
function SimpleIssueForm({
                             initial,
                             onSave,
                             onCancel
                         }: {
    initial: { title: string; description?: string; priority: IssuePriority; status: IssueStatus }
    onSave: (payload: IssueUpsert) => Promise<void> | void
    onCancel: () => void
}) {
    const [title, setTitle]             = useState(initial.title ?? '')
    const [description, setDescription] = useState(initial.description ?? '')
    const [priority, setPriority]       = useState<IssuePriority>(initial.priority ?? 'medium')
    const [status, setStatus]           = useState<IssueStatus>(initial.status ?? 'open')
    const [error, setError]             = useState('')

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        try {
            await onSave({ title, description, priority, status })
            setTitle(''); setDescription(''); setPriority('medium'); setStatus('open')
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err)
            setError(message)
        }
    }

    return (
        <form onSubmit={submit} className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input className="input" placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
                <select className="select" value={priority} onChange={e => setPriority(e.target.value as IssuePriority)}>
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                </select>
                <textarea className="textarea md:col-span-2" rows={3} placeholder="description"
                          value={description} onChange={e => setDescription(e.target.value)} />
                <select className="select" value={status} onChange={e => setStatus(e.target.value as IssueStatus)}>
                    <option value="open">open</option>
                    <option value="in_progress">in_progress</option>
                    <option value="done">done</option>
                </select>
            </div>
            <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn" onClick={onCancel}>Cancel</button>
            </div>
            {error && <p className="text-red-400">{error}</p>}
        </form>
    )
}
