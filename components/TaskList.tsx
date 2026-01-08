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
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm text-gray-600">Loading tasks...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded text-sm">
          {error}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={fetchTasks}
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
        <div className="text-3xl">🗒️</div>
        <p className="mt-3 text-gray-700 font-medium">No tasks yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Use the form above to create your first task.
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
