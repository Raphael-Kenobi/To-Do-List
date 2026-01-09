import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// N8N Webhook URL
const N8N_WEBHOOK_URL = 'https://challenge-tasks.app.n8n.cloud/webhook/task-list'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Get Task ID from URL params
    const taskId = params.id

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    // 2. Parse Body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    // 3. Validate Content
    // Support 'content' (requested) or 'note' (backward compatibility)
    const content = body.content || body.note

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      )
    }

    // 4. Verify Task Exists
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('title')
      .eq('id', taskId)
      .single()

    if (taskError || !task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // 5. Insert Note
    const { data: noteData, error: noteError } = await supabase
      .from('task_notes')
      .insert([
        {
          task_id: taskId,
          content: content.trim()
        }
      ])
      .select()
      .single()

    if (noteError) {
      console.error('Error saving note:', noteError)
      return NextResponse.json(
        { error: 'Failed to save note' },
        { status: 500 }
      )
    }

    // 6. Trigger Webhook (Fire and forget)
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          task_title: task.title,
          note: content.trim()
        })
      })
    } catch (webhookError) {
      console.error('Webhook error:', webhookError)
    }

    return NextResponse.json(noteData, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
