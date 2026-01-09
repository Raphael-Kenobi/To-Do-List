'use client'

/**
 * Component to display a single task
 * 
 * Allows:
 * - Marking task as complete/incomplete
 * - Opening the edit modal
 */

import { useState } from 'react'
import TaskEditModal from './TaskEditModal'

export interface Task {
  id: string
  title: string
  completed: boolean
  user_name: string
  created_at: string
}

interface TaskItemProps {
  task: Task
  onTaskUpdated: () => void
}

export default function TaskItem({ task, onTaskUpdated }: TaskItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggleComplete = async () => {
    setIsUpdating(true)

    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: task.id,
          completed: !task.completed,
        }),
      })

      if (response.ok) {
        onTaskUpdated()
      }
    } catch (err) {
      console.error('Error updating task:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <div className={`group relative bg-white p-4 rounded-xl border transition-all duration-200 ${
        task.completed 
          ? 'border-gray-100 bg-gray-50/50' 
          : 'border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200'
      }`}>
        <div className="flex items-start gap-4">
          <div className="pt-1">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              disabled={isUpdating}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer disabled:opacity-50 transition-colors"
            />
          </div>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <p
              className={`text-base transition-all duration-200 ${
                task.completed
                  ? 'line-through text-gray-400'
                  : 'font-medium text-gray-900'
              }`}
            >
              {task.title}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                task.completed ? 'bg-gray-100 text-gray-500' : 'bg-indigo-50 text-indigo-600'
              }`}>
                {new Date(task.created_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            aria-label="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
        </div>
      </div>

      <TaskEditModal 
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={onTaskUpdated}
        onDelete={onTaskUpdated}
      />
    </>
  )
}
