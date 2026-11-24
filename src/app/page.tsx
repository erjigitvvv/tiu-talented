import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Sparkles,
  ArrowRight,
  Trophy,
  Award,
  Users,
  ChevronRight,
  UserPlus,
  GraduationCap,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [topTalents, activeOpportunities, teams, stats] = await Promise.all([
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
    prisma.team.findMany({
      include: {
        leader: { include: { profile: true } },
        members: { where: { status: "ACCEPTED" } },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.team.count(),
      prisma.opportunity.count({ where: { status: "OPEN" } }),
    ]),
  ]);

  const [studentCount, teamCount, activeGrantsCount] = stats;

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-tiu-950 via-tiu-900 to-slate-900 text-white">
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
              Iqtidorlilar Ekotizimi va{" "}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                Loyiha Jamoalari
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Toshkent Xalqaro Universiteti talabalari uchun raqamli portfolio, startap va hakaton
              jamoalariga birlashish hamda rektor grantlarini yutib olish imkoniyati.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <span>Ro&apos;yxatdan o&apos;tish</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/teams"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center space-x-2"
              >
                <span>Jamoalarni ko&apos;rish</span>
              </Link>
            </div>
          </div>

          {/* Jonli statistika ko'rsatkichlari */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {studentCount > 0 ? `${studentCount}+` : "Faol"}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Iqtidorli Talabalar</div>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {teamCount} ta
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Faol Jamoalar</div>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {activeGrantsCount} ta
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Ochiq Grant va Tanlovlar</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. JAMOLAR VITRINASI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-tiu-700 uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              <span>Hamkorlik va Loyihalar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Talabalar Loyiha Jamoalari
            </h2>
          </div>
          <Link
            href="/teams"
            className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-tiu-700 hover:text-tiu-900 group"
          >
            <span>Barcha jamoalar</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                    {team.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {team.members.length} nafar a&apos;zo
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-tiu-800 transition-colors">
                  {team.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {team.description}
                </p>

                {team.neededRoles && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <div className="text-[10px] uppercase font-bold text-amber-900 flex items-center space-x-1">
                      <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                      <span>Kerakli kadrlar:</span>
                    </div>
                    <div className="text-xs text-amber-950 font-semibold line-clamp-1">
                      {team.neededRoles}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Yetakchi: <strong>{team.leader.profile?.fullName}</strong>
                </span>
                <Link
                  href={`/teams/${team.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs transition-colors"
                >
                  Qo&apos;shilish &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. IQTIDORLI TALABALAR VITRINASI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-tiu-700 uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Universitet Faxri</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Iqtidorli Talabalarimiz
            </h2>
          </div>
          <Link
            href="/talents"
            className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-tiu-700 hover:text-tiu-900 group"
          >
            <span>Barcha iqtidorlar katalogi</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topTalents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-tiu-800 to-tiu-600 text-white flex items-center justify-center font-bold text-xl overflow-hidden mb-4 shadow-sm">
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

                <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-tiu-800 transition-colors">
                  {student.profile?.fullName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {student.profile?.faculty}
                </p>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {student.profile?.groupName} • {student.profile?.courseYear}-kurs
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
                  <div className="text-[10px] uppercase font-bold text-slate-400">Yutuqlar</div>
                  <div className="text-sm font-extrabold text-tiu-800">
                    {student.achievements.length} ta tasdiqlangan
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
                  Tanlovlar va Grantlar
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
                        {new Date(opp.deadline).toLocaleDateString("uz-UZ")} gacha
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
    </div>
  );
}
