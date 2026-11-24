import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      fullName,
      dekanat,
      faculty,
      specialty,
      groupName,
      courseYear,
      gpa,
      phone,
      bio,
      avatarUrl,
      skills,
      telegram,
      instagram,
    } = body;

    const computedFullName =
      fullName || (firstName && lastName ? `${firstName.trim()} ${lastName.trim()}` : undefined);

    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        ...(firstName ? { firstName: firstName.trim() } : {}),
        ...(lastName ? { lastName: lastName.trim() } : {}),
        ...(computedFullName ? { fullName: computedFullName.trim() } : {}),
        ...(dekanat ? { dekanat: dekanat.trim(), faculty: dekanat.trim() } : {}),
        ...(faculty && !dekanat ? { faculty: faculty.trim(), dekanat: faculty.trim() } : {}),
        ...(specialty ? { specialty: specialty.trim() } : {}),
        ...(groupName ? { groupName: groupName.trim() } : {}),
        ...(courseYear ? { courseYear: parseInt(courseYear, 10) } : {}),
        ...(gpa !== undefined ? { gpa: parseFloat(gpa) || 0.0 } : {}),
        ...(phone !== undefined ? { phone: phone ? phone.trim() : null } : {}),
        ...(bio !== undefined ? { bio: bio ? bio.trim() : null } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl: avatarUrl ? avatarUrl.trim() : null } : {}),
        ...(skills !== undefined ? { skills: skills ? skills.trim() : null } : {}),
        ...(telegram !== undefined ? { telegram: telegram ? telegram.trim() : null } : {}),
        ...(instagram !== undefined ? { instagram: instagram ? instagram.trim() : null } : {}),
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Profilni yangilashda xatolik yuz berdi" }, { status: 500 });
  }
}
