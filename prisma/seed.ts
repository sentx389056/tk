import { PrismaClient, LogType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data (if any) — this is safe for local/dev only');

  // Delete in reverse-order of relations
  await prisma.log.deleteMany();
  await prisma.user.deleteMany();
  await prisma.technicalCommitteeMember.deleteMany();
  await prisma.executive.deleteMany();
  await prisma.standardFund.deleteMany();
  await prisma.protocol.deleteMany();
  await prisma.annualReport.deleteMany();
  await prisma.technicalCommitteeRegulation.deleteMany();
  await prisma.standardProject.deleteMany();
  await prisma.meeting.deleteMany();

  console.log('Creating technical committee members...');
  const member1 = await prisma.technicalCommitteeMember.create({
    data: {
      name: 'Иван Иванов',
      position: 'Председатель',
      organization: 'Кинокомитет',
      experience: '10 лет',
      email: 'ivan.ivanov@example.test',
      phone: '+7 900 000 0001',
      address: 'Москва',
    },
  });

  const member2 = await prisma.technicalCommitteeMember.create({
    data: {
      name: 'Мария Петрова',
      position: 'Член комитета',
      organization: 'Кинокомитет',
      experience: '6 лет',
      email: 'maria.petrova@example.test',
      phone: '+7 900 000 0002',
      address: 'Санкт-Петербург',
    },
  });

  console.log('Creating users...');
  const adminPassword = await bcrypt.hash('password', 10);
  const admin = await prisma.user.create({
    data: {
      login: 'admin',
      password: adminPassword,
      member: { connect: { id: member1.id } },
    },
  });

  const user1 = await prisma.user.create({
    data: {
      login: 'member2',
      password: await bcrypt.hash('secret', 10),
      member: { connect: { id: member2.id } },
    },
  });

  console.log('Creating executives...');
  await prisma.executive.create({
    data: {
      name: 'Олег Смирнов',
      position: 'Директор',
      organization: 'КиноЦентр',
      experience: '15 лет',
      email: 'oleg.smirnov@example.test',
      phone: '+7 900 000 0003',
      address: 'Екатеринбург',
      biography: 'Опытный руководитель в кинокультуре',
    },
  });

  console.log('Creating standard funds and related documents...');
  const standard1 = await prisma.standardFund.create({
    data: {
      title: 'Стандарт 1',
      description: 'Описание стандарта 1',
      approved: true,
      approvedAt: new Date(),
      organization: 'Организация А',
      fileUrl: '/files/standard-1.pdf',
    },
  });

  await prisma.standardFund.create({
    data: {
      title: 'Стандарт 2',
      description: 'Описание стандарта 2',
      approved: false,
      organization: 'Организация Б',
      fileUrl: '/files/standard-2.pdf',
    },
  });

  await prisma.protocol.create({
    data: {
      title: 'Протокол заседания 2025-01',
      publishedAt: new Date(),
      attachments: '/files/protocol-2025-01.pdf',
    },
  });

  await prisma.annualReport.create({
    data: {
      title: 'Ежегодный отчёт 2024',
      publishedAt: new Date('2025-03-01'),
      keyAchievements: 'Увеличение проектов и стандартов',
      fileUrl: '/files/report-2024.pdf',
    },
  });

  await prisma.technicalCommitteeRegulation.create({
    data: {
      title: 'Регламент ТК',
      description: 'Правила работы Технического комитета',
      approvedAt: new Date(),
      organization: 'Кинокомитет',
      fileUrl: '/files/regulation.pdf',
    },
  });

  await prisma.standardProject.create({
    data: {
      title: 'Проект стандартизации 2025',
      description: 'Проект по приведению стандартов в соответствие',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      fileUrl: '/files/project-2025.pdf',
    },
  });

  const meeting1 = await prisma.meeting.create({
    data: {
      title: 'Заседание комитета — январь 2025',
      publishedAt: new Date('2025-01-15'),
      format: 'Offline',
      location: 'Москва, зал 12',
      attachments: '/files/meeting-2025-01.pdf',
    },
  });

  console.log('Creating protected documents...');
  const protected1 = await prisma.protectedDocument.create({
    data: {
      title: 'Защищённый документ 1',
      description: 'Документ с ограниченным доступом по авторским правам',
      filePath: 'protected_uploads/sample-protected-doc-1.txt',
      fileName: 'sample-protected-doc-1.txt',
      copyrightHolder: 'ТК 191',
      createdBy: admin.id,
    }
  });

  const protected2 = await prisma.protectedDocument.create({
    data: {
      title: 'Защищённый документ 2',
      description: 'Дополнительный защищённый документ',
      filePath: 'protected_uploads/sample-protected-doc-2.txt',
      fileName: 'sample-protected-doc-2.txt',
      copyrightHolder: 'ТК 191',
      createdBy: admin.id,
    }
  });

  console.log('Creating logs...');
  await prisma.log.createMany({
    data: [
      {
        type: LogType.AUTH,
        action: 'User logged in',
        userId: admin.id,
        documentId: null,
        metadata: JSON.stringify({ ip: '127.0.0.1' }),
      },
      {
        type: LogType.ADD,
        action: 'Created standard fund',
        userId: admin.id,
        documentId: standard1.id,
        metadata: JSON.stringify({ source: 'seed' }),
      },
      {
        type: LogType.UPDATE,
        action: 'Updated meeting details',
        userId: user1.id,
        documentId: meeting1.id,
        metadata: JSON.stringify({ note: 'seed data' }),
      },
    ],
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
