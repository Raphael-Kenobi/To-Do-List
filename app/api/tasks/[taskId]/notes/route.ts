// app/api/tasks/[taskId]/notes/route.ts
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const body = await request.json();

  return NextResponse.json({
    ok: true,
    taskId: params.taskId,
    body,
  });
}
