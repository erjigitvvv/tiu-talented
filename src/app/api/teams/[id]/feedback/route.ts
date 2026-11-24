import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json({ error: "Xulosa yoki izoh matnini kiriting" }, { status: 400 });
    }

    const authorName = user?.profile?.fullName || body.authorName || "Mehmon";
    const authorRole =
      user?.role === "SUPER_ADMIN"
        ? "Bosh Administrator"
        : user?.role === "DEPT_ADMIN"
        ? "Iqtidorlilar bo'limi"
        : user?.role === "STUDENT"
        ? "Talaba"
        : "Mehmon / Mentor";

    const feedback = await prisma.teamFeedback.create({
      data: {
        teamId: params.id,
        authorName,
        authorRole,
        authorAvatar: user?.profile?.avatarUrl || null,
        content,
        rating: body.rating || 5,
      },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    return NextResponse.json({ error: "Xulosa saqlashda xatolik" }, { status: 500 });
  }
}