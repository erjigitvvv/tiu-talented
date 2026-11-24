import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.newsComment.findMany({
      where: { newsId: params.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: "Izohlarni olishda xatolik" }, { status: 500 });
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
      return NextResponse.json({ error: "Izoh matnini kiriting" }, { status: 400 });
    }

    const authorName = user?.profile?.fullName || body.authorName || "Talaba / Mehmon";
    const authorAvatar = user?.profile?.avatarUrl || null;

    const comment = await prisma.newsComment.create({
      data: {
        newsId: params.id,
        authorName,
        authorAvatar,
        content,
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    return NextResponse.json({ error: "Izoh jo'natishda xatolik" }, { status: 500 });
  }
}