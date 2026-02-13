import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {

        // Get user ID from the cookie
        const cookies = request.headers.get('cookie');
        let userId = null;

        if (cookies) {
            const tkUserCookie = cookies.split(';').find(c => c.trim().startsWith('tk_user='));
            if (tkUserCookie) {
                try {
                    const userData = JSON.parse(decodeURIComponent(tkUserCookie.split('=')[1]));
                    userId = userData.id;
                } catch (e) {
                    console.error('Error parsing user cookie:', e);
                }
            }
        }

        const body = await request.json();
        
        console.log('Received news data:', body);

        if (!body.title || !body.description) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }

        const news = await prisma.news.create({
            data: {
                title: body.title,
                description: body.description,
                url: body.url,
                category: body.category,
                date: body.date ? new Date(body.date) : new Date(),
            },
        });

        // Log the action if we have a user ID
        if (userId) {
            await prisma.log.create({
                data: {
                    type: 'ADD',
                    entity: 'Добавление новости',
                    userId,
                    metadata: JSON.stringify({
                        memberId: news.id,
                        memberName: news.title,
                        timestamp: new Date().toISOString()
                    })
                }
            });
        }


        return NextResponse.json(news, { status: 201 });
    } catch (error) {
        console.error("Error adding news:", error);
        console.error("Error details:", error instanceof Error ? error.message : 'Unknown error');
        console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json({ 
            error: "Failed to add news", 
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}