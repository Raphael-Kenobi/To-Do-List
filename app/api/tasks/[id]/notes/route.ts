import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Note: In Next.js App Router dynamic routes, the folder name [id] determines the param key.
    // So params.id is correct based on your file structure app/api/tasks/[id]/notes/route.ts
    const taskId = params.id;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is missing in URL" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("task_notes")
      .insert({
        task_id: taskId,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to insert note" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, note: data },
      { status: 201 }
    );
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
