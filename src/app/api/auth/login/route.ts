import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { login, password, email } = await request.json();
    const identifier = (login || email || "").trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Login (email, telefon yoki ID) va parolni kiriting" },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.toLowerCase();

    // Qidiruv: email, telefon yoki studentId bo'yicha
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          { phone: identifier },
          { studentId: identifier.toUpperCase() },
        ],
      },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Bunday foydalanuvchi topilmadi" },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Parol noto'g'ri kiritildi" },
        { status: 401 }
      );
    }

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
        email: user.email,
        phone: user.phone,
        role: user.role,
        studentId: user.studentId,
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Tizimga kirishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
