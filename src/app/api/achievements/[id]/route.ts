import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "DEPT_ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Faqat bo'lim koordinatori yutuqlarni tekshirishi mumkin" },
        { status: 403 }
      );
    }

    const { action, points, adminFeedback } = await request.json();

    const achievement = await prisma.achievement.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!achievement) {
      return NextResponse.json({ error: "Yutuq topilmadi" }, { status: 404 });
    }

    const pointsNum = action === "APPROVED" ? parseInt(points, 10) || 10 : 0;

    // 1. Yutuq statusini yangilash
    const updated = await prisma.achievement.update({
      where: { id: params.id },
      data: {
        status: action === "APPROVED" ? "APPROVED" : "REJECTED",
        points: pointsNum,
        adminFeedback: adminFeedback?.trim() || null,
        reviewedAt: new Date(),
      },
    });

    // 2. Audit logini yaratish
    await prisma.achievementReview.create({
      data: {
        achievementId: achievement.id,
        reviewerId: user.id,
        action: action === "APPROVED" ? "APPROVED" : "REJECTED",
        pointsAwarded: pointsNum,
        comment: adminFeedback?.trim() || null,
      },
    });

    // 3. Talabaning umumiy ballarini qayta hisoblash
    const allApproved = await prisma.achievement.findMany({
      where: { userId: achievement.userId, status: "APPROVED" },
    });
    const totalPoints = allApproved.reduce((sum, item) => sum + item.points, 0);

    await prisma.profile.update({
      where: { userId: achievement.userId },
      data: { totalPoints },
    });

    return NextResponse.json({ success: true, achievement: updated, totalPoints });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Yutuqni verifikatsiya qilishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
