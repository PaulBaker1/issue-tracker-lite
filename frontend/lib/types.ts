export type IssueStatus   = 'open' | 'in_progress' | 'done'
export type IssuePriority = 'low'  | 'medium'      | 'high'

export type Issue = {
    id: number
    title: string
    description?: string
    priority: IssuePriority
    status: IssueStatus
    createdAt: string
}

export type IssueUpsert = {
    title: string
    description?: string
    priority: IssuePriority
    status: IssueStatus
}
