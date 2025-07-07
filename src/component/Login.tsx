"use client"

import type React from "react"

import { useState } from "react"
import { storeUser } from "@/utils/localStorage"

interface LoginProps {
  onLogin: (username: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      setError("Username is required")
      return
    }

    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters")
      return
    }

    storeUser(username.trim())
    onLogin(username.trim())
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📋</h1>
          <h2 className="text-3xl font-bold text-gray-900">Personal Task Tracker</h2>
          <p className="mt-2 text-gray-600">Enter your username to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError("")
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                  autoFocus
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
