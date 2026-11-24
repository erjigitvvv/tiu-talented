import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Award, Calendar, CheckCircle, ChevronRight, Sparkles, Users } from "lucide-react";
import { OPPORTUNITY_TYPES } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface OpportunitiesPageProps {
  searchParams?: {
    type?: string;
  };
}

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const selectedType = searchParams?.type || "";

  const opportunities = await prisma.opportunity.findMany({
    where: {
      status: "OPEN",
      ...(selectedType ? { type: selectedType } : {}),
    },
    include: {
      applications: true,
    },
    orderBy: {
      deadline: "asc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Sarlavha */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
          <Award className="w-4 h-4" />
          <span>Tanlovlar va Grantlar</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          TIU Iqtidorlar Tanlovlari va Stipendiyalari
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Toshkent Xalqaro Universiteti talabalari uchun rektor grantlari, xalqaro stajirovkalar, hakatonlar va maxsus stipendiyalar dasturlari
        </p>
      </div>

      {/* Toifalar bo'yicha filter */}
      <div className="flex flex-wrap gap-2 pb-2">
        <Link
          href="/opportunities"
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            !selectedType
              ? "bg-tiu-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Barchasi ({opportunities.length})
        </Link>
        {OPPORTUNITY_TYPES.map((t) => (
          <Link
            key={t.value}
            href={`/opportunities?type=${t.value}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedType === t.value
                ? "bg-tiu-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Tanlovlar ro'yxati */}
      {opportunities.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          Ushbu toifada hozircha ochiq tanlovlar mavjud emas.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                    {opp.type}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Kvota: {opp.quota} ta o&apos;rin
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-tiu-800 transition-colors">
                  {opp.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {opp.description}
                </p>

                {opp.requirements && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">Asosiy talab:</span>
                    <span className="line-clamp-2">{opp.requirements}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Mukofot:</span>
                  <span className="font-extrabold text-tiu-800">{opp.award || "Belgilanmagan"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Qabul muddati:</span>
                  <span className="font-semibold text-red-600">
                    {new Date(opp.deadline).toLocaleDateString("uz-UZ")} gacha
                  </span>
                </div>

                <Link
                  href={`/opportunities/${opp.id}`}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-tiu-800 hover:bg-tiu-950 text-white text-center block transition-colors shadow-sm"
                >
                  Batafsil va Ariza topshirish &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
