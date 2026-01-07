/**
 * API Routes para gerenciamento de tasks
 * 
 * Arquitetura: API-first design
 * - Todas as operações de banco de dados passam por estas rotas
 * - Frontend faz fetch para estas rotas, nunca acessa Supabase diretamente
 * - Estrutura preparada para adicionar webhooks N8N e integrações LLM no futuro
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Tipo para uma task
export interface Task {
  id: string
  title: string
  completed: boolean
  user_name: string
  created_at: string
}

/**
 * GET /api/tasks
 * Busca todas as tasks
 * 
 * Query params opcionais:
 * - user_name: filtrar por nome de usuário
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userName = searchParams.get('user_name')

    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    // Filtro opcional por usuário
    if (userName) {
      query = query.eq('user_name', userName)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar tasks:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar tasks' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tasks: data || [] })
  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tasks
 * Cria uma nova task
 * 
 * Body esperado:
 * {
 *   title: string (obrigatório)
 *   user_name: string (obrigatório)
 *   completed?: boolean (opcional, default: false)
 * }
 * 
 * Futuro: Aqui podemos adicionar um webhook para N8N após criar a task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, user_name, completed = false } = body

    // Validação básica
    if (!title || !user_name) {
      return NextResponse.json(
        { error: 'title e user_name são obrigatórios' },
        { status: 400 }
      )
    }

    // Inserir task no banco
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: title.trim(),
          user_name: user_name.trim(),
          completed,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar task:', error)
      return NextResponse.json(
        { error: 'Erro ao criar task' },
        { status: 500 }
      )
    }

    // TODO: Futuro - Chamar webhook N8N aqui
    // await fetch(N8N_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(data) })

    // TODO: Futuro - Melhorar título com LLM aqui se necessário
    // const enhancedTitle = await enhanceTitleWithLLM(title)

    return NextResponse.json({ task: data }, { status: 201 })
  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/tasks
 * Atualiza uma task existente
 * 
 * Body esperado:
 * {
 *   id: string (obrigatório)
 *   title?: string (opcional)
 *   completed?: boolean (opcional)
 * }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, completed } = body

    // Validação básica
    if (!id) {
      return NextResponse.json(
        { error: 'id é obrigatório' },
        { status: 400 }
      )
    }

    // Construir objeto de atualização apenas com campos fornecidos
    const updates: Partial<Task> = {}
    if (title !== undefined) updates.title = title.trim()
    if (completed !== undefined) updates.completed = completed

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo para atualizar' },
        { status: 400 }
      )
    }

    // Atualizar task no banco
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar task:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar task' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Task não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ task: data })
  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

