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
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Carregando tasks...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
        <button
          onClick={fetchTasks}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Nenhuma task encontrada.</p>
        <p className="text-sm text-gray-500 mt-2">
          Adicione uma nova task usando o formulário acima.
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

