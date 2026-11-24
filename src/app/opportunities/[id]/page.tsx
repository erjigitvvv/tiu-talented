import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Award, Calendar, CheckCircle2, Users, ArrowLeft, AlertCircle, FileText } from "lucide-react";
import ApplyClientSection from "./ApplyClientSection";

export const dynamic = "force-dynamic";

interface OpportunityDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: params.id },
    include: {
      applications: true,
    },
  });

  if (!opportunity) {
    notFound();
  }

  const currentUser = await getCurrentUser();

  // Agar talaba bo'lsa, uning arizasi bormi tekshirish
  let userApplication = null;
  if (currentUser && currentUser.role === "STUDENT") {
    userApplication = await prisma.application.findUnique({
      where: {
        opportunityId_userId: {
          opportunityId: params.id,
          userId: currentUser.id,
        },
      },
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/opportunities"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-tiu-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Barcha tanlovlarga qaytish</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 uppercase">
            {opportunity.type}
          </span>
          <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium">
            <span>Kvota: <strong className="text-slate-800">{opportunity.quota} nafar</strong></span>
            <span>Arizalar soni: <strong className="text-slate-800">{opportunity.applications.length} ta</strong></span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {opportunity.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60">
              <span className="text-amber-800 font-medium block">Mukofot jamg&apos;armasi:</span>
              <span className="text-base font-extrabold text-amber-900">
                {opportunity.award || "Diplom va sertifikat"}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Qabul tugash muddati:</span>
              <span className="text-base font-bold text-red-600">
                {new Date(opportunity.deadline).toLocaleDateString("uz-UZ")}
              </span>
            </div>
          </div>
        </div>

        {/* Tavsif */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Tanlov haqida ma&apos;lumot
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {opportunity.description}
          </p>
        </div>

        {/* Talablar */}
        {opportunity.requirements && (
          <div className="p-5 bg-tiu-50/60 rounded-2xl border border-tiu-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-tiu-900">
              Qatnashish Talablari va Mezonlar:
            </h4>
            <p className="text-xs sm:text-sm text-tiu-950 leading-relaxed whitespace-pre-line">
              {opportunity.requirements}
            </p>
          </div>
        )}

        {/* Ariza topshirish bloki */}
        <div className="pt-6 border-t border-slate-200">
          <ApplyClientSection
            opportunityId={opportunity.id}
            isLoggedIn={!!currentUser}
            isStudent={currentUser?.role === "STUDENT"}
            existingApplication={userApplication}
          />
        </div>
      </div>
    </div>
  );
}
