import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const posts = await prisma.newsEvent.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          include: { profile: true },
        },
      },
    });
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: "Xatolik" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "DEPT_ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Ruxsat etilmagan" }, { status: 403 });
    }

    const { title, summary, content, type, imageUrl, eventDate } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Sarlavha va matn majburiy" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Date.now();

    const post = await prisma.newsEvent.create({
      data: {
        title: title.trim(),
        slug,
        summary: summary ? summary.trim() : title.trim(),
        content: content.trim(),
        type: type || "EVENT_HIGHLIGHT",
        imageUrl: imageUrl ? imageUrl.trim() : null,
        eventDate: eventDate ? new Date(eventDate) : new Date(),
        authorId: user.id,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "E'lon yaratishda xatolik yuz berdi" }, { status: 500 });
  }
}
