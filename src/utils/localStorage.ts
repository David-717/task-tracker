import type { Task } from "@/types/task"

const STORAGE_KEYS = {
  USER: "taskTracker_user",
  TASKS: "taskTracker_tasks",
}

// User functions
export const storeUser = (username: string): void => {
  localStorage.setItem(STORAGE_KEYS.USER, username)
}

export const getStoredUser = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEYS.USER)
}

// Task functions
export const storeTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
}

// Normalize legacy tasks that don't have priority / categories / dueDate
const normalizeTask = (task: any): Task => ({
  id: task.id,
  title: task.title,
  description: task.description ?? "",
  completed: !!task.completed,
  createdAt: task.createdAt ?? new Date().toISOString(),
  priority: (task.priority as "low" | "medium" | "high") ?? "medium",
  dueDate: task.dueDate,
  categories: Array.isArray(task.categories) ? task.categories : [],
})

export const getTasks = (): Task[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEYS.TASKS)
  if (!stored) return []

  try {
    return JSON.parse(stored).map(normalizeTask)
  } catch (error) {
    console.error("Error parsing stored tasks:", error)
    return []
  }
}

// Sample data for testing
export const sampleTasks: Task[] = [
  {
    id: 1,
    title: "Complete React assignment",
    description: "Build a task tracker application",
    completed: false,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "Review JavaScript concepts",
    description: "Go through ES6+ features",
    completed: true,
    createdAt: "2024-01-14T15:30:00Z",
  },
]
