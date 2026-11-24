import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await prisma.newsEvent.update({
      where: { id: params.id },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true, likesCount: updated.likesCount });
  } catch (error) {
    return NextResponse.json({ error: "Like bosishda xatolik" }, { status: 500 });
  }
}