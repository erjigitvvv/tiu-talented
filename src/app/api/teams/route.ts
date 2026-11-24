import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        leader: { include: { profile: true } },
        members: {
          include: {
            user: { include: { profile: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ teams });
  } catch (error) {
    return NextResponse.json({ error: "Jamoalarni yuklashda xatolik" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'ting" }, { status: 401 });
    }

    const { name, category, faculty, description, neededRoles, avatarUrl, projectUrl } = await request.json();

    if (!name || !category || !description) {
      return NextResponse.json(
        { error: "Jamoa nomi, toifasi va tavsifi kiritilishi shart" },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Date.now();

    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        slug,
        category,
        faculty: faculty || null,
        description: description.trim(),
        neededRoles: neededRoles ? neededRoles.trim() : null,
        avatarUrl: avatarUrl ? avatarUrl.trim() : null,
        projectUrl: projectUrl ? projectUrl.trim() : null,
        leaderId: user.id,
        members: {
          create: {
            userId: user.id,
            role: "LEADER",
            status: "ACCEPTED",
          },
        },
      },
    });

    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error("Create team error:", error);
    return NextResponse.json({ error: "Jamoa yaratishda xatolik yuz berdi" }, { status: 500 });
  }
}
