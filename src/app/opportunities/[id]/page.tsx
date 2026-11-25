import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  Award,
  Calendar,
  CheckCircle2,
  Users,
  ArrowLeft,
  AlertCircle,
  FileText,
  Sparkles,
  PhoneCall,
  Clock,
} from "lucide-react";
import ApplyClientSection from "./ApplyClientSection";
import OpportunityInteractiveQA from "./OpportunityInteractiveQA";

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
      comments: {
        orderBy: { createdAt: "desc" },
      },
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

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/opportunities"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-tiu-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Barcha tanlovlarga qaytish</span>
      </Link>

      {/* Tanlov Asosiy Kartochkasi */}
      <div className="glass-panel rounded-3xl overflow-hidden space-y-6">
        {/* 1. Tanlov Rasmi */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-100 overflow-hidden">
          <img
            src={
              opportunity.imageUrl ||
              "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80"
            }
            alt={opportunity.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase bg-tiu-900 text-white shadow-md">
              {opportunity.type}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black mb-2 shadow-md">
              <Clock className="w-3.5 h-3.5" />
              <span>{daysLeft} kun qoldi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug drop-shadow-sm">
              {opportunity.title}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          {/* Kvota va Qabul muddati ko'rsatkichlari */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="neu-sunken p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">
                Mukofot / Imkoniyat
              </span>
              <span className="text-sm font-black text-amber-950 mt-1 block">
                {opportunity.award || "100% Kontrakt qoplami"}
              </span>
            </div>

            <div className="neu-sunken p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                Kvota va Qabul
              </span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">
                {opportunity.quota} ta o&apos;rin ({opportunity.applications.length} ariza kelgan)
              </span>
            </div>

            <div className="neu-sunken p-4 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                Muddati (Deadline)
              </span>
              <span className="text-sm font-bold text-red-600 mt-1 block">
                {new Date(opportunity.deadline).toLocaleDateString("uz-UZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Tanlov haqida ma'lumot */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Tanlov Haqida To&apos;liq Ma&apos;lumot
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>

          {/* Shartlar va Mezonlar */}
          {opportunity.requirements && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ishtirok Etish Shartlari va Talablar:</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {opportunity.requirements}
              </p>
            </div>
          )}

          {/* Bog'lanish va Mas'ullar */}
          {opportunity.contactInfo && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start space-x-3 text-xs">
              <PhoneCall className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-900 block">Bog&apos;lanish va Konsultatsiya:</span>
                <span className="text-blue-950 mt-0.5 block">{opportunity.contactInfo}</span>
              </div>
            </div>
          )}

          {/* Ariza Topshirish / Qatnashish Bloki */}
          <div className="pt-4 border-t border-slate-100">
            <ApplyClientSection
              opportunityId={opportunity.id}
              isLoggedIn={!!currentUser}
              isStudent={currentUser?.role === "STUDENT"}
              existingApplication={userApplication}
            />
          </div>
        </div>
      </div>

      {/* 2. Izohlar va Savollar Bloki (Q&A) */}
      <OpportunityInteractiveQA
        opportunityId={opportunity.id}
        initialComments={opportunity.comments as any}
        initialLikes={opportunity.likesCount}
      />
    </div>
  );
}