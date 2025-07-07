"use client"

import { useState, useEffect } from "react"
import Login from "./components/Login"
import TaskDashboard from "./components/TaskDashboard"
import { ThemeProvider } from "./contexts/ThemeContext"
import { getStoredUser } from "./utils/localStorage"
import "./App.css"

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)
    setIsLoading(false)
  }, [])

  const handleLogin = (username) => {
    setUser(username)
  }

  const handleLogout = () => {
    localStorage.removeItem("taskTracker_user")
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin-slow rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {!user ? <Login onLogin={handleLogin} /> : <TaskDashboard user={user} onLogout={handleLogout} />}
      </div>
    </ThemeProvider>
  )
}

export default App
