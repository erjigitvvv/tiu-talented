import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FACULTIES } from "@/lib/constants";
import { Trophy, Medal, Award, Star, ArrowUpRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

interface LeaderboardPageProps {
  searchParams?: {
    faculty?: string;
  };
}

export default async function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const selectedFaculty = searchParams?.faculty || "";

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      ...(selectedFaculty ? { profile: { faculty: selectedFaculty } } : {}),
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
    take: 50,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Sarlavha */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Universitet Rasmiy Reytingi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          TIU Iqtidorlar Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Faqatgina &quot;Iqtidorli talabalar bilan ishlash bo&apos;limi&quot; tomonidan rasmiy tasdiqlangan yutuqlar asosida shakllantirilgan shaffof reyting
        </p>
      </div>

      {/* Fakultetlar Tab filtri */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/leaderboard"
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            !selectedFaculty
              ? "bg-tiu-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Barcha Fakultetlar
        </Link>
        {FACULTIES.map((fac) => (
          <Link
            key={fac}
            href={`/leaderboard?faculty=${fac}`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedFaculty === fac
                ? "bg-tiu-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {fac}
          </Link>
        ))}
      </div>

      {/* Leaderboard Table / Card List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-4 px-6 text-center w-16">O&apos;rin</th>
                <th className="py-4 px-6">Talaba</th>
                <th className="py-4 px-6 hidden md:table-cell">Fakultet va Guruh</th>
                <th className="py-4 px-6 text-center hidden sm:table-cell">Tasdiqlangan Yutuqlar</th>
                <th className="py-4 px-6 text-right">Ball</th>
                <th className="py-4 px-6 text-center w-24">Profil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {students.map((student, idx) => {
                const rank = idx + 1;
                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      rank === 1
                        ? "bg-amber-50/40"
                        : rank === 2
                        ? "bg-slate-100/30"
                        : rank === 3
                        ? "bg-orange-50/20"
                        : ""
                    }`}
                  >
                    {/* O'rin */}
                    <td className="py-4 px-6 text-center font-extrabold text-sm sm:text-base">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                          🥇
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-800">
                          🥈
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700/20 text-amber-900">
                          🥉
                        </span>
                      ) : (
                        <span className="text-slate-400">#{rank}</span>
                      )}
                    </td>

                    {/* Talaba info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-tiu-800 text-white flex items-center justify-center font-bold text-xs overflow-hidden flex-shrink-0">
                          {student.profile?.avatarUrl ? (
                            <img
                              src={student.profile.avatarUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            student.profile?.fullName.charAt(0) || "T"
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">
                            {student.profile?.fullName}
                          </div>
                          <div className="text-[11px] text-slate-400 md:hidden">
                            {student.profile?.faculty} • {student.profile?.groupName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Fakultet */}
                    <td className="py-4 px-6 hidden md:table-cell text-slate-600">
                      <div className="font-semibold">{student.profile?.faculty}</div>
                      <div className="text-xs text-slate-400">
                        {student.profile?.groupName} ({student.profile?.courseYear}-kurs)
                      </div>
                    </td>

                    {/* Yutuqlar soni */}
                    <td className="py-4 px-6 text-center hidden sm:table-cell">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-xs">
                        {student.achievements.length} ta yutuq
                      </span>
                    </td>

                    {/* Umumiy ball */}
                    <td className="py-4 px-6 text-right">
                      <span className="text-base font-black text-tiu-800">
                        {student.profile?.totalPoints || 0}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">ball</span>
                    </td>

                    {/* Profil tugmasi */}
                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/talents/${student.id}`}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-tiu-800 hover:text-white text-slate-600 inline-flex items-center justify-center transition-colors"
                        title="Portfolioni ochish"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
