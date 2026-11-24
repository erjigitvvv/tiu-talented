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
        { error: "Ruxsat etilmagan amal" },
        { status: 403 }
      );
    }

    const { status, adminNotes } = await request.json();

    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        status, // "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED"
        adminNotes: adminNotes ? adminNotes.trim() : null,
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Application evaluation error:", error);
    return NextResponse.json(
      { error: "Arizani baholashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
