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
        { error: "Ariza topshirish uchun avval tizimga kiring" },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Faqat talabalar ariza topshirishi mumkin" },
        { status: 403 }
      );
    }

    const { coverLetter, portfolioUrl } = await request.json();

    if (!coverLetter || coverLetter.trim().length < 20) {
      return NextResponse.json(
        { error: "Motivatsion xatingiz kamida 20 ta belgidan iborat bo'lishi kerak" },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: params.id },
    });

    if (!opportunity || opportunity.status !== "OPEN") {
      return NextResponse.json(
        { error: "Ushbu tanlovga arizalar qabuli to'xtatilgan" },
        { status: 400 }
      );
    }

    // Tekshirish: talaba oldin ariza topshirganmi?
    const existing = await prisma.application.findUnique({
      where: {
        opportunityId_userId: {
          opportunityId: params.id,
          userId: user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Siz ushbu tanlovga allaqachon ariza topshirgansiz" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        opportunityId: params.id,
        userId: user.id,
        coverLetter: coverLetter.trim(),
        portfolioUrl: portfolioUrl?.trim() || null,
        status: "SUBMITTED",
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Apply error:", error);
    return NextResponse.json(
      { error: "Arizani yuborishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
