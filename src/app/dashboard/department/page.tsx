import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ShieldCheck, Award, FileText, Users, ArrowRight, Clock, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DepartmentDashboardPage() {
  const [pendingAchievements, opportunities, applications, totalStudents] = await Promise.all([
    prisma.achievement.findMany({
      where: { status: "PENDING" },
      include: { user: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.opportunity.findMany({
      orderBy: { createdAt: "desc" },
      include: { applications: true },
    }),
    prisma.application.findMany({
      orderBy: { appliedAt: "desc" },
      include: {
        user: { include: { profile: true } },
        opportunity: true,
      },
    }),
    prisma.user.count({ where: { role: "STUDENT" } }),
  ]);

  return (
    <div className="space-y-6">
      {/* Sarlavha */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <span className="text-xs font-bold text-tiu-700 uppercase tracking-wider block mb-1">
          Boshqaruv va Monitoring
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Iqtidorli Talabalar Bilan Ishlash Markazi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Yutuqlarni tasdiqlash, ballar biriktirish, yangi tanlovlarni boshqarish va kelgan arizalarni saralash paneli
        </p>
      </div>

      {/* KPI Kartalari */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/department/verifications"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-amber-400 transition-all group"
        >
          <div className="text-xs text-amber-600 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Kutilayotgan Yutuqlar</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {pendingAchievements.length} ta
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1 group-hover:underline">
            Tekshirish navbatiga o&apos;tish &rarr;
          </div>
        </Link>

        <Link
          href="/dashboard/department/opportunities"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-tiu-400 transition-all group"
        >
          <div className="text-xs text-tiu-700 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Tanlov va Grantlar</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {opportunities.length} ta
          </div>
          <div className="text-[11px] text-tiu-800 font-semibold mt-1 group-hover:underline">
            Boshqarish &rarr;
          </div>
        </Link>

        <Link
          href="/dashboard/department/applications"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-400 transition-all group"
        >
          <div className="text-xs text-blue-600 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Kelgan Arizalar</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {applications.length} ta
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1 group-hover:underline">
            Baholash &rarr;
          </div>
        </Link>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Ro&apos;yxatdagi Talabalar</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {totalStudents} nafar
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Platforma a&apos;zolari</div>
        </div>
      </div>

      {/* Kutilayotgan Yutuqlar Vidjeti */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Tekshiruvni Kutayotgan Talabalar Yutuqlari</span>
          </h3>
          <Link
            href="/dashboard/department/verifications"
            className="text-xs font-bold text-tiu-800 hover:underline flex items-center space-x-1"
          >
            <span>Barchasi ({pendingAchievements.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingAchievements.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Ajoyib! Barcha yutuqlar ko&apos;rib chiqilgan. Navbat bo&apos;sh.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingAchievements.slice(0, 3).map((ach) => (
              <div key={ach.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {ach.user.profile?.fullName}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({ach.user.profile?.faculty})
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-700 mt-0.5">
                    {ach.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Toifasi: {ach.category} • Yuklangan: {new Date(ach.createdAt).toLocaleDateString("uz-UZ")}
                  </div>
                </div>

                <Link
                  href="/dashboard/department/verifications"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors self-start sm:self-auto"
                >
                  Tekshirish va Ball berish &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
