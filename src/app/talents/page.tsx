import { prisma } from "@/lib/prisma";
import { FACULTIES } from "@/lib/constants";
import { Trophy } from "lucide-react";
import TalentsTableClient, { TalentRow } from "./TalentsTableClient";

export const dynamic = "force-dynamic";

export default async function TalentsPage() {
  const talents = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },
    include: {
      profile: true,
      achievements: {
        where: { status: "APPROVED" },
      },
    },
    orderBy: {
      profile: {
        totalPoints: "desc",
      },
    },
  });

  const formattedTalents: TalentRow[] = talents.map((user, index) => ({
    id: user.id,
    rank: index + 1,
    fullName: user.profile?.fullName || "Iqtidorli Talaba",
    avatarUrl: user.profile?.avatarUrl,
    faculty: user.profile?.faculty,
    dekanat: user.profile?.dekanat,
    specialty: user.profile?.specialty,
    groupName: user.profile?.groupName,
    courseYear: user.profile?.courseYear,
    gpa: user.profile?.gpa || 4.5,
    totalPoints: user.profile?.totalPoints || 0,
    bio: user.profile?.bio,
    skills: user.profile?.skills,
    phone: user.profile?.phone || user.phone,
    email: user.email,
    achievementsCount: user.achievements.length,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Sarlavha */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-tiu-800 uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Iqtidorlar Reyestri va Reytingi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Iqtidorli Talabalarimiz Jadvali
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Universitetning ilmiy, axborot texnologiyalari, startap va sportda yuqori natija ko&apos;rsatgan talabalari
          </p>
        </div>
        <div className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 self-start md:self-auto">
          Jami ro&apos;yxatdagilar: <strong className="text-tiu-900">{formattedTalents.length} nafar</strong>
        </div>
      </div>

      {/* Interaktiv Talabalar Jadvali */}
      <TalentsTableClient
        initialTalents={formattedTalents}
        faculties={FACULTIES}
      />
    </div>
  );
}