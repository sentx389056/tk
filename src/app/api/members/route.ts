import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const members = await prisma.technicalCommitteeMember.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error('Ошибка в API /members:', error);
    return NextResponse.json({ error: 'Не удалось загрузить пользователей' }, { status: 500 });
  }
}