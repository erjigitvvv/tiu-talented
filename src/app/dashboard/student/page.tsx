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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
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

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/dashboard/student/profile"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
          >
            Profilni tahrirlash
          </Link>
          <Link
            href="/dashboard/student/achievements"
            className="px-4 py-2.5 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yutuq yuklash</span>
          </Link>
        </div>
      </div>

      {/* 2. Ko'rsatkichlar kartalari */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Umumiy Ball</div>
          <div className="text-2xl sm:text-3xl font-black text-tiu-800 mt-1">
            {profile?.totalPoints || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tasdiqlangan reyting</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tasdiqlangan</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            {approvedAchievements.length} ta
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Rasmiy yutuqlar</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tekshiruvda</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
            {pendingAchievements.length} ta
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Bo&apos;lim navbatida</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
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
          className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 shadow-sm hover:shadow transition-all group"
        >
          <Award className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-slate-800">E&apos;lonlar & Tanlovlar</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Faol grantlar ro&apos;yxati &rarr;</div>
        </Link>

        <Link
          href="/dashboard/student/news"
          className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-tiu-400 shadow-sm hover:shadow transition-all group"
        >
          <Newspaper className="w-5 h-5 text-tiu-700 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-slate-800">Yangiliklar</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Universitet xabarlari &rarr;</div>
        </Link>

        <Link
          href="/dashboard/student/applications"
          className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 shadow-sm hover:shadow transition-all group"
        >
          <FileText className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-slate-800">Mening Arizalarim</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Holat va izohlar &rarr;</div>
        </Link>

        <Link
          href="/dashboard/student/achievements"
          className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-400 shadow-sm hover:shadow transition-all group"
        >
          <Trophy className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-slate-800">Yutuqlarim</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Sertifikat yuklash &rarr;</div>
        </Link>
      </div>

      {/* 4. Oxirgi yuklangan yutuqlar */}
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
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      ✓ Tasdiqlandi (+{ach.points} ball)
                    </span>
                  )}
                  {ach.status === "PENDING" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      ⏳ Tekshiruvda
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
