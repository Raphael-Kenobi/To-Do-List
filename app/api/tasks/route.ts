/**
 * API Routes for task management
 * 
 * Architecture: API-first design
 * - All database operations go through these routes
 * - Frontend fetches these routes, never accesses Supabase directly
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Type for a task
export interface Task {
  id: string
  title: string
  completed: boolean
  user_name: string
  created_at: string
}

/**
 * GET /api/tasks
 * Fetches all tasks
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userName = searchParams.get('user_name')

    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (userName) {
      query = query.eq('user_name', userName)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching tasks:', error)
      return NextResponse.json(
        { error: 'Error fetching tasks' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tasks: data || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tasks
 * Creates a new task
 * 
 * NOTE: This does NOT trigger the AI webhook.
 * The AI webhook is only triggered when adding a note to a task
 * via POST /api/tasks/[id]/notes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, user_name, completed = false } = body

    if (!title || !user_name) {
      return NextResponse.json(
        { error: 'title and user_name are required' },
        { status: 400 }
      )
    }

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
      console.error('Error creating task:', error)
      return NextResponse.json(
        { error: 'Error creating task' },
        { status: 500 }
      )
    }

    return NextResponse.json({ task: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/tasks
 * Updates an existing task
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, completed } = body

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    const updates: Partial<Task> = {}
    if (title !== undefined) updates.title = title.trim()
    if (completed !== undefined) updates.completed = completed

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating task:', error)
      return NextResponse.json(
        { error: 'Error updating task' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ task: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/tasks
 * Deletes a task
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting task:', error)
      return NextResponse.json(
        { error: 'Error deleting task' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
