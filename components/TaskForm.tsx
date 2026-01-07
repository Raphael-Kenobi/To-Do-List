'use client'

/**
 * Componente para adicionar novas tasks
 * 
 * Permite ao usuário inserir:
 * - Nome/email do usuário
 * - Título da task
 */

import { useState, FormEvent } from 'react'

interface TaskFormProps {
  onTaskAdded: () => void
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [userName, setUserName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !userName.trim()) {
      setError('Por favor, preencha todos os campos')
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
          user_name: userName.trim(),
          completed: false,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao criar task')
      }

      // Limpar formulário e notificar componente pai
      setTitle('')
      setUserName('')
      onTaskAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">
        Nova Task
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome ou Email
          </label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Ex: João Silva ou joao@email.com"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Título da Task
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Estudar TypeScript"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar Task'}
        </button>
      </div>
    </form>
  )
}
