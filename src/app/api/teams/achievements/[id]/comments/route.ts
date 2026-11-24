import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.teamAchievementComment.findMany({
      where: { achievementId: params.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: "Izohlarni yuklashda xatolik" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json({ error: "Izoh matni bo'sh bo'lishi mumkin emas" }, { status: 400 });
    }

    const authorName = user?.profile?.fullName || body.authorName || "Mehmon";
    const authorAvatar = user?.profile?.avatarUrl || null;

    const newComment = await prisma.teamAchievementComment.create({
      data: {
        achievementId: params.id,
        authorName,
        authorAvatar,
        content,
      },
    });

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    return NextResponse.json({ error: "Izoh qo'shishda xatolik" }, { status: 500 });
  }
}