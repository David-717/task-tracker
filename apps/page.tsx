"use client"

import { useState, useEffect } from "react"
import Login from "@/components/Login"
import TaskDashboard from "@/components/TaskDashboard"
import { getStoredUser } from "@/utils/localStorage"

export default function App() {
  const [user, setUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)
    setIsLoading(false)
  }, [])

  const handleLogin = (username: string) => {
    setUser(username)
  }

  const handleLogout = () => {
    localStorage.removeItem("taskTracker_user")
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!user ? <Login onLogin={handleLogin} /> : <TaskDashboard user={user} onLogout={handleLogout} />}
    </div>
  )
}
