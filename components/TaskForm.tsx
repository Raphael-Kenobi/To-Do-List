'use client'

/**
 * Component to add new tasks
 * 
 * Allows user to input:
 * - Task title
 * 
 * Note: user_name is handled internally as 'default-user'
 * since authentication is out of scope for this challenge.
 */

import { useState, FormEvent } from 'react'

interface TaskFormProps {
  onTaskAdded: () => void
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Please enter a task title')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          user_name: 'default-user', // Fixed user for demo purposes
          completed: false,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error creating task')
      }

      // Clear form and notify parent
      setTitle('')
      onTaskAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      {error && (
        <div className="absolute -top-12 left-0 right-0 p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="input-field pl-10"
            disabled={isSubmitting}
            autoComplete="off"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="btn-primary whitespace-nowrap"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding
            </>
          ) : 'Add Task'}
        </button>
      </div>
    </form>
  )
}
