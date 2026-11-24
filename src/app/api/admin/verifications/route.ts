import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "DEPT_ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 403 });
    }

    const achievements = await prisma.achievement.findMany({
      where: { status: "PENDING" },
      include: {
        user: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ achievements });
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
