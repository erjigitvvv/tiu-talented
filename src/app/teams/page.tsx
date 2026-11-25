import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Users, Search, ArrowRight, ShieldCheck, Sparkles, Filter } from "lucide-react";
import TalentsCarousel, { CarouselTalent } from "@/components/teams/TalentsCarousel";
import TeamsCatalogFilter from "./TeamsCatalogFilter";

export const dynamic = "force-dynamic";

interface TeamsPageProps {
  searchParams?: {
    category?: string;
    q?: string;
  };
}

const CATEGORIES = [
  "Barcha toifalar",
  "Hakaton jamoasi",
  "Startap",
  "Ilmiy tadqiqot",
  "Robototexnika",
  "Kiberxavfsizlik",
];

export default async function TeamsPage({ searchParams }: TeamsPageProps) {
  const selectedCategory = searchParams?.category || "Barcha toifalar";
  const searchQuery = searchParams?.q?.toLowerCase() || "";

  // 1. Jamoalarni yuklash
  const teams = await prisma.team.findMany({
    where: {
      AND: [
        selectedCategory && selectedCategory !== "Barcha toifalar"
          ? { category: selectedCategory }
          : {},
        searchQuery
          ? {
              OR: [
                { name: { contains: searchQuery } },
                { description: { contains: searchQuery } },
                { faculty: { contains: searchQuery } },
              ],
            }
          : {},
      ],
    },
    include: {
      leader: { include: { profile: true } },
      members: {
        where: { status: "ACCEPTED" },
        include: {
          user: { include: { profile: true } },
        },
      },
      achievements: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Iqtidorli talabalarni yuklash (Carousel uchun)
  const topTalentUsers = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: { profile: true },
    orderBy: {
      profile: {
        totalPoints: "desc",
      },
    },
    take: 9,
  });

  const carouselTalents: CarouselTalent[] = topTalentUsers.map((user, index) => ({
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Sarlavha & Kirish */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-tiu-800 uppercase tracking-wider mb-2">
            <Users className="w-4 h-4 text-tiu-700" />
            <span>TIU Loyiha va Startap Jamoalari</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Jamoalar Katalogi
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Hakatonlar, startaplar va ilmiy tadqiqotlar uchun talabalar jamoalari. 
            O&apos;zingizga mos jamoani tanlang, a&apos;zolari va yutuqlari bilan tanishing!
          </p>
        </div>
        <div className="neu-pill text-xs font-bold px-4 py-2 text-slate-700 self-start md:self-auto">
          Mavjud jamoalar: <strong className="text-tiu-900">{teams.length} ta</strong>
        </div>
      </div>

      {/* 2. Kategoriyalar DROP-DOWN va Qidiruv filtri */}
      <TeamsCatalogFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        currentSearch={searchQuery}
      />

      {/* 3. Jamoalar UI Katalogi (UI kartochkalar) */}
      {teams.length === 0 ? (
        <div className="glass-panel p-14 rounded-3xl text-center space-y-3">
          <p className="text-base font-bold text-slate-700">Hech qanday jamoa topilmadi</p>
          <p className="text-xs text-slate-500">
            Qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring yoki toifani &quot;Barcha toifalar&quot; qilib tanlang.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="group glass-neu-card rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* 1. UI Cardda Rasmi */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={team.avatarUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"}
                    alt={team.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase bg-white/95 text-tiu-900 shadow-sm backdrop-blur-xs border border-white/40">
                      {team.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950/70 text-white backdrop-blur-xs flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{team.members.length} a&apos;zo</span>
                    </span>
                  </div>
                </div>

                {/* 2. Pastida Nomi va Kichik Izoh */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-tiu-800 transition-colors line-clamp-1">
                    {team.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {team.description}
                  </p>

                  <div className="pt-2 flex items-center space-x-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Yetakchi:</span>
                    <span className="text-tiu-800 font-bold truncate">
                      {team.leader?.profile?.fullName || "Biriktirilmagan"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pastki Harakat va Yutuqlar soni */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-tiu-900 group-hover:bg-tiu-50/50 transition-colors">
                <span className="text-slate-500 font-medium">
                  {team.achievements.length > 0 ? `${team.achievements.length} ta yutuq` : "Yangi jamoa"}
                </span>
                <span className="flex items-center space-x-1 text-tiu-800 group-hover:translate-x-1 transition-transform">
                  <span>Tafsilotlar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 4. Pastida Iqtidorli Talabalarimiz 3-talik Carousel */}
      <TalentsCarousel talents={carouselTalents} />
    </div>
  );
}