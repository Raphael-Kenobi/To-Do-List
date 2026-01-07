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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {error && (
        <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          disabled={isUpdating}
          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUpdating}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p
                className={`text-gray-800 ${
                  task.completed
                    ? 'line-through text-gray-500'
                    : 'font-medium'
                }`}
              >
                {task.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span>{task.user_name}</span>
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
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded disabled:opacity-50"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  )
}

