import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, fullName, studentId, faculty, groupName, courseYear, phone } = await request.json();

    if (!email || !password || !fullName || !faculty || !groupName) {
      return NextResponse.json(
        { error: "Barcha majburiy maydonlarni to'ldiring" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          ...(studentId ? [{ studentId: studentId.trim() }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ushbu email yoki Talaba ID bilan ro'yxatdan o'tilgan" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        studentId: studentId ? studentId.trim() : null,
        passwordHash,
        role: "STUDENT",
        profile: {
          create: {
            fullName: fullName.trim(),
            faculty,
            groupName: groupName.trim(),
            courseYear: parseInt(courseYear, 10) || 1,
            phone: phone || null,
            totalPoints: 0,
          },
        },
      },
      include: { profile: true },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      studentId: user.studentId,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.profile?.fullName,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Ro'yxatdan o'tishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
