import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  // ========= 3 обычных пользователя =========
  for (let i = 1; i <= 3; i++) {
    const person = await prisma.person.create({
      data: {
        name: `Пользователь ${i}`,
        position: `Должность ${i}`,
        organization: `Организация ${i}`,
        experience: `Опыт работы ${i} лет`,
        email: `user${i}@example.com`,
        phone: `+7 (999) 000-00-0${i}`,
        address: `г. Город ${i}, ул. Улица ${i}, д. ${i}`,
      },
    });

    await prisma.user.create({
      data: {
        login: `user${i}`,
        password: hashedPassword,
        personId: person.id,
      },
    });
  }

  // ========= 3 руководителя =========
  const execBios = [
    'Руководит направлением цифровой трансформации.',
    'Отвечает за международное сотрудничество.',
    'Курирует научно-исследовательские проекты.'
  ];
  const educations = [
    'МГУ, доктор технических наук',
    'СПбГУ, кандидат экономических наук',
    'НИУ ВШЭ, магистр государственного управления'
  ];
  const achievementsList = [
    ['Запуск платформы ИИ', 'Интеграция с ISO'],
    ['Подписание меморандума с ЕС', 'Рост числа стандартов на 40%'],
    ['Создание лаборатории инноваций', 'Победа в нац. конкурсе']
  ];
  const awardsList = [
    ['Госпремия РФ', 'Медаль "За вклад в науку"'],
    ['Премия Президента', 'Золотой знак стандартизации'],
    ['Благодарность Минэкономразвития', 'Почётный работник отрасли']
  ];

  for (let i = 0; i < 3; i++) {
    const person = await prisma.person.create({
      data: {
        name: `Руководитель ${i + 1}`,
        position: `Руководящая должность ${i + 1}`,
        organization: `Фонд развития стандартов ${i + 1}`,
        experience: `Управленческий стаж ${10 + i} лет`,
        email: `exec${i + 1}@fund-standards.ru`,
        phone: `+7 (495) 100-00-0${i + 1}`,
        address: `г. Москва, Пресненская наб., д. ${10 + i}`,
      },
    });

    await prisma.executive.create({
      data: {
        personId: person.id,
        biography: execBios[i],
        education: educations[i],
        achievements: JSON.stringify(achievementsList[i]),
        awards: JSON.stringify(awardsList[i]),
      },
    });
  }

  // ========= 3 фонда стандартов =========
  const funds = [
    {
      title: 'Национальный фонд стандартов',
      description: 'Координация национальной системы стандартизации.',
      organization: 'Минэкономразвития России',
      fileUrl: '/files/fund1.pdf',
    },
    {
      title: 'Региональный фонд Сибири',
      description: 'Поддержка стандартов в субъектах СФО.',
      organization: 'Правительство Новосибирской области',
      fileUrl: '/files/fund2.pdf',
    },
    {
      title: 'Фонд цифровых стандартов',
      description: 'Развитие стандартов в сфере ИТ и ИИ.',
      organization: 'Ассоциация цифровых технологий',
      fileUrl: '/files/fund3.pdf',
    },
  ];

  for (let i = 0; i < funds.length; i++) {
    await prisma.standardFund.create({
      data: {
        ...funds[i],
        approved: true,
        approvedAt: new Date(2023, 4 + i, 15), // май, июнь, июль 2023
      },
    });
  }

  // ========= 3 протокола =========
  for (let i = 1; i <= 3; i++) {
    await prisma.protocol.create({
      data: {
        title: `Протокол заседания ТК-${i} от 01.0${i}.2025`,
        publishedAt: new Date(2025, i - 1, 1),
        attachments: JSON.stringify([
          { fileName: `Протокол_ТК-${i}.pdf`, fileUrl: `/files/protocol-tk${i}.pdf` },
          { fileName: `Приложение_ТК-${i}.xlsx`, fileUrl: `/files/appendix-tk${i}.xlsx` },
        ]),
      },
    });
  }

  // ========= 3 годовых отчёта =========
  const reports = [
    {
      title: 'Годовой отчёт за 2022 год',
      publishedAt: new Date('2023-03-31'),
      keyAchievements: ['Разработано 30 стандартов', 'Проведено 60 заседаний', 'Запущен пилотный проект'],
    },
    {
      title: 'Годовой отчёт за 2023 год',
      publishedAt: new Date('2024-03-31'),
      keyAchievements: ['Разработано 38 стандартов', 'Проведено 75 заседаний', 'Интеграция с ЕАЭС'],
    },
    {
      title: 'Годовой отчёт за 2024 год',
      publishedAt: new Date('2025-03-31'),
      keyAchievements: ['Разработано 42 стандарта', 'Проведено 87 заседаний', 'Запущена цифровая платформа'],
    },
  ];

  for (const report of reports) {
    await prisma.annualReport.create({
      data: {
        title: report.title,
        publishedAt: report.publishedAt,
        keyAchievements: JSON.stringify(report.keyAchievements),
        fileUrl: `/files/${report.title.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      },
    });
  }

  // ========= 3 положения о ТК =========
  const regulations = [
    {
      title: 'Положение о ТК по ИИ',
      description: 'Регламент работы в области искусственного интеллекта.',
      organization: 'Фонд развития стандартов',
      fileUrl: '/files/regulation-ai.pdf',
    },
    {
      title: 'Положение о ТК по кибербезопасности',
      description: 'Стандартизация в сфере информационной безопасности.',
      organization: 'Российская ассоциация ИБ',
      fileUrl: '/files/regulation-cyber.pdf',
    },
    {
      title: 'Положение о ТК по зелёным технологиям',
      description: 'Экологические стандарты и устойчивое развитие.',
      organization: 'Экологический фонд России',
      fileUrl: '/files/regulation-green.pdf',
    },
  ];

  for (let i = 0; i < regulations.length; i++) {
    await prisma.technicalCommitteeRegulation.create({
      data: {
        title: regulations[i].title,
        description: regulations[i].description,
        approvedAt: new Date(2024, 10 + i, 1), // ноябрь, декабрь 2024, январь 2025
        organization: regulations[i].organization,
        fileUrl: regulations[i].fileUrl,
      },
    });
  }

  // ========= 3 проекта стандартов =========
  const projects = [
    {
      title: 'Проект: ИИ в здравоохранении',
      description: 'Требования к алгоритмам диагностики.',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-12-31'),
      fileUrl: '/files/project-ai-health.pdf',
    },
    {
      title: 'Проект: Кибербезопасность для КИП',
      description: 'Защита промышленных систем.',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-11-30'),
      fileUrl: '/files/project-cyber-kip.pdf',
    },
    {
      title: 'Проект: Стандарты для ВИЭ',
      description: 'Возобновляемые источники энергии.',
      startDate: new Date('2025-03-10'),
      endDate: new Date('2026-03-10'),
      fileUrl: '/files/project-green-energy.pdf',
    },
  ];

  for (const proj of projects) {
    await prisma.standardProject.create({
      data: {
        title: proj.title,
        description: proj.description,
        startDate: proj.startDate,
        endDate: proj.endDate,
        fileUrl: proj.fileUrl,
      },
    });
  }

const meetings = [
  {
    title: 'Заседание ТК по кинематографии №1',
    publishedAt: new Date('2025-03-15'),
    format: 'Очное',
    location: 'г. Москва, ул. Вавилова, д. 15, конференц-зал',
    attachments: JSON.stringify([
      { fileName: 'Повестка.pdf', fileUrl: '/files/meeting1-agenda.pdf' },
      { fileName: 'Протокол.pdf', fileUrl: '/files/meeting1-protocol.pdf' },
    ]),
  },
  {
    title: 'Заседание ТК по кинематографии №2',
    publishedAt: new Date('2025-06-20'),
    format: 'Гибридное',
    location: 'г. Санкт-Петербург, Невский пр., д. 10 + Zoom',
    attachments: JSON.stringify([
      { fileName: 'Повестка.pdf', fileUrl: '/files/meeting2-agenda.pdf' },
    ]),
  },
  {
    title: 'Внеочередное заседание по стандарту ИИ',
    publishedAt: new Date('2025-09-10'),
    format: 'Заочное',
    location: 'Электронная форма',
    attachments: JSON.stringify([
      { fileName: 'Решение.pdf', fileUrl: '/files/meeting3-decision.pdf' },
    ]),
  },
];


  for (const meet of meetings) {
    await prisma.meeting.create({
      data: {
        title: meet.title,
        publishedAt: meet.publishedAt,
        format: meet.format,
        location: meet.location,
        attachments: meet.attachments,
      },
    });
  }

  console.log('✅ Все тестовые данные (по 3 записи на модель) успешно загружены!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при загрузке данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });