"use client"

import type { Task } from "@/types/task"

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onToggleComplete: (id: number) => void
  searchTerm: string
}

export default function TaskItem({ task, onEdit, onDelete, onToggleComplete, searchTerm }: TaskItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && !task.completed
  }

  const getDueDateColor = (dueDate?: string) => {
    if (!dueDate) return ""
    const now = new Date()
    const due = new Date(dueDate)
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (task.completed) return "text-green-600 dark:text-green-400"
    if (diffHours < 0) return "text-red-600 dark:text-red-400" // Overdue
    if (diffHours < 24) return "text-orange-600 dark:text-orange-400" // Due soon
    return "text-blue-600 dark:text-blue-400"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700"
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700"
      case "low":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600"
    }
  }

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text

    const regex = new RegExp(`(${searchTerm})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const priority = task.priority ?? "medium"

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-all duration-300 hover:shadow-md hover-lift animate-fadeInUp ${
        task.completed ? "opacity-75" : ""
      } ${isOverdue(task.dueDate) ? "border-l-4 border-l-red-500" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 hover-scale ${
            task.completed
              ? "bg-green-500 border-green-500 text-white animate-bounceIn"
              : "border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500"
          }`}
        >
          {task.completed && "✓"}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3
              className={`font-medium text-gray-900 dark:text-white mb-1 ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}`}
            >
              {highlightText(task.title, searchTerm)}
            </h3>

            {/* Priority Badge */}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)} animate-scaleIn`}
            >
              {priority.toUpperCase()}
            </span>
          </div>

          {task.description && (
            <p className={`text-gray-600 dark:text-gray-300 text-sm mb-3 ${task.completed ? "line-through" : ""}`}>
              {highlightText(task.description, searchTerm)}
            </p>
          )}

          {/* Categories */}
          {task.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.categories.map((category) => (
                <span
                  key={category}
                  className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs animate-fadeInRight"
                >
                  #{category}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Created: {formatDate(task.createdAt)}</span>

            {task.dueDate && (
              <span className={`font-medium ${getDueDateColor(task.dueDate)}`}>
                Due: {formatDate(task.dueDate)}
                {isOverdue(task.dueDate) && " (Overdue)"}
              </span>
            )}

            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.completed
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
              }`}
            >
              {task.completed ? "Completed" : "Pending"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200 p-1 hover-scale"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors duration-200 p-1 hover-scale"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
