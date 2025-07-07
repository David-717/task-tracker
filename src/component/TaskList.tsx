"use client"

import TaskItem from "./TaskItem"
import type { Task } from "@/types/task"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onToggleComplete: (id: number) => void
  searchTerm: string
}

export default function TaskList({ tasks, onEdit, onDelete, onToggleComplete, searchTerm }: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  )
}
