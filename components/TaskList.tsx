'use client'

/**
 * Component to display the list of tasks
 * 
 * Fetches tasks from API and renders each one using TaskItem
 * Supports optional user filtering
 */

import { useState, useEffect } from 'react'
import TaskItem, { Task } from './TaskItem'

interface TaskListProps {
  userName?: string
}

export default function TaskList({ userName }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // If no userName is provided, we could default to 'default-user' or fetch all
      // For this challenge, let's fetch all tasks to see everything
      const url = userName
        ? `/api/tasks?user_name=${encodeURIComponent(userName)}`
        : '/api/tasks'

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Error fetching tasks')
      }

      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching tasks')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [userName])

  const handleTaskUpdated = () => {
    fetchTasks()
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse flex items-center gap-4">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-xl border border-red-100 shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-gray-900 font-medium mb-1">Failed to load tasks</h3>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <button
          onClick={fetchTasks}
          className="btn-secondary text-sm"
        >
          Try again
        </button>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </div>
        <h3 className="text-gray-900 font-medium text-lg mb-1">No tasks yet</h3>
        <p className="text-gray-500 max-w-xs mx-auto">
          Your list is empty. Add a new task above to get started with your day.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onTaskUpdated={handleTaskUpdated}
        />
      ))}
    </div>
  )
}
