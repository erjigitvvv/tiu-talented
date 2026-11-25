import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Award, Calendar, ChevronRight, CheckCircle2, Gift } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentOpportunitiesPage() {
  const user = await getCurrentUser();

  const [opportunities, userApplications] = await Promise.all([
    prisma.opportunity.findMany({
      where: { status: "OPEN" },
      orderBy: { deadline: "asc" },
    }),
    prisma.application.findMany({
      where: { userId: user!.id },
      select: { opportunityId: true, status: true },
    }),
  ]);

  const appliedIds = new Map(userApplications.map((a) => [a.opportunityId, a.status]));

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <Award className="w-6 h-6 text-amber-500" />
          <span>E&apos;lonlar va Tanlovlar</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Universitet tomonidan e&apos;lon qilingan barcha faol rektor grantlari, stipendiyalar va musobaqalar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opp) => {
          const isApplied = appliedIds.has(opp.id);
          const appStatus = appliedIds.get(opp.id);

          return (
            <div
              key={opp.id}
              className="glass-neu-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-tiu-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="neu-pill px-2.5 py-0.5 rounded-md text-[10px] font-extrabold text-amber-800 uppercase">
                    {opp.type}
                  </span>
                  <span className="text-xs text-slate-400">
                    Kvota: {opp.quota} ta o&apos;rin
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{opp.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {opp.description}
                </p>

                {opp.award && (
                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/60 flex items-center space-x-1.5 shadow-xs">
                    <Gift className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mukofot: {opp.award}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Muddat: {new Date(opp.deadline).toLocaleDateString("uz-UZ")}
                </span>

                {isApplied ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center space-x-1 shadow-xs border border-emerald-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ariza topshirilgan</span>
                  </span>
                ) : (
                  <Link
                    href={`/opportunities/${opp.id}`}
                    className="neu-btn-primary px-4 py-2 rounded-xl text-white font-bold"
                  >
                    Ariza topshirish &rarr;
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
