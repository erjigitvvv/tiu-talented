import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "tiu-talented-super-secret-key-2026-development";
export const COOKIE_NAME = "tiu_auth_token";

export interface TokenPayload {
  userId: string;
  email?: string | null;
  phone?: string | null;
  role: "STUDENT" | "DEPT_ADMIN" | "SUPER_ADMIN";
  studentId?: string | null;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      studentId: user.studentId,
      role: user.role,
      profile: user.profile,
    };
  } catch {
    return null;
  }
}
