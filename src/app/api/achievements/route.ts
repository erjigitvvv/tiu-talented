import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
    }

    const achievements = await prisma.achievement.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ achievements });
  } catch (error) {
    return NextResponse.json({ error: "Yutuqlarni yuklashda xatolik" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Faqat talabalar yutuq topshirishi mumkin" },
        { status: 403 }
      );
    }

    const { title, category, description, proofUrl, dateAchieved } = await request.json();

    if (!title || !category || !description || !proofUrl) {
      return NextResponse.json(
        { error: "Barcha maydonlarni to'ldiring (nomi, toifasi, tavsifi va dalil havolasi)" },
        { status: 400 }
      );
    }

    const achievement = await prisma.achievement.create({
      data: {
        userId: user.id,
        title: title.trim(),
        category,
        description: description.trim(),
        proofUrl: proofUrl.trim(),
        dateAchieved: dateAchieved ? new Date(dateAchieved) : new Date(),
        status: "PENDING",
        points: 0,
      },
    });

    return NextResponse.json({ success: true, achievement });
  } catch (error) {
    console.error("Create achievement error:", error);
    return NextResponse.json(
      { error: "Yutuqni yuklashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
