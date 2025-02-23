import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Update type definition for params - remove Promise wrapper
type Params = { id: string };

// Get single task
export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Remove await from params.id since it's no longer a Promise
    const { id } = params;
    const task = await db.task.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!task) {
      return new NextResponse("Task not found", { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("[TASK_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Update task
const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Remove await from params.id
    const { id } = params;
    const body = await req.json();
    const { title, completed } = updateTaskSchema.parse(body);

    const task = await db.task.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        ...(title && { title }),
        ...(completed !== undefined && { completed }),
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("[TASK_PATCH]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Delete task
export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Remove await from params.id
    const { id } = params;
    await db.task.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TASK_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
