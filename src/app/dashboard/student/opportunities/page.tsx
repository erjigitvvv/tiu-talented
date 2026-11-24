import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Award, Calendar, ChevronRight, CheckCircle2 } from "lucide-react";

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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
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
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-tiu-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
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
                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                    🎁 Mukofot: {opp.award}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Muddat: {new Date(opp.deadline).toLocaleDateString("uz-UZ")}
                </span>

                {isApplied ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ariza topshirilgan</span>
                  </span>
                ) : (
                  <Link
                    href={`/opportunities/${opp.id}`}
                    className="px-4 py-2 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold transition-colors"
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
