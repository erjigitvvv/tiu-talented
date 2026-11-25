import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  Trophy,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
  PlusCircle,
  Building2,
  Award,
  Newspaper,
  User,
  XCircle,
} from "lucide-react";

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

  const profile = user?.profile;

  return (
    <div className="space-y-6">
      {/* 1. Xush kelibsiz & Talaba Akademik Kartasi */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-tiu-700 uppercase tracking-wider block">
            Talaba Shaxsiy Kabineti
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Xush kelibsiz, {profile?.fullName}!
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
            <span className="flex items-center space-x-1 font-semibold text-slate-800">
              <Building2 className="w-3.5 h-3.5 text-tiu-700" />
              <span>{profile?.dekanat || profile?.faculty}</span>
            </span>
            <span>•</span>
            <span>Yo&apos;nalish: <strong className="text-slate-800">{profile?.specialty || "Belgilanmagan"}</strong></span>
            <span>•</span>
            <span>Guruh: <strong className="text-slate-800">{profile?.groupName}</strong> ({profile?.courseYear}-kurs)</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Link
            href="/dashboard/student/profile"
            className="neu-btn-white px-4 py-2.5 rounded-xl text-slate-700 font-bold text-xs"
          >
            Profilni tahrirlash
          </Link>
          <Link
            href="/dashboard/student/achievements"
            className="neu-btn-primary px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yutuq yuklash</span>
          </Link>
        </div>
      </div>

      {/* 2. Ko'rsatkichlar kartalari */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-neu-card p-5 rounded-2xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Umumiy Ball</div>
          <div className="text-2xl sm:text-3xl font-black text-tiu-800 mt-1">
            {profile?.totalPoints || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tasdiqlangan reyting</div>
        </div>

        <div className="glass-neu-card p-5 rounded-2xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tasdiqlangan</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            {approvedAchievements.length} ta
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Rasmiy yutuqlar</div>
        </div>

        <div className="glass-neu-card p-5 rounded-2xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tekshiruvda</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
            {pendingAchievements.length} ta
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Bo&apos;lim navbatida</div>
        </div>

        <div className="glass-neu-card p-5 rounded-2xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Topshirilgan Ariza</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
            {applications.length} ta
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Grant va tanlovlar</div>
        </div>
      </div>

      {/* 3. Kabinet Bo'limlariga Tezkor O'tish Vidjetlari */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/dashboard/student/opportunities"
          className="glass-neu-card p-4 rounded-2xl group block hover:border-amber-400/80"
        >
          <Award className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-slate-800">E&apos;lonlar & Tanlovlar</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Faol grantlar ro&apos;yxati &rarr;</div>
        </Link>

        <Link
          href="/dashboard/student/news"
          className="glass-neu-card p-4 rounded-2xl group block hover:border-tiu-400/80"
        >
          <Newspaper className="w-5 h-5 text-tiu-700 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-slate-800">Yangiliklar</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Universitet xabarlari &rarr;</div>
        </Link>

        <Link
          href="/dashboard/student/applications"
          className="glass-neu-card p-4 rounded-2xl group block hover:border-blue-400/80"
        >
          <FileText className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-slate-800">Mening Arizalarim</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Holat va izohlar &rarr;</div>
        </Link>

        <Link
          href="/dashboard/student/achievements"
          className="glass-neu-card p-4 rounded-2xl group block hover:border-emerald-400/80"
        >
          <Trophy className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-slate-800">Yutuqlarim</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Sertifikat yuklash &rarr;</div>
        </Link>
      </div>

      {/* 4. Oxirgi yuklangan yutuqlar */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
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
            Hozircha yutuq yuklanmagan. Sertifikatlaringizni kiritib ball to&apos;plang!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {achievements.slice(0, 3).map((ach) => (
              <div key={ach.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{ach.title}</h4>
                  <div className="text-slate-400 mt-0.5">
                    {ach.category} • {new Date(ach.dateAchieved).toLocaleDateString("uz-UZ")}
                  </div>
                </div>

                <div>
                  {ach.status === "APPROVED" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 inline-flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tasdiqlandi (+{ach.points} ball)</span>
                    </span>
                  )}
                  {ach.status === "PENDING" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 inline-flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Tekshiruvda</span>
                    </span>
                  )}
                  {ach.status === "REJECTED" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 inline-flex items-center space-x-1">
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>Rad etildi</span>
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
