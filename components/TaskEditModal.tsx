'use client'

import { useState, useEffect } from 'react'
import { Task } from './TaskItem'

interface TaskEditModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
}

export default function TaskEditModal({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}: TaskEditModalProps) {
  const [title, setTitle] = useState(task.title)
  const [note, setNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [showNoteInput, setShowNoteInput] = useState(false)

  // Reset state when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      setTitle(task.title)
      setNote('')
      setShowNoteInput(false)
    }
  }, [isOpen, task])

  if (!isOpen) return null

  const handleSaveTitle = async () => {
    if (title.trim() === task.title) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, title: title.trim() })
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddNote = async () => {
    if (!note.trim()) return

    setIsAddingNote(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: note.trim() })
      })

      if (response.ok) {
        setNote('')
        setShowNoteInput(false)
        alert('Note added! AI agent will process it shortly.')
      }
    } catch (error) {
      console.error('Error adding note:', error)
    } finally {
      setIsAddingNote(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const response = await fetch(`/api/tasks?id=${task.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onDelete()
        onClose()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Edit Task</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          
          {/* Title Edit */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                AI Notes & Context
              </label>
            </div>

            {!showNoteInput ? (
              <button
                onClick={() => setShowNoteInput(true)}
                className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
              >
                + Add note for AI
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Break this down into steps..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm min-h-[80px] mb-3"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowNoteInput(false)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    disabled={isAddingNote || !note.trim()}
                    className="px-3 py-1.5 text-sm bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50"
                  >
                    {isAddingNote ? 'Sending...' : 'Send to AI'}
                  </button>
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              Adding a note triggers the AI agent to process this task.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-2 rounded-md hover:bg-red-50"
          >
            Delete Task
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleSaveTitle()
                onClose()
              }}
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium"
            >
              Save
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
