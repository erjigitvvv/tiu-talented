import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Award, Calendar, ChevronRight, Sparkles, Users, ArrowRight, Heart, MessageSquare } from "lucide-react";
import { OPPORTUNITY_TYPES } from "@/lib/constants";
import OpportunitiesFilter from "./OpportunitiesFilter";

export const dynamic = "force-dynamic";

interface OpportunitiesPageProps {
  searchParams?: {
    type?: string;
    q?: string;
  };
}

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const selectedType = searchParams?.type || "";
  const searchQuery = searchParams?.q?.toLowerCase() || "";

  const opportunities = await prisma.opportunity.findMany({
    where: {
      status: "OPEN",
      ...(selectedType ? { type: selectedType } : {}),
      ...(searchQuery
        ? {
            OR: [
              { title: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { award: { contains: searchQuery } },
            ],
          }
        : {}),
    },
    include: {
      applications: true,
      comments: true,
    },
    orderBy: {
      deadline: "asc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Sarlavha */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>Tanlovlar va Grantlar Katalogi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            TIU Tanlovlari, Grantlari va Stipendiyalari
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Toshkent Xalqaro Universiteti talabalari uchun rektor grantlari, xalqaro stajirovkalar, hakatonlar va maxsus stipendiyalar dasturlari
          </p>
        </div>
        <div className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 self-start md:self-auto">
          Faol tanlovlar: <strong className="text-tiu-900">{opportunities.length} ta</strong>
        </div>
      </div>

      {/* KATEGORIYALAR DROP-DOWN VA QIDIRUV FILTRI */}
      <OpportunitiesFilter
        types={OPPORTUNITY_TYPES}
        selectedType={selectedType}
        currentSearch={searchQuery}
      />

      {/* Tanlovlar kartochkalari ro'yxati */}
      {opportunities.length === 0 ? (
        <div className="bg-white p-14 rounded-3xl border border-slate-200 text-center space-y-3">
          <p className="text-base font-bold text-slate-700">Tanlovlar topilmadi</p>
          <p className="text-xs text-slate-500">
            Qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring yoki toifani barchasiga o&apos;tkazing.
          </p>
        </div>
      ) : (
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
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Tanlov Rasmi */}
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
                      <span className="px-3 py-1 rounded-lg text-[11px] font-black uppercase bg-tiu-900 text-white shadow-xs">
                        {opp.type}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                        {daysLeft} kun qoldi
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-tiu-800 transition-colors line-clamp-2 leading-snug">
                      {opp.title}
                    </h3>

                    {opp.award && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs font-bold text-amber-950 flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="truncate">Mukofot: {opp.award}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>
                </div>

                {/* Pastki Harakat va Savollar/Izohlar soni */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-tiu-900 group-hover:bg-tiu-50/50 transition-colors">
                  <div className="flex items-center space-x-3 text-slate-500 font-semibold">
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{opp.comments.length} ta savol</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Heart className="w-3.5 h-3.5 text-red-500" />
                      <span>{opp.likesCount}</span>
                    </span>
                  </div>

                  <span className="flex items-center space-x-1 text-tiu-800 group-hover:translate-x-1 transition-transform">
                    <span>Batafsil & Topshirish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}