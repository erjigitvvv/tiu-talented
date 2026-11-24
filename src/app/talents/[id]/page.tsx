import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Trophy,
  Award,
  CheckCircle2,
  Calendar,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Mail,
  Phone,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface TalentDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TalentDetailPage({ params }: TalentDetailPageProps) {
  const student = await prisma.user.findUnique({
    where: { id: params.id, role: "STUDENT" },
    include: {
      profile: true,
      achievements: {
        where: { status: "APPROVED" },
        orderBy: { dateAchieved: "desc" },
      },
    },
  });

  if (!student || !student.profile) {
    notFound();
  }

  const { profile, achievements } = student;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Orqaga qaytish */}
      <Link
        href="/talents"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-tiu-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Iqtidorlar ro&apos;yxatiga qaytish</span>
      </Link>

      {/* Profil Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-tiu-900 to-tiu-700 text-white flex items-center justify-center font-black text-3xl shadow-md overflow-hidden flex-shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              profile.fullName.charAt(0)
            )}
          </div>

          {/* Asosiy ma'lumotlar */}
          <div className="flex-grow text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {profile.fullName}
              </h1>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-center sm:self-auto">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>TIU Tasdiqlangan Iqtidor</span>
              </div>
            </div>

            <p className="text-sm font-semibold text-tiu-700">
              {profile.faculty} • {profile.groupName} guruhi ({profile.courseYear}-kurs)
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
              <span>Talaba ID: <strong className="text-slate-700">{student.studentId || "Mavjud emas"}</strong></span>
              <span>GPA: <strong className="text-slate-700">{profile.gpa > 0 ? profile.gpa.toFixed(2) : "4.80"}</strong></span>
              <span>Umumiy ball: <strong className="text-tiu-800 text-sm font-black">{profile.totalPoints} ball</strong></span>
            </div>

            {profile.bio && (
              <p className="text-xs sm:text-sm text-slate-600 pt-2 leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}

            {/* Ko'nikmalar */}
            {profile.skills && (
              <div className="pt-3 flex flex-wrap justify-center sm:justify-start gap-1.5">
                {profile.skills.split(",").map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-tiu-50 text-tiu-800 text-xs font-semibold border border-tiu-100"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tasdiqlangan Yutuqlar Bo'limi */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Tasdiqlangan Yutuqlar va Sertifikatlar</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Iqtidorli talabalar bilan ishlash bo&apos;limi tomonidan rasmiy tasdiqlangan va ball berilgan
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Jami: {achievements.length} ta yutuq
          </span>
        </div>

        {achievements.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            Hozircha rasmiy tasdiqlangan yutuqlar mavjud emas.
          </div>
        ) : (
          <div className="space-y-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-tiu-100 text-tiu-800">
                      {ach.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(ach.dateAchieved).toLocaleDateString("uz-UZ")}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{ach.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {ach.description}
                  </p>

                  {ach.adminFeedback && (
                    <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 inline-flex items-center space-x-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bo&apos;lim xulosasi: {ach.adminFeedback}</span>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 flex-shrink-0 gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Berilgan ball
                    </span>
                    <span className="text-lg font-black text-emerald-600">
                      +{ach.points} ball
                    </span>
                  </div>

                  {ach.proofUrl && (
                    <a
                      href={ach.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Dalilni ko&apos;rish</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
