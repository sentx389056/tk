import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        person: true,
      },
      orderBy: { person: { name: 'asc' } },
    });

    const safeUsers = users.map((user) => ({
      id: user.id,
      name: user.person.name,
      email: user.person.email,
      position: user.person.position,
      organization: user.person.organization,
      phone: user.person.phone,
      address: user.person.address,
      experience: user.person.experience,
    }));

    return NextResponse.json(safeUsers, { status: 200 });
  } catch (error) {
    console.error('Ошибка в API /users:', error);
    return NextResponse.json({ error: 'Не удалось загрузить пользователей' }, { status: 500 });
  }
}