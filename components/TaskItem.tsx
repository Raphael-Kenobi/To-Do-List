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
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150 group">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isUpdating}
            className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-sky-400 cursor-pointer disabled:opacity-50"
          />

          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <p
              className={`truncate ${
                task.completed
                  ? 'line-through text-gray-400 italic'
                  : 'font-medium text-gray-800'
              }`}
            >
              {task.title}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span>{new Date(task.created_at).toLocaleDateString('en-US')}</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 text-sm text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            Edit
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
