import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
    }

    const { memberId, status } = await request.json();

    const team = await prisma.team.findUnique({
      where: { id: params.id },
    });

    if (!team) {
      return NextResponse.json({ error: "Jamoa topilmadi" }, { status: 404 });
    }

    // Leader yoki Department Admin tekshira oladi
    const isLeader = team.leaderId === user.id;
    const isDept = user.role === "DEPT_ADMIN" || user.role === "SUPER_ADMIN";

    if (!isLeader && !isDept) {
      return NextResponse.json({ error: "Bu amalni bajarishga vakolatingiz yo'q" }, { status: 403 });
    }

    const updated = await prisma.teamMember.update({
      where: { id: memberId },
      data: { status }, // "ACCEPTED" | "REJECTED"
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    console.error("Member update error:", error);
    return NextResponse.json({ error: "A'zo holatini o'zgartirishda xatolik" }, { status: 500 });
  }
}
