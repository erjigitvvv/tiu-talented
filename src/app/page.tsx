import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Sparkles,
  ArrowRight,
  Trophy,
  Award,
  BookOpen,
  CheckCircle2,
  Calendar,
  Users,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Baza ma'lumotlarini yuklash
  const [topTalents, activeOpportunities, newsEvents, stats] = await Promise.all([
    prisma.user.findMany({
      where: { role: "STUDENT" },
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
      take: 4,
    }),
    prisma.opportunity.findMany({
      where: { status: "OPEN" },
      orderBy: { deadline: "asc" },
      take: 3,
    }),
    prisma.newsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.achievement.count({ where: { status: "APPROVED" } }),
      prisma.opportunity.count({ where: { status: "OPEN" } }),
    ]),
  ]);

  const [studentCount, verifiedAchievementsCount, activeGrantsCount] = stats;

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-tiu-950 via-tiu-900 to-slate-900 text-white">
        {/* Orqa fon bezaklari */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-tiu-400 blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-amber-400 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-tiu-800/80 border border-tiu-600/40 text-tiu-200 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>TIU Iqtidorli Talabalar Rasmiy Portali</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Talantingizni Ko&apos;rsating,{" "}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                Yutuqlaringizni
              </span>{" "}
              Tasdiqlang!
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Toshkent Xalqaro Universiteti talabalarining raqamli portfoliosi, xalqaro olimpiadalar,
              startaplar, ilmiy maqolalar verifikatsiyasi hamda rektor grantlari uchun yagona ochiq platforma.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <span>Portfolio yaratish</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/talents"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center space-x-2"
              >
                <span>Iqtidorlarni kashf qilish</span>
              </Link>
            </div>
          </div>

          {/* Jonli statistika ko'rsatkichlari */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {studentCount > 0 ? `${studentCount}+` : "Faol"}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Ro&apos;yxatdagi Iqtidorlar</div>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {verifiedAchievementsCount > 0 ? `${verifiedAchievementsCount}+` : "Ko'plab"}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Tasdiqlangan Yutuqlar</div>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {activeGrantsCount} ta
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Faol Grant va Tanlovlar</div>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-tiu-300">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Shaffof Verifikatsiya</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TADFIRDAN LAVHALAR VA YANGILIKLAR (User talabi bo'yicha) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-tiu-700 uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4" />
              <span>Universitet hayoti</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tadbirdan lavhalar va yangiliklar
            </h2>
          </div>
          <Link
            href="/events"
            className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-tiu-700 hover:text-tiu-900 group"
          >
            <span>Barcha lavhalar</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsEvents.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all group flex flex-col"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-tiu-900 text-tiu-400">
                    <Sparkles className="w-8 h-8" />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/80 backdrop-blur-sm text-white">
                  {item.type === "EVENT_HIGHLIGHT" ? "📸 Tadbirdan lavha" : "📰 Yangilik"}
                </span>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-tiu-800 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    {item.eventDate ? new Date(item.eventDate).toLocaleDateString("uz-UZ") : "Yaqinda"}
                  </span>
                  <span className="font-semibold text-tiu-700 group-hover:underline">Batafsil o&apos;qish &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ENG YUQORI REYTINGLI IQTIDORLAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-tiu-700 uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Universitet faxri</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Top Iqtidorli Talabalarimiz
            </h2>
          </div>
          <Link
            href="/leaderboard"
            className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-tiu-700 hover:text-tiu-900 group"
          >
            <span>To&apos;liq reyting (Leaderboard)</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topTalents.map((student, idx) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              {/* O'rin nishoni */}
              <div
                className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  idx === 0
                    ? "bg-amber-100 text-amber-700 border border-amber-300"
                    : idx === 1
                    ? "bg-slate-200 text-slate-700"
                    : idx === 2
                    ? "bg-amber-700/10 text-amber-900"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                #{idx + 1}
              </div>

              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-tiu-800 to-tiu-600 text-white flex items-center justify-center font-bold text-xl overflow-hidden mb-4 shadow-sm">
                  {student.profile?.avatarUrl ? (
                    <img
                      src={student.profile.avatarUrl}
                      alt={student.profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    student.profile?.fullName?.charAt(0) || "T"
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-tiu-800 transition-colors">
                  {student.profile?.fullName || "Iqtidorli Talaba"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {student.profile?.faculty}
                </p>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Guruh: {student.profile?.groupName} • {student.profile?.courseYear}-kurs
                </div>

                {student.profile?.skills && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {student.profile.skills
                      .split(",")
                      .slice(0, 2)
                      .map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600"
                        >
                          {s.trim()}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Ballari</div>
                  <div className="text-base font-extrabold text-tiu-800">
                    {student.profile?.totalPoints || 0} ball
                  </div>
                </div>
                <Link
                  href={`/talents/${student.id}`}
                  className="px-3 py-1.5 rounded-lg bg-tiu-50 hover:bg-tiu-100 text-tiu-800 font-bold text-xs transition-colors"
                >
                  Portfolio &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAOL GRANTLAR VA TANLOVLAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-tiu-900 to-tiu-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  <Award className="w-4 h-4" />
                  <span>Imkoniyatlar</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Faol Grantlar va Tanlovlar
                </h2>
              </div>
              <Link
                href="/opportunities"
                className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-amber-300 hover:text-amber-200"
              >
                <span>Barcha tanlovlar</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between space-y-4 hover:bg-white/15 transition-all"
                >
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wide">
                      {opp.type}
                    </span>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{opp.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Mukofot:</span>
                      <span className="font-bold text-amber-300">{opp.award || "Diplom va sertifikat"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Muddati:</span>
                      <span className="font-semibold text-slate-200">
                        {new Date(opp.deadline).toLocaleDateString("uz-UZ")}
                      </span>
                    </div>

                    <Link
                      href={`/opportunities/${opp.id}`}
                      className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs bg-white text-tiu-950 hover:bg-amber-400 hover:text-slate-950 text-center block transition-colors"
                    >
                      Batafsil va Ariza topshirish
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. QANDAY ISHLAYDI? (HOW IT WORKS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platforma Qanday Ishlaydi?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Iqtidorli talabalarni qo&apos;llab-quvvatlashning 4 ta shaffof bosqichi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-tiu-50 text-tiu-800 flex items-center justify-center font-black text-lg mx-auto">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Ro&apos;yxatdan o&apos;ting</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Talaba o&apos;z ID raqami va ma&apos;lumotlari bilan profil ochadi hamda portfoliosini to&apos;ldiradi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-tiu-50 text-tiu-800 flex items-center justify-center font-black text-lg mx-auto">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Yutuqlarni yuklang</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sertifikatlar, hakaton g&apos;olibliklari, ilmiy maqolalar va loyihalarni dalillari bilan topshiring.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-tiu-50 text-tiu-800 flex items-center justify-center font-black text-lg mx-auto">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Rasmiy Verifikatsiya</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              &quot;Iqtidorli talabalar bilan ishlash bo&apos;limi&quot; hujjatlarni tekshiradi va tegishli ballarni biriktiradi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-tiu-50 text-tiu-800 flex items-center justify-center font-black text-lg mx-auto">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Grant va Rag&apos;bat</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Reytingda yuqoriga ko&apos;tariling va rektor grantlari, chet el stajirovkalari tanlovlarida g&apos;olib bo&apos;ling!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
