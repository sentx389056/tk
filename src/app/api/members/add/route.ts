import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const member = await prisma.technicalCommitteeMember.create({
            data: {
                name: body.name,
                position: body.position,
                organization: body.organization,
                experience: body.experience,
                email: body.email,
                phone: body.phone,
                address: body.address,
            },
        });

        return NextResponse.json(member, { status: 201 });
    } catch (error) {
        console.error("Error adding member:", error);
        return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
    }
}