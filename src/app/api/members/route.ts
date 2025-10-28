import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get('page');
    const pageSizeParam = url.searchParams.get('pageSize');

    // If pagination params are provided, return a paginated response
    if (pageParam && pageSizeParam) {
      const page = Math.max(1, parseInt(pageParam || '1', 10));
      const pageSize = Math.max(1, parseInt(pageSizeParam || '10', 10));

      const total = await prisma.technicalCommitteeMember.count();
      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      const members = await prisma.technicalCommitteeMember.findMany({
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      return NextResponse.json({ members, total, page, pageSize, totalPages }, { status: 200 });
    }

    // Fallback: return full array (existing behavior)
    const members = await prisma.technicalCommitteeMember.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error('Ошибка в API /members:', error);
    return NextResponse.json({ error: 'Не удалось загрузить пользователей' }, { status: 500 });
  }
}