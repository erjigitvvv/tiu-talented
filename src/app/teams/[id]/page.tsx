import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Users, UserPlus, ArrowLeft, ExternalLink, ShieldCheck, Trophy, Sparkles } from "lucide-react";
import JoinTeamModal from "./JoinTeamModal";

export const dynamic = "force-dynamic";

interface TeamDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const team = await prisma.team.findUnique({
    where: { id: params.id },
    include: {
      leader: { include: { profile: true } },
      members: {
        include: {
          user: { include: { profile: true } },
        },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!team) {
    notFound();
  }

  const currentUser = await getCurrentUser();

  const userMembership = currentUser
    ? team.members.find((m) => m.userId === currentUser.id)
    : null;

  const isAlreadyMember = userMembership?.status === "ACCEPTED";
  const isPending = userMembership?.status === "PENDING";
  const acceptedMembers = team.members.filter((m) => m.status === "ACCEPTED");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/teams"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-tiu-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Barcha jamoalarga qaytish</span>
      </Link>

      {/* Jamoa Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-tiu-800 to-tiu-600 text-white flex items-center justify-center font-black text-3xl shadow-sm overflow-hidden flex-shrink-0">
              {team.avatarUrl ? (
                <img src={team.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                team.name.charAt(0)
              )}
            </div>

            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                {team.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {team.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Fakultet: <strong className="text-slate-700">{team.faculty || "Universitetlararo"}</strong> • 
                Yetakchi: <strong className="text-tiu-800">{team.leader.profile?.fullName}</strong>
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <JoinTeamModal
              teamId={team.id}
              isLoggedIn={!!currentUser}
              isStudent={currentUser?.role === "STUDENT"}
              isAlreadyMember={!!isAlreadyMember}
              isPending={!!isPending}
            />
          </div>
        </div>

        {/* Tavsif */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Jamoa Maqsadi va Yo&apos;nalishi
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {team.description}
          </p>
        </div>

        {/* Qidirilayotgan mutaxassislar */}
        {team.neededRoles && (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start space-x-3">
            <UserPlus className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase text-amber-900 tracking-wider">
                Jamoaga quyidagi mutaxassislar kerak:
              </h4>
              <p className="text-xs sm:text-sm text-amber-950 font-semibold">
                {team.neededRoles}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Jamoa A'zolari Ro'yxati */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-tiu-700" />
            <span>Jamoa Tarkibi va Talabalar ({acceptedMembers.length} nafar)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {acceptedMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-tiu-300 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-tiu-800 text-white flex items-center justify-center font-bold text-sm overflow-hidden flex-shrink-0">
                  {member.user.profile?.avatarUrl ? (
                    <img
                      src={member.user.profile.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.user.profile?.fullName.charAt(0) || "T"
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {member.user.profile?.fullName}
                  </h4>
                  <div className="text-[11px] text-slate-500">
                    {member.user.profile?.faculty}
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                    {member.role === "LEADER" ? "👑 Yetakchi" : member.role}
                  </span>
                </div>
              </div>

              <Link
                href={`/talents/${member.user.id}`}
                className="text-xs font-bold text-tiu-800 hover:underline flex-shrink-0"
                title="Portfoliosini ko'rish"
              >
                Portfolio &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
