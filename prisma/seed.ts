import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 12);

    // ========= 3 РУКОВОДИТЕЛЯ + ПОЛЬЗОВАТЕЛИ =========
    for (let i = 1; i <= 3; i++) {
        const exec = await prisma.executive.create({
            data: {
                name: `Руководитель ${i}`,
                position: `Директор направления ${i}`,
                organization: `Фонд стандартизации ${i}`,
                experience: `Опыт ${10 + i} лет`,
                email: `exec${i}@example.com`,
                phone: `+7 (495) 000-00-0${i}`,
                address: `г. Москва, ул. Новая, д. ${i}`,
                biography: `Биография руководителя ${i}`,
                education: `Образование руководителя ${i}`,
                achievements: JSON.stringify([
                    `Достижение ${i}.1`,
                    `Достижение ${i}.2`
                ]),
                awards: JSON.stringify([
                    `Награда ${i}.1`,
                    `Премия ${i}.2`
                ]),
            }

        });

        await prisma.user.create({
            data: {
                login: `exec${i}`,
                password: hashedPassword,
                executiveId: exec.id,
            }

        });
    }

    // ========= 3 ЧЛЕНА ТЕХНИЧЕСКОГО КОМИТЕТА =========
    for (let i = 1; i <= 3; i++) {
        await prisma.technicalCommitteeMember.create({
            data: {
                name: `Член ТК ${i}`,
                position: `Эксперт по стандартизации ${i}`,
                organization: `Организация ТК ${i}`,
                experience: `Опыт ${5 + i} лет`,
                email: `member${i}@tk-cinema.ru`,
                phone: `+7 (999) 111-22-0${i}`,
                address: `г. Город ${i}, ул. Комитетская, д. ${i}`,
            }
        });
    }

    // ========= 3 ФОНДА СТАНДАРТОВ =========
    const funds = [
        { title: 'Национальный фонд', org: 'Минэкономразвития' },
        { title: 'Региональный фонд Сибири', org: 'Правительство НСО' },
        { title: 'Фонд цифровых стандартов', org: 'Ассоциация ИТ' },
    ];
    for (let i = 0; i < funds.length; i++) {
        await prisma.standardFund.create({
            data: {
                title: funds[i].title,
                description: `Описание фонда ${i + 1}`,
                approved: true,
                approvedAt: new Date(2023, 5 + i, 1),
                organization: funds[i].org,
                fileUrl: `/files/fund-${i + 1}.pdf`,
            }
        });
    }

    // ========= 3 ПРОТОКОЛА =========
    for (let i = 1; i <= 3; i++) {
        await prisma.protocol.create({
            data: {
                title: `Протокол ТК-${i}`,
                publishedAt: new Date(2025, i - 1, 10),
                attachments: JSON.stringify([
                    { fileName: `Протокол-${i}.pdf`, fileUrl: `/files/protocol-${i}.pdf` }
                ]),
            }
        });
    }

    // ========= 3 ГОДОВЫХ ОТЧЁТА =========
    for (let i = 1; i <= 3; i++) {
        await prisma.annualReport.create({
            data: {
                title: `Годовой отчёт за 202${i + 1}`,
                publishedAt: new Date(2025, i - 1, 15),
                keyAchievements: JSON.stringify([
                    `Достижение отчёта ${i}.1`,
                    `Достижение отчёта ${i}.2`
                ]),
                fileUrl: `/files/report-${i}.pdf`,
            }
        });
    }

    // ========= 3 ПОЛОЖЕНИЯ О ТК =========
    for (let i = 1; i <= 3; i++) {
        await prisma.technicalCommitteeRegulation.create({
            data: {
                title: `Положение о ТК ${i}`,
                description: `Описание положения ${i}`,
                approvedAt: new Date(2024, 8 + i, 1),
                organization: `Организация ${i}`,
                fileUrl: `/files/regulation-${i}.pdf`,
            }

        });
    }

    // ========= 3 ПРОЕКТА СТАНДАРТА =========
    for (let i = 1; i <= 3; i++) {
        await prisma.standardProject.create({
            data: {
                title: `Проект стандарта ${i}`,
                description: `Описание проекта ${i}`,
                startDate: new Date(2025, i - 1, 1),
                endDate: new Date(2025, i + 5, 1),
                fileUrl: `/files/project-${i}.pdf`,
            }
        });
    }

    // ========= 3 ЗАСЕДАНИЯ =========
    for (let i = 1; i <= 3; i++) {
        await prisma.meeting.create({
            data: {
                title: `Заседание ТК №${i}`,
                publishedAt: new Date(2025, i - 1, 20),
                format: i === 1 ? 'Очное' : i === 2 ? 'Гибридное' : 'Заочное',
                location: `Место заседания ${i}`,
                attachments: JSON.stringify([
                    { fileName: `Повестка-${i}.pdf`, fileUrl: `/files/meeting-${i}-agenda.pdf` }
                ]),
            }
        });
    }

    console.log('✅ Seed data created successfully');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });