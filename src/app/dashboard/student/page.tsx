import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Trophy, Clock, CheckCircle2, FileText, ArrowRight, PlusCircle, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();

  const [achievements, applications] = await Promise.all([
    prisma.achievement.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.findMany({
      where: { userId: user!.id },
      include: { opportunity: true },
      orderBy: { appliedAt: "desc" },
    }),
  ]);

  const approvedAchievements = achievements.filter((a) => a.status === "APPROVED");
  const pendingAchievements = achievements.filter((a) => a.status === "PENDING");

  return (
    <div className="space-y-6">
      {/* Sarlavha va Xush kelibsiz */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-tiu-700 uppercase tracking-wider block mb-1">
            Talaba Boshqaruv Markazi
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Xush kelibsiz, {user?.profile?.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Yutuqlaringizni yuklang va TIU iqtidorlar reytingidagi o&apos;rningizni yuksaltiring
          </p>
        </div>
        <Link
          href="/dashboard/student/achievements"
          className="px-5 py-3 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center space-x-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi yutuq yuklash</span>
        </Link>
      </div>

      {/* Ko'rsatkichlar kartalari */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Umumiy Ball</div>
          <div className="text-2xl sm:text-3xl font-black text-tiu-800 mt-1">
            {user?.profile?.totalPoints || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tasdiqlangan natija</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tasdiqlangan</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            {approvedAchievements.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Rasmiy yutuqlar</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tekshiruvda</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
            {pendingAchievements.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Bo&apos;lim navbatida</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Topshirilgan Ariza</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
            {applications.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tanlov va grantlar</div>
        </div>
      </div>

      {/* Oxirgi yutuqlar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-base">So&apos;nggi yuklangan yutuqlar</h3>
          <Link
            href="/dashboard/student/achievements"
            className="text-xs font-bold text-tiu-800 hover:underline flex items-center space-x-1"
          >
            <span>Barchasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {achievements.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Hozircha hech qanday yutuq yuklamagansiz. &quot;Yangi yutuq yuklash&quot; tugmasi orqali sertifikatlaringizni kiriting!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {achievements.slice(0, 4).map((ach) => (
              <div key={ach.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{ach.title}</h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                    <span>{ach.category}</span>
                    <span>•</span>
                    <span>{new Date(ach.dateAchieved).toLocaleDateString("uz-UZ")}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {ach.status === "APPROVED" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      ✓ Tasdiqlandi (+{ach.points} ball)
                    </span>
                  )}
                  {ach.status === "PENDING" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      ⏳ Kutilmoqda
                    </span>
                  )}
                  {ach.status === "REJECTED" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                      ✗ Rad etildi
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
