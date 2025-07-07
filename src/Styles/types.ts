export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  createdAt: string
  priority: "low" | "medium" | "high"
  dueDate?: string
  categories: string[]
}

export type FilterType = "all" | "completed" | "pending" | "high" | "medium" | "low"

export interface TaskCounts {
  all: number
  completed: number
  pending: number
  high: number
  medium: number
  low: number
}
