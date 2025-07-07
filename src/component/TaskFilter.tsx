"use client"

import type { FilterType, TaskCounts } from "@/types/task"

interface TaskFilterProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  taskCounts: TaskCounts
  selectedCategories: string[]
  onCategoryToggle: (category: string) => void
  availableCategories: string[]
}

export default function TaskFilter({
  currentFilter,
  onFilterChange,
  taskCounts,
  selectedCategories,
  onCategoryToggle,
  availableCategories,
}: TaskFilterProps) {
  const filters: { key: FilterType; label: string; count: number; icon: string }[] = [
    { key: "all", label: "All", count: taskCounts.all, icon: "📋" },
    { key: "pending", label: "Pending", count: taskCounts.pending, icon: "⏳" },
    { key: "completed", label: "Completed", count: taskCounts.completed, icon: "✅" },
    { key: "high", label: "High Priority", count: taskCounts.high, icon: "🔴" },
    { key: "medium", label: "Medium Priority", count: taskCounts.medium, icon: "🟡" },
    { key: "low", label: "Low Priority", count: taskCounts.low, icon: "🟢" },
  ]

  return (
    <div className="space-y-4">
      {/* Status and Priority Filters */}
      <div className="flex flex-wrap gap-2 animate-fadeInDown">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover-lift ${
              currentFilter === filter.key
                ? "bg-blue-600 text-white shadow-lg animate-pulse-custom"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
            }`}
          >
            <span className="mr-2">{filter.icon}</span>
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Category Filters */}
      {availableCategories.length > 0 && (
        <div className="animate-fadeInUp">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Categories:</h3>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryToggle(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover-scale ${
                  selectedCategories.includes(category)
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800"
                }`}
              >
                #{category}
              </button>
            ))}
            {selectedCategories.length > 0 && (
              <button
                onClick={() => selectedCategories.forEach((cat) => onCategoryToggle(cat))}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 hover-scale"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
