import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page");
    const pageSizeParam = url.searchParams.get("pageSize");
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          organization: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          contactName: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (pageParam && pageSizeParam) {
      const page = Math.max(1, parseInt(pageParam || "1", 10));
      const pageSize = Math.max(1, parseInt(pageSizeParam || "12", 10));

      const total = await prisma.applicationRequest.count({ where });
      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      const applications = await prisma.applicationRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      return NextResponse.json({ applications, total, page, pageSize, totalPages }, { status: 200 });
    }

    // Fallback: вернуть полный список (для админ-панели и старых вызовов)
    const applications = await prisma.applicationRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Ошибка в API /applications (GET):", error);
    return NextResponse.json({ error: "Не удалось загрузить заявки" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.organization || !body.contactName || !body.email) {
      return NextResponse.json({ error: "Необходимо указать организацию, контактное лицо и email" }, { status: 400 });
    }

    const application = await prisma.applicationRequest.create({
      data: {
        organization: body.organization,
        contactName: body.contactName,
        email: body.email,
        phone: body.phone,
        message: body.message,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Ошибка в API /applications (POST):", error);
    return NextResponse.json({ error: "Не удалось отправить заявку" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!body.id || !body.status) {
      return NextResponse.json({ error: "Необходимо указать id и новый статус" }, { status: 400 });
    }

    const updated = await prisma.applicationRequest.update({
      where: { id: body.id },
      data: { status: body.status },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Ошибка в API /applications (PATCH):", error);
    return NextResponse.json({ error: "Не удалось обновить статус заявки" }, { status: 500 });
  }
}
