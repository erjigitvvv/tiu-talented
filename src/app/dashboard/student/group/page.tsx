import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, GraduationCap, Trophy, Star, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StudentGroupPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const studentProfile = currentUser.profile;
  const groupName = studentProfile?.groupName || "Biriktirilmagan";
  const faculty = studentProfile?.dekanat || studentProfile?.faculty || "Axborot Texnologiyalari";

  // Guruhdoshlarni yuklash (shu guruhdagi barcha talabalar)
  const classmates = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      profile: {
        groupName: groupName,
      },
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

  const avgGpa =
    classmates.length > 0
      ? classmates.reduce((acc, c) => acc + (c.profile?.gpa || 0), 0) / classmates.length
      : 0;

  return (
    <div className="space-y-8">
      {/* Guruh Bosh Kartochkasi */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-tiu-900 to-tiu-950 text-white flex items-center justify-center font-black text-2xl shadow-md border border-white/20">
              <Users className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-blue-50 text-blue-800 border border-blue-200 shadow-xs">
                Akademik Guruh
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Guruh: {groupName}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {faculty} • {studentProfile?.specialty || "Yo'nalish"} • {studentProfile?.courseYear || 1}-kurs
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="neu-pill px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700">
              Jami talabalar: <strong className="text-tiu-900">{classmates.length} nafar</strong>
            </span>
          </div>
        </div>

        {/* Guruh Statistikasi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="neu-sunken p-4 rounded-2xl flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Guruh O&apos;rtacha GPA
              </div>
              <div className="text-lg font-black text-slate-900">
                {avgGpa.toFixed(2)} / 5.0
              </div>
            </div>
          </div>

          <div className="neu-sunken p-4 rounded-2xl flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Trophy className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Iqtidorli Talabalar
              </div>
              <div className="text-lg font-black text-slate-900">
                {classmates.filter((c) => (c.profile?.totalPoints || 0) > 0).length} nafar
              </div>
            </div>
          </div>

          <div className="neu-sunken p-4 rounded-2xl flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-xs">
              <UserCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Guruh Sardori
              </div>
              <div className="text-sm font-black text-slate-900 truncate">
                {classmates[0]?.profile?.fullName || "Biriktirilmagan"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guruhdoshlar Ro'yxati */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
          <Users className="w-5 h-5 text-tiu-800" />
          <span>Guruhdoshlar Ro&apos;yxati ({classmates.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classmates.map((student, idx) => (
            <div
              key={student.id}
              className={`glass-neu-card p-5 rounded-2xl flex items-center justify-between group ${
                student.id === currentUser.id
                  ? "border-tiu-600/70 bg-tiu-50/40"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tiu-900 to-tiu-950 text-white flex items-center justify-center font-bold text-sm overflow-hidden flex-shrink-0 shadow-xs border border-white/20">
                  {student.profile?.avatarUrl ? (
                    <img
                      src={student.profile.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    student.profile?.fullName?.charAt(0) || "T"
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {student.profile?.fullName}
                    </h4>
                    {student.id === currentUser.id && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-tiu-100 text-tiu-900">
                        Siz
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-tiu-700 font-semibold">
                    {student.profile?.specialty || "Dasturiy injiniring"}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    GPA: <strong>{student.profile?.gpa.toFixed(2)}</strong> • {student.profile?.totalPoints || 0} ball
                  </div>
                </div>
              </div>

              <Link
                href={`/talents/${student.id}`}
                className="neu-btn-white px-3 py-1.5 rounded-xl text-xs font-bold text-tiu-900 flex-shrink-0"
              >
                Portfolio &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}