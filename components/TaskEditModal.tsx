'use client'

import { useState, useEffect, useRef } from 'react'
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
  const modalRef = useRef<HTMLDivElement>(null)

  // Reset state when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      setTitle(task.title)
      setNote('')
      setShowNoteInput(false)
    }
  }, [isOpen, task])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

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
        // In a real app, we might show a toast notification here
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transform transition-all duration-300 scale-100"
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-lg font-semibold text-gray-900">Edit Task</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          
          {/* Title Edit */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-base"
            />
          </div>

          {/* Notes Section */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                AI Assistant
              </label>
            </div>

            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">Need help with this task?</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Add a note to trigger the AI agent. It can help break down tasks or provide suggestions.
                  </p>
                </div>
              </div>

              {!showNoteInput ? (
                <button
                  onClick={() => setShowNoteInput(true)}
                  className="w-full py-2 px-4 bg-white border border-indigo-200 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
                >
                  Add Note for AI
                </button>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="E.g., Break this down into smaller steps..."
                    className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm min-h-[80px] mb-3 placeholder-gray-400"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowNoteInput(false)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNote}
                      disabled={isAddingNote || !note.trim()}
                      className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      {isAddingNote ? 'Sending...' : 'Send to AI'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium shadow-sm transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleSaveTitle()
                onClose()
              }}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm hover:shadow transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
