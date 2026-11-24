import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, phone, groupName, courseYear, faculty, email, password } = await request.json();

    if (!firstName || !lastName || !phone || !groupName || !password) {
      return NextResponse.json(
        { error: "Ism, familiya, telefon raqam, guruh va parolni to'ldirish shart" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const cleanEmail = email ? email.toLowerCase().trim() : null;
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // Tekshirish: telefon yoki email oldin ro'yxatdan o'tganmi?
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: cleanPhone },
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ushbu telefon raqam yoki email allaqachon ro'yxatdan o'tgan" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        phone: cleanPhone,
        email: cleanEmail,
        passwordHash,
        role: "STUDENT",
        profile: {
          create: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            fullName,
            phone: cleanPhone,
            faculty: faculty || "Axborot Texnologiyalari",
            groupName: groupName.trim(),
            courseYear: parseInt(courseYear, 10) || 1,
            totalPoints: 0,
          },
        },
      },
      include: { profile: true },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role as any,
      studentId: user.studentId,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
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
