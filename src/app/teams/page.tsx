import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Users, UserPlus, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

interface TeamsPageProps {
  searchParams?: {
    category?: string;
  };
}

const CATEGORIES = [
  "Barchasi",
  "Hakaton jamoasi",
  "Startap",
  "Ilmiy tadqiqot",
  "Robototexnika",
];

export default async function TeamsPage({ searchParams }: TeamsPageProps) {
  const selectedCategory = searchParams?.category || "Barchasi";

  const teams = await prisma.team.findMany({
    where: {
      ...(selectedCategory && selectedCategory !== "Barchasi"
        ? { category: selectedCategory }
        : {}),
    },
    include: {
      leader: { include: { profile: true } },
      members: {
        where: { status: "ACCEPTED" },
        include: {
          user: { include: { profile: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Sarlavha */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-tiu-700 uppercase tracking-wider mb-2">
          <Users className="w-4 h-4" />
          <span>Talabalar Loyiha Jamoalari</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          TIU Iqtidorlar Jamoalari Katalogi
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Startaplar, ilmiy tadqiqotlar va hakatonlarda ishtirok etayotgan talabalar jamoalari. 
          O&apos;zingizga mos jamoani tanlang yoki yangi a&apos;zolar safiga qo&apos;shiling!
        </p>
      </div>

      {/* Toifalar bo'yicha filter */}
      <div className="flex flex-wrap gap-2 pb-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={cat === "Barchasi" ? "/teams" : `/teams?category=${cat}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? "bg-tiu-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Jamoalar kartochkalari */}
      {teams.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          Ushbu toifada hozircha jamoalar topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-tiu-800 to-tiu-600 text-white flex items-center justify-center font-bold text-xl overflow-hidden shadow-sm">
                    {team.avatarUrl ? (
                      <img src={team.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      team.name.charAt(0)
                    )}
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                    {team.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-tiu-800 transition-colors">
                    {team.name}
                  </h3>
                  <p className="text-xs text-tiu-700 font-medium mt-0.5">
                    Yetakchi: {team.leader.profile?.fullName || "Talaba"}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {team.description}
                  </p>
                </div>

                {/* Qidirilayotgan mutaxassislar */}
                {team.neededRoles && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <div className="text-[10px] uppercase font-bold text-amber-900 flex items-center space-x-1">
                      <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                      <span>Jamoaga a&apos;zo qidirilmoqda:</span>
                    </div>
                    <div className="text-xs text-amber-950 font-semibold">
                      {team.neededRoles}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium">
                  👥 <strong>{team.members.length} nafar</strong> a&apos;zo
                </div>
                <Link
                  href={`/teams/${team.id}`}
                  className="px-4 py-2 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Tarkib & Qo&apos;shilish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
