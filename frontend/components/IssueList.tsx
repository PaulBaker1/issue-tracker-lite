'use client'
import type { Issue } from '@/lib/types'

type Props = {
    items: Issue[]
    onEdit: (issue: Issue) => void
    onDelete: (id: number) => void
}

export default function IssueList({ items, onEdit, onDelete }: Props) {
    if (!items.length) return <p className="text-slate-500">No issues yet.</p>
    return (
        <ul className="space-y-2">
            {items.map(i => (
                <li key={i.id} className="bg-white border rounded-lg p-4 shadow-sm flex items-start justify-between">
                    <div>
                        <div className="font-semibold">{i.title}</div>
                        <div className="text-sm text-slate-600">{i.description}</div>
                        <div className="text-xs mt-1">
                            priority: <b>{i.priority}</b> | status: <b>{i.status}</b>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="border px-3 py-1 rounded" onClick={() => onEdit(i)}>Edit</button>
                        <button className="border px-3 py-1 rounded" onClick={() => onDelete(i.id)}>Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    )
}
