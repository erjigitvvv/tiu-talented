import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Jamoaga qo'shilish uchun avval tizimga kiring" },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Faqat talabalar jamoaga a'zo bo'la oladi" },
        { status: 403 }
      );
    }

    const { role, joinNote } = await request.json();

    const team = await prisma.team.findUnique({
      where: { id: params.id },
    });

    if (!team) {
      return NextResponse.json({ error: "Jamoa topilmadi" }, { status: 404 });
    }

    // Tekshirish: talaba allaqachon a'zomi yoki so'rov yuborganmi?
    const existing = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: params.id,
          userId: user.id,
        },
      },
    });

    if (existing) {
      if (existing.status === "ACCEPTED") {
        return NextResponse.json({ error: "Siz ushbu jamoaga allaqachon a'zosiz" }, { status: 400 });
      }
      return NextResponse.json({ error: "Sizning a'zolik so'rovingiz ko'rib chiqilmoqda" }, { status: 400 });
    }

    const membership = await prisma.teamMember.create({
      data: {
        teamId: params.id,
        userId: user.id,
        role: role || "DEVELOPER",
        status: "PENDING",
        joinNote: joinNote?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, membership });
  } catch (error) {
    console.error("Team join error:", error);
    return NextResponse.json(
      { error: "Jamoaga qo'shilishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
