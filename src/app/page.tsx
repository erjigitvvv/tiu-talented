import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Sparkles,
  Users,
  Trophy,
  Award,
  ArrowRight,
  ArrowDown,
  GraduationCap,
  Star,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import TalentsCarousel, { CarouselTalent } from "@/components/teams/TalentsCarousel";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 1. Ma'lumotlarni parallel yuklash
  const [students, topTeams, opportunities, totalStudents, totalTeams, totalGrants] = await Promise.all([
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
    }),
    prisma.team.findMany({
      take: 3,
      include: {
        leader: {
          include: {
            profile: true,
          },
        },
        members: {
          where: { status: "ACCEPTED" },
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        achievements: {
          orderBy: { dateAchieved: "desc" },
          take: 2,
        },
        _count: {
          select: { members: true, achievements: true },
        },
      },
    }),
    prisma.opportunity.findMany({
      where: { status: "OPEN" },
      orderBy: { deadline: "asc" },
      take: 3,
    }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.team.count(),
    prisma.opportunity.count({ where: { status: "OPEN" } }),
  ]);

  // 2. TOP GURUHLARNI hisoblash (Group by groupName)
  const groupMap = new Map<
    string,
    {
      groupName: string;
      faculty: string;
      students: typeof students;
      totalGpa: number;
      totalPoints: number;
    }
  >();

  students.forEach((s) => {
    const groupName = s.profile?.groupName || "Biriktirilmagan";
    if (groupName === "Biriktirilmagan" || groupName === "Rahbariyat") return;

    const faculty = s.profile?.dekanat || s.profile?.faculty || "Axborot Texnologiyalari";
    const gpa = s.profile?.gpa || 4.5;
    const points = s.profile?.totalPoints || 0;

    if (!groupMap.has(groupName)) {
      groupMap.set(groupName, {
        groupName,
        faculty,
        students: [s],
        totalGpa: gpa,
        totalPoints: points,
      });
    } else {
      const g = groupMap.get(groupName)!;
      g.students.push(s);
      g.totalGpa += gpa;
      g.totalPoints += points;
    }
  });

  const topGroups = Array.from(groupMap.values())
    .map((g) => ({
      groupName: g.groupName,
      faculty: g.faculty,
      studentCount: g.students.length,
      avgGpa: g.totalGpa / g.students.length,
      totalPoints: g.totalPoints,
      talentsCount: g.students.filter((st) => (st.profile?.totalPoints || 0) > 0).length,
      topStudent: g.students[0]?.profile?.fullName || "Yetakchi talaba",
    }))
    .sort((a, b) => b.avgGpa - a.avgGpa)
    .slice(0, 4);

  // 3. TOP IQTIDORLILAR (Carousel uchun)
  const carouselTalents: CarouselTalent[] = students.slice(0, 9).map((user, index) => ({
    id: user.id,
    fullName: user.profile?.fullName || "Iqtidorli Talaba",
    avatarUrl: user.profile?.avatarUrl,
    faculty: user.profile?.faculty,
    specialty: user.profile?.specialty,
    groupName: user.profile?.groupName,
    gpa: user.profile?.gpa || 4.5,
    totalPoints: user.profile?.totalPoints || 0,
    rank: index + 1,
  }));

  return (
    <div className="space-y-24 pb-20">
      
      {/* ========================================================================= */}
      {/* 1-SAHIFA: BOSH SAHIFA HERO (OCHROQ FON, FAQAT SARLAVHA, NO BUTTONS)       */}
      {/* ========================================================================= */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Universitet Binosi Rasmi (Background) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform transition-transform duration-1000"
          style={{ backgroundImage: `url('/images/tiu-campus.jpg')` }}
        />

        {/* Biroz ochroq, tabiiy yorug'likni ko'rsatuvchi xiralashtirilgan fon qatlami */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/25 to-slate-900/45 backdrop-blur-[1px]" />

        {/* Glassmorphism Asosiy Hero Kartochkasi (Faqat sarlavha va qisqacha tanishtirish) */}
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-6 animate-in fade-in duration-500">
          
          <div className="glass-panel rounded-3xl p-8 sm:p-14 space-y-6 animate-in fade-in duration-500">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-tiu-50/90 border border-tiu-200/90 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm font-black tracking-wide text-tiu-950">
                Toshkent Xalqaro Universiteti • Iqtidorlar Portali
              </span>
            </div>

            {/* Asosiy Sarlavha */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
              Kelajak Liderlari va{" "}
              <span className="bg-gradient-to-r from-tiu-800 via-tiu-900 to-amber-600 bg-clip-text text-transparent">
                Iqtidorlar Ekotizimi
              </span>
            </h1>

            {/* Tanishtirish Matni */}
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Toshkent Xalqaro Universiteti (TIU) iqtidorli talabalarini aniqlash, jamoalarga birlashtirish,
              innovatsion loyihalar va xalqaro tanlovlarda ishtirok etishlarini tizimli qo&apos;llab-quvvatlash
              uchun yagona raqamli platforma.
            </p>

            {/* Pastga scroll ko'rsatkichi */}
            <div className="pt-2 flex flex-col items-center justify-center space-y-1.5 opacity-75 animate-bounce">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Pastga aylantiring
              </span>
              <ArrowDown className="w-4 h-4 text-tiu-800" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2-SAHIFA: TOP JAMOALAR (3-TALIK JAMOA KARTASI)                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-black text-tiu-800 uppercase tracking-wider mb-1.5">
              <Users className="w-4 h-4 text-tiu-700" />
              <span>Jamoaviy Hamkorlik</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Universitetning Top Jamoalari
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Xalqaro hakatonlar, olimpiadalar va startap tanlovlarida universitetimiz sharafini himoya qilayotgan yetakchi jamoalar.
            </p>
          </div>

          <Link
            href="/teams"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-tiu-800 hover:text-tiu-950 transition-colors self-start sm:self-auto group"
          >
            <span>Barcha jamoalar katalogi</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3-talik Top Jamoalar Kartochkalari */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topTeams.map((team, idx) => {
            const acceptedMembers = team.members;
            return (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                className="group glass-neu-card rounded-3xl p-6 flex flex-col justify-between space-y-5 cursor-pointer"
              >
                <div className="space-y-4">
                  {/* 16:9 Banner yoki Jamoa Rasmi */}
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900">
                    <img
                      src={
                        team.avatarUrl ||
                        (idx === 0
                          ? "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                          : idx === 1
                          ? "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80"
                          : "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80")
                      }
                      alt={team.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-xl text-[11px] font-black uppercase bg-tiu-950/85 backdrop-blur-md text-white border border-white/20 shadow-xs">
                        {team.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-black bg-amber-400 text-slate-950 shadow-xs flex items-center space-x-1">
                        <Trophy className="w-3 h-3 text-slate-950" />
                        <span>#{idx + 1} Top</span>
                      </span>
                    </div>
                  </div>

                  {/* Jamoa Nomi va Fakulteti */}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-tiu-800 transition-colors">
                      {team.name}
                    </h3>
                    <p className="text-xs font-semibold text-tiu-800 mt-0.5">
                      {team.faculty || "Axborot Texnologiyalari Dekanati"}
                    </p>
                  </div>

                  {/* Qisqa izoh */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {team.description}
                  </p>

                  {/* Jamoa Sardori va A'zolari 1x1 rasmlari */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {/* Sardor 1x1 rasm */}
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-tiu-900 text-white flex items-center justify-center text-xs font-black shadow-xs ring-2 ring-amber-400">
                        {team.leader.profile?.avatarUrl ? (
                          <img
                            src={team.leader.profile.avatarUrl}
                            alt=""
                            className="w-full h-full object-cover aspect-square"
                          />
                        ) : (
                          team.leader.profile?.fullName?.charAt(0) || "S"
                        )}
                      </div>
                      <div className="text-[11px]">
                        <span className="text-slate-400 font-bold block leading-none">Sardor:</span>
                        <span className="font-extrabold text-slate-900 truncate block max-w-[120px] leading-tight">
                          {team.leader.profile?.fullName || "Yetakchi"}
                        </span>
                      </div>
                    </div>

                    {/* A'zolar stack rasmlari (1x1) */}
                    <div className="flex -space-x-2 overflow-hidden items-center">
                      {acceptedMembers.slice(0, 4).map((m, mIdx) => (
                        <div
                          key={m.id || mIdx}
                          className="inline-block w-7 h-7 rounded-lg ring-2 ring-white overflow-hidden bg-slate-200"
                        >
                          {m.user?.profile?.avatarUrl ? (
                            <img
                              src={m.user.profile.avatarUrl}
                              alt=""
                              className="w-full h-full object-cover aspect-square"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-700 bg-slate-100">
                              {m.user?.profile?.fullName?.charAt(0) || "A"}
                            </div>
                          )}
                        </div>
                      ))}
                      {acceptedMembers.length > 4 && (
                        <div className="inline-flex w-7 h-7 rounded-lg ring-2 ring-white bg-tiu-900 text-white text-[10px] font-black items-center justify-center">
                          +{acceptedMembers.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pastki tugma / ko'rsatkich */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-tiu-900">
                  <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{acceptedMembers.length} a&apos;zo</span>
                  </span>
                  <span className="flex items-center space-x-1 text-tiu-800 group-hover:translate-x-1 transition-transform">
                    <span>Jamoa profili</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2-SAHIFA (SCROLL 1): TOP GURUHLAR (TOP ACADEMIC GROUPS)                    */}
      {/* ========================================================================= */}
      <section id="top-groups" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-black text-blue-700 uppercase tracking-wider mb-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Akademik Yetakchilik</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Universitetning Top Akademik Guruhlari
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              O&apos;rtacha akademik GPA ko&apos;rsatkichi, iqtidorli talabalar soni va to&apos;plangan ballar
              bo&apos;yicha universitetimizning yetakchi guruhlari.
            </p>
          </div>

          <Link
            href="/talents"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-tiu-800 hover:text-tiu-950 transition-colors self-start sm:self-auto"
          >
            <span>Barcha talabalar</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Top Guruhlar Kartochkalari (Glassmorphic) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topGroups.map((group, index) => (
            <div
              key={group.groupName}
              className="glass-neu-card rounded-3xl p-6 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-tiu-900 text-white flex items-center justify-center font-black text-base shadow-xs group-hover:scale-105 transition-transform">
                    {group.groupName.slice(0, 2)}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                      index === 0
                        ? "bg-amber-400 text-slate-950 shadow-xs"
                        : index === 1
                        ? "bg-slate-300 text-slate-900"
                        : index === 2
                        ? "bg-amber-100 text-amber-900"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    #{index + 1}-guruh
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-tiu-900 transition-colors">
                    {group.groupName}
                  </h3>
                  <p className="text-xs font-bold text-tiu-800 mt-0.5 line-clamp-1">
                    {group.faculty}
                  </p>
                </div>

                {/* Metrikalar: GPA & Iqtidorlilar */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-center">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">O&apos;rtacha GPA</span>
                    <span className="text-sm font-black text-amber-950 mt-0.5 block flex items-center justify-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 inline" />
                      <span>{group.avgGpa.toFixed(2)}</span>
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/60 text-center">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">Iqtidorlilar</span>
                    <span className="text-sm font-black text-blue-950 mt-0.5 block">
                      {group.talentsCount} nafar
                    </span>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-slate-500">
                  Yetakchi talaba: <strong className="text-slate-800">{group.topStudent}</strong>
                </div>
              </div>

              <Link
                href={`/talents?q=${group.groupName}`}
                className="neu-btn-white w-full py-2.5 rounded-xl text-slate-700 hover:text-tiu-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>Guruh talabalari</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2-3 SAHIFA (SCROLL 2): TOP IQTIDORLILAR CAROUSELDA                        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <TalentsCarousel
          talents={carouselTalents}
          title="Top Iqtidorli Talabalarimiz (Reyting)"
          subtitle="Oliy o'quv yurtida yutuq, ko'nikma va ilmiy natijalari bilan peshqadamlik qilayotgan talabalar"
        />
      </section>

      {/* ========================================================================= */}
      {/* 3-SAHIFA (SCROLL 3): SO'NGGI TANLOV VA GRANTLAR                           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-black text-amber-600 uppercase tracking-wider mb-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Imkoniyatlar va Rag&apos;bat</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              So&apos;nggi Tanlovlar va Grantlar
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Universitet rektori grantlari, xalqaro musobaqalar va 100% kontrakt qoplami dasturlari.
            </p>
          </div>

          <Link
            href="/opportunities"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-tiu-800 hover:text-tiu-950 transition-colors self-start sm:self-auto"
          >
            <span>Barcha tanlovlar</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* So'nggi Grantlar Kartochkalari (Glassmorphism & Shadows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((opp) => {
            const daysLeft = Math.max(
              0,
              Math.ceil(
                (new Date(opp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              )
            );

            return (
              <Link
                key={opp.id}
                href={`/opportunities/${opp.id}`}
                className="group glass-neu-card rounded-3xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Rasm */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={
                        opp.imageUrl ||
                        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80"
                      }
                      alt={opp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-xl text-[11px] font-black uppercase bg-tiu-900 text-white shadow-xs">
                        {opp.type}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-black bg-amber-500 text-slate-950 shadow-xs">
                        {daysLeft} kun qoldi
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-tiu-800 transition-colors line-clamp-2 leading-snug">
                      {opp.title}
                    </h3>

                    {opp.award && (
                      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs font-black text-amber-950 flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="truncate">Mukofot: {opp.award}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-tiu-900 group-hover:bg-tiu-50/50 transition-colors">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Kvota: {opp.quota} nafar
                  </span>
                  <span className="flex items-center space-x-1 text-tiu-800 group-hover:translate-x-1 transition-transform">
                    <span>Batafsil & Topshirish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}