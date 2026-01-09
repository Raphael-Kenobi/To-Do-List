'use client'

/**
 * Main application page
 * 
 * Integrates TaskForm and TaskList components
 * Demonstrates API-first architecture where frontend
 * never accesses Supabase directly
 */

import { useState } from 'react'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTaskAdded = () => {
    // Force task list update
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <main className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto w-full">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 mb-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            To-Do List
          </h1>
          <p className="text-gray-500 max-w-sm mx-auto">
            Stay organized and focused. Manage your daily tasks with ease.
          </p>
        </header>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Add New Task
              </h2>
              <TaskForm onTaskAdded={handleTaskAdded} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Tasks
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                Recent
              </span>
            </div>
            <TaskList key={refreshKey} />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} To-Do List Challenge</p>
        </footer>
      </div>
    </main>
  )
}
