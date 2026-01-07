'use client'

/**
 * Componente para exibir uma task individual
 * 
 * Permite:
 * - Marcar task como completa/incompleta
 * - Editar o título da task
 * - Visualizar informações da task
 */

import { useState } from 'react'

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
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggleComplete = async () => {
    setIsUpdating(true)
    setError(null)

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

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao atualizar task')
      }

      onTaskUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar task')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editedTitle.trim()) {
      setError('O título não pode estar vazio')
      return
    }

    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: task.id,
          title: editedTitle.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao atualizar task')
      }

      setIsEditing(false)
      onTaskUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar task')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedTitle(task.title)
    setIsEditing(false)
    setError(null)
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150">
      {error && (
        <div className="mb-2 p-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded">
          {error}
        </div>
      )}

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          disabled={isUpdating}
          className="mt-1 w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-sky-400 cursor-pointer disabled:opacity-50"
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                disabled={isUpdating}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div>
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
                <span className="truncate">{task.user_name}</span>
                <span>•</span>
                <span>
                  {new Date(task.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            disabled={isUpdating}
            className="px-3 py-1 text-sm text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded disabled:opacity-50 transition-colors"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  )
}
