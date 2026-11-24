import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const achievementId = params.id;
    const updated = await prisma.teamAchievement.update({
      where: { id: achievementId },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true, likesCount: updated.likesCount });
  } catch (error) {
    return NextResponse.json({ error: "Like bosishda xatolik yuz berdi" }, { status: 500 });
  }
}