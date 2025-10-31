// app/api/discussions/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth-utils";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
    }

    // ⚠️ Важно: await params!
    const { id } = await context.params;
    const discussionId = parseInt(id, 10);

    if (isNaN(discussionId)) {
      return NextResponse.json({ error: "Некорректный ID обсуждения" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['open', 'closed', 'resolved'].includes(status)) {
      return NextResponse.json(
        { error: "Недопустимый статус. Допустимые значения: open, closed, resolved" },
        { status: 400 }
      );
    }

    const updatedDiscussion = await prisma.internalDiscussion.update({
      where: { id: discussionId },
      data: { status },
    });

    return NextResponse.json({ discussion: updatedDiscussion }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обновлении статуса обсуждения:", error);
    return NextResponse.json(
      { error: "Не удалось обновить статус" },
      { status: 500 }
    );
  }
}