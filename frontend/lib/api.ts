import type { Issue, IssueUpsert } from './types'

// Build query string only if values exist
function qs(params?: Record<string, string | undefined>) {
    const u = new URLSearchParams()
    if (!params) return ''
    for (const [k, v] of Object.entries(params)) {
        if (v && v.trim() !== '') u.set(k, v.trim())
    }
    const s = u.toString()
    return s ? `?${s}` : ''
}

export async function listIssues(params?: { q?: string; status?: string }) {
    const res = await fetch(`/api/issues${qs(params)}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(await res.text())
    return (await res.json()) as Issue[]
}

export async function createIssue(payload: IssueUpsert) {
    const res = await fetch(`/api/issues`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(await res.text())
    return (await res.json()) as Issue
}

export async function updateIssue(id: number, payload: IssueUpsert) {
    const res = await fetch(`/api/issues/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(await res.text())
    return (await res.json()) as Issue
}

export async function deleteIssue(id: number) {
    const res = await fetch(`/api/issues/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await res.text())
}
