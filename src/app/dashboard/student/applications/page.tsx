import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { FileText, CheckCircle2, Clock, XCircle, Award, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentApplicationsPage() {
  const user = await getCurrentUser();

  const applications = await prisma.application.findMany({
    where: { userId: user!.id },
    include: { opportunity: true },
    orderBy: { appliedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <FileText className="w-6 h-6 text-tiu-700" />
          <span>Mening Arizalarim</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Universitet grantlari, stipendiyalar va tanlovlarga topshirgan arizalaringiz va ularning holati
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Hozircha arizalar yo&apos;q</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Universitetda ko&apos;plab faol grantlar va stipendiya tanlovlari mavjud. O&apos;z portfoliosingiz bilan ishtirok eting!
          </p>
          <div className="pt-2">
            <Link
              href="/opportunities"
              className="px-5 py-2.5 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs inline-block transition-colors"
            >
              Tanlovlarni ko&apos;rish &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                    {app.opportunity.type}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1">
                    {app.opportunity.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Topshirilgan sana: {new Date(app.appliedAt).toLocaleDateString("uz-UZ")}
                  </div>
                </div>

                <div>
                  {app.status === "ACCEPTED" && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>G&apos;olib / Qabul qilindi</span>
                    </span>
                  )}
                  {app.status === "UNDER_REVIEW" && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Ko&apos;rib chiqilmoqda</span>
                    </span>
                  )}
                  {app.status === "SUBMITTED" && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Yuborildi</span>
                    </span>
                  )}
                  {app.status === "REJECTED" && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 flex items-center space-x-1.5">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Rad etildi</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <strong className="text-slate-700 block mb-0.5">Yuborilgan Motivatsion xat:</strong>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-line">
                    {app.coverLetter}
                  </p>
                </div>

                {app.adminNotes && (
                  <div className="p-3 bg-tiu-50/70 border border-tiu-200 rounded-xl text-tiu-950 font-medium flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Bo&apos;lim xulosasi va fikri: {app.adminNotes}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">
                  Mukofot: {app.opportunity.award || "Ko'rik-tanlov sovrini"}
                </span>
                <Link
                  href={`/opportunities/${app.opportunity.id}`}
                  className="font-bold text-tiu-800 hover:underline flex items-center space-x-1"
                >
                  <span>Tanlov sahifasi</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
