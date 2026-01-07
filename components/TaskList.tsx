'use client'

/**
 * Componente para exibir a lista de tasks
 * 
 * Busca tasks da API e renderiza cada uma usando TaskItem
 * Suporta filtro por usuário
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
      const url = userName
        ? `/api/tasks?user_name=${encodeURIComponent(userName)}`
        : '/api/tasks'

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Erro ao buscar tasks')
      }

      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar tasks')
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
        <p className="mt-3 text-sm text-gray-600">Carregando tasks...</p>
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
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
        <div className="text-3xl">🗒️</div>
        <p className="mt-3 text-gray-700 font-medium">Nenhuma task ainda</p>
        <p className="text-sm text-gray-500 mt-2">
          Use o formulário acima para criar sua primeira task.
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
