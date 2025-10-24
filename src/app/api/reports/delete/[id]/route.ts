import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(_: any, { params }: any) {
    await prisma.annualReport.delete({
        where : { id: Number(params.id) }
    })
    return NextResponse.json({ ok: true });
}