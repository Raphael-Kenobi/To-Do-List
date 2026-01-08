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
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
          <header className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
              To-Do List
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Manage your tasks in a simple and efficient way
            </p>
          </header>

          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                New Task
              </h2>
              <TaskForm onTaskAdded={handleTaskAdded} />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Your Tasks
              </h2>
              <TaskList key={refreshKey} />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
