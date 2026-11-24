import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "DEPT_ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Faqat bo'lim xodimlari tanlov yaratishi mumkin" },
        { status: 403 }
      );
    }

    const { title, type, description, requirements, deadline, quota, award } = await request.json();

    if (!title || !type || !description || !deadline) {
      return NextResponse.json(
        { error: "Nomi, toifasi, tavsifi va muddati kiritilishi shart" },
        { status: 400 }
      );
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        title: title.trim(),
        type,
        description: description.trim(),
        requirements: requirements ? requirements.trim() : null,
        deadline: new Date(deadline),
        quota: parseInt(quota, 10) || 1,
        award: award ? award.trim() : null,
        status: "OPEN",
      },
    });

    return NextResponse.json({ success: true, opportunity });
  } catch (error) {
    console.error("Create opportunity error:", error);
    return NextResponse.json(
      { error: "Tanlov yaratishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
