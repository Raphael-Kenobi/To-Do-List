import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// N8N Webhook URL
const N8N_WEBHOOK_URL = 'https://challenge-tasks.app.n8n.cloud/webhook/task-list'

/**
 * POST /api/tasks/[id]/notes
 * Adds a note to a task and triggers the AI webhook
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id
    
    // Robust body parsing to handle cases where Content-Type might be missing
    let body;
    try {
      // Try standard JSON parsing
      body = await request.json();
    } catch (e) {
      // If that fails, try reading as text and parsing manually
      try {
        const text = await request.text();
        if (text) {
          body = JSON.parse(text);
        } else {
          body = {};
        }
      } catch (textError) {
        return NextResponse.json(
          { error: 'Invalid JSON body' },
          { status: 400 }
        );
      }
    }

    const { note } = body

    if (!taskId || !note) {
      return NextResponse.json(
        { error: 'Task ID and note content are required' },
        { status: 400 }
      )
    }

    // 1. Verify task exists and get its title
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

    // 2. Save note to database
    const { data: noteData, error: noteError } = await supabase
      .from('task_notes')
      .insert([
        {
          task_id: taskId,
          content: note.trim()
        }
      ])
      .select()
      .single()

    if (noteError) {
      console.error('Error saving note:', noteError)
      return NextResponse.json(
        { error: 'Error saving note' },
        { status: 500 }
      )
    }

    // 3. Trigger N8N Webhook
    // We do this asynchronously but await it to ensure it was sent
    // In a production app, this might be a background job
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: taskId,
          task_title: task.title,
          note: note.trim()
        })
      })
    } catch (webhookError) {
      console.error('Error triggering AI webhook:', webhookError)
      // We don't fail the request if the webhook fails, but we log it
    }

    return NextResponse.json({ note: noteData }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
