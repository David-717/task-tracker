"use client"

import { useState, useEffect } from "react"
import TaskForm from "./TaskForm"
import TaskList from "./TaskList"
import TaskFilter from "./TaskFilter"
import { getTasks, storeTasks } from "@/utils/localStorage"
import { useTheme } from "@/contexts/ThemeContext"
import type { Task, FilterType, TaskCounts } from "@/types/task"

interface TaskDashboardProps {
  user: string
  onLogout: () => void
}

export default function TaskDashboard({ user, onLogout }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const storedTasks = getTasks()
    setTasks(storedTasks)
  }, [])

  useEffect(() => {
    storeTasks(tasks)
  }, [tasks])

  const addTask = (taskData: {
    title: string
    description: string
    priority: "low" | "medium" | "high"
    dueDate?: string
    categories: string[]
  }) => {
    const newTask: Task = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      categories: taskData.categories,
    }
    setTasks((prev) => [newTask, ...prev])
    setShowForm(false)
  }

  const updateTask = (taskData: {
    title: string
    description: string
    priority: "low" | "medium" | "high"
    dueDate?: string
    categories: string[]
  }) => {
    if (!editingTask) return

    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: taskData.title,
              description: taskData.description,
              priority: taskData.priority,
              dueDate: taskData.dueDate,
              categories: taskData.categories,
            }
          : task,
      ),
    )
    setEditingTask(null)
  }

  const deleteTask = (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((task) => task.id !== id))
    }
  }

  const toggleComplete = (id: number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const filteredTasks = tasks.filter((task) => {
    // Filter by status/priority
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed) ||
      (filter === "high" && task.priority === "high") ||
      (filter === "medium" && task.priority === "medium") ||
      (filter === "low" && task.priority === "low")

    // Filter by search term
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.categories.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filter by selected categories
    const matchesCategories =
      selectedCategories.length === 0 || selectedCategories.some((cat) => task.categories.includes(cat))

    return matchesFilter && matchesSearch && matchesCategories
  })

  const taskCounts: TaskCounts = {
    all: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
  }

  const availableCategories = Array.from(new Set(tasks.flatMap((task) => task.categories)))

  const getOverdueTasks = () => {
    return tasks.filter((task) => {
      if (!task.dueDate || task.completed) return false
      return new Date(task.dueDate) < new Date()
    }).length
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-fadeInLeft">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📋 Task Tracker</h1>
              <span className="text-gray-500 dark:text-gray-400">Welcome, {user}!</span>
              {getOverdueTasks() > 0 && (
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-xs font-medium animate-pulse-custom">
                  {getOverdueTasks()} Overdue
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 animate-fadeInRight">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover-scale"
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
              <button
                onClick={onLogout}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 hover-scale"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between animate-fadeInUp">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium btn-ripple hover-lift animate-glow"
            >
              ✨ Add New Task
            </button>

            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search tasks, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 hover-glow"
              />
            </div>
          </div>

          <TaskFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            taskCounts={taskCounts}
            selectedCategories={selectedCategories}
            onCategoryToggle={toggleCategoryFilter}
            availableCategories={availableCategories}
          />
        </div>

        {/* Task Form Modal */}
        {(showForm || editingTask) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 modal-backdrop">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto glass modal-slide-in">
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? updateTask : addTask}
                onCancel={() => {
                  setShowForm(false)
                  setEditingTask(null)
                }}
              />
            </div>
          </div>
        )}

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onEdit={setEditingTask}
          onDelete={deleteTask}
          onToggleComplete={toggleComplete}
          searchTerm={searchTerm}
        />

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 animate-fadeInUp">
            <div className="text-6xl mb-4 animate-bounce">📝</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || selectedCategories.length > 0 ? "No tasks found" : "No tasks yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || selectedCategories.length > 0
                ? "Try adjusting your search terms or filters"
                : "Create your first task to get started!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
