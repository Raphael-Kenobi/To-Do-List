'use client'

/**
 * Página principal da aplicação
 * 
 * Integra os componentes TaskForm e TaskList
 * Demonstra a arquitetura API-first onde o frontend
 * nunca acessa Supabase diretamente
 */

import { useState } from 'react'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTaskAdded = () => {
    // Força atualização da lista de tasks
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            To-Do List
          </h1>
          <p className="text-gray-600">
            Gerencie suas tasks de forma simples e eficiente
          </p>
        </header>

        <div className="space-y-6">
          <TaskForm onTaskAdded={handleTaskAdded} />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Suas Tasks
            </h2>
            <TaskList key={refreshKey} />
          </div>
        </div>
      </div>
    </main>
  )
}

