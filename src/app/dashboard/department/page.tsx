import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ShieldCheck,
  Award,
  FileText,
  Users,
  ArrowRight,
  Clock,
  Camera,
  CheckCircle2,
  UserCheck,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DepartmentDashboardPage() {
  const [
    pendingAchievements,
    opportunities,
    applications,
    totalStudents,
    teamsCount,
    eventsCount,
  ] = await Promise.all([
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
    prisma.team.count(),
    prisma.newsEvent.count(),
  ]);

  return (
    <div className="space-y-6">
      {/* Sarlavha */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <span className="text-xs font-bold text-tiu-700 uppercase tracking-wider block mb-1">
          Boshqaruv va Monitoring
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Iqtidorli Talabalar Bilan Ishlash Markazi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Iqtidorli talabalar reyestri, talabalar jamoalari katalogi, tanlov/grantlar va e&apos;lonlar boshqaruv ekotizimi
        </p>
      </div>

      {/* KPI Kartalari (Barcha asosiy bo'limlar bo'yicha) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Iqtidorli talabalar */}
        <Link
          href="/dashboard/department/talents"
          className="glass-neu-card p-5 rounded-2xl group block hover:border-tiu-400/80"
        >
          <div className="text-xs text-tiu-700 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Iqtidorli Talabalar</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {totalStudents} nafar
          </div>
          <div className="text-[11px] text-tiu-800 font-semibold mt-1 group-hover:underline">
            Reyestrni ochish &rarr;
          </div>
        </Link>

        {/* 2. Jamoalar katalogi */}
        <Link
          href="/dashboard/department/teams"
          className="glass-neu-card p-5 rounded-2xl group block hover:border-blue-400/80"
        >
          <div className="text-xs text-blue-600 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Jamoalar Katalogi</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {teamsCount} ta jamoa
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1 group-hover:underline">
            Tarkib va a&apos;zolarni boshqarish &rarr;
          </div>
        </Link>

        {/* 3. Grantlar va Tanlovlar */}
        <Link
          href="/dashboard/department/opportunities"
          className="glass-neu-card p-5 rounded-2xl group block hover:border-amber-400/80"
        >
          <div className="text-xs text-amber-600 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Grantlar & Tanlovlar</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {opportunities.length} ta faol
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1 group-hover:underline">
            Yangi e&apos;lon qilish &rarr;
          </div>
        </Link>

        {/* 4. Kelgan arizalar */}
        <Link
          href="/dashboard/department/applications"
          className="glass-neu-card p-5 rounded-2xl group block hover:border-purple-400/80"
        >
          <div className="text-xs text-purple-600 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Kelgan Arizalar</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {applications.length} ta
          </div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1 group-hover:underline">
            Baholash va g&apos;oliblar &rarr;
          </div>
        </Link>

        {/* 5. E'lonlar va lavhalar */}
        <Link
          href="/dashboard/department/events"
          className="glass-neu-card p-5 rounded-2xl group block hover:border-pink-400/80"
        >
          <div className="text-xs text-pink-600 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>E&apos;lonlar & Lavhalar</span>
            <Camera className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {eventsCount} ta fotolavha
          </div>
          <div className="text-[11px] text-pink-700 font-semibold mt-1 group-hover:underline">
            Yangilik qo&apos;shish &rarr;
          </div>
        </Link>

        {/* 6. Kutilayotgan yutuqlar verifikatsiyasi */}
        <Link
          href="/dashboard/department/verifications"
          className="glass-neu-card p-5 rounded-2xl group block hover:border-emerald-400/80"
        >
          <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Kutilayotgan Yutuqlar</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {pendingAchievements.length} ta
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 group-hover:underline">
            Tasdiqlash navbati &rarr;
          </div>
        </Link>
      </div>

      {/* Tezkor Ko'rish: Kutilayotgan Yutuqlar Navbati */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Kutilayotgan Yutuqlar Verifikatsiyasi</span>
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
          <div className="py-6 text-center text-xs text-slate-400">
            Ajoyib! Barcha yutuqlar ko&apos;rib chiqilgan. Navbat bo&apos;sh.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingAchievements.slice(0, 3).map((ach) => (
              <div key={ach.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                    Toifasi: {ach.category} • Yuklangan sana: {new Date(ach.createdAt).toLocaleDateString("uz-UZ")}
                  </div>
                </div>

                <Link
                  href="/dashboard/department/verifications"
                  className="neu-btn-primary px-4 py-2 rounded-xl text-white font-bold text-xs self-start sm:self-auto"
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
