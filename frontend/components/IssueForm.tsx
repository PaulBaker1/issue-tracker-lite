'use client'
import { useState } from 'react'
import type { IssueUpsert, IssuePriority, IssueStatus } from '@/lib/types'

type Props = {
    initial?: Partial<IssueUpsert>
    onSave: (payload: IssueUpsert) => Promise<void> | void
    onCancel?: () => void
}

export default function IssueForm({ initial, onSave, onCancel }: Props) {
    const [title, setTitle] = useState(initial?.title ?? '')
    const [description, setDescription] = useState(initial?.description ?? '')
    const [priority, setPriority] = useState<IssuePriority>(initial?.priority ?? 'medium')
    const [status, setStatus] = useState<IssueStatus>(initial?.status ?? 'open')
    const [error, setError] = useState('')

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
        <form onSubmit={submit} className="bg-white border rounded-lg p-4 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="border rounded px-3 py-2" placeholder="Title"
                       value={title} onChange={e => setTitle(e.target.value)} />
                <select className="border rounded px-3 py-2" value={priority}
                        onChange={e => setPriority(e.target.value as IssuePriority)}>
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                </select>
                <textarea className="border rounded px-3 py-2 md:col-span-2" rows={3}
                          placeholder="Description" value={description}
                          onChange={e => setDescription(e.target.value)} />
                <select className="border rounded px-3 py-2" value={status}
                        onChange={e => setStatus(e.target.value as IssueStatus)}>
                    <option value="open">open</option>
                    <option value="in_progress">in_progress</option>
                    <option value="done">done</option>
                </select>
                <div className="flex gap-2">
                    <button type="submit" className="bg-black text-white px-4 py-2 rounded">Save</button>
                    {onCancel && <button type="button" className="border px-4 py-2 rounded" onClick={onCancel}>Cancel</button>}
                </div>
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
    )
}
