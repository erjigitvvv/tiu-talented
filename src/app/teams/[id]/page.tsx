import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import TeamDetailInteractive from "./TeamDetailInteractive";

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
      leader: {
        include: {
          profile: true,
          achievements: {
            where: { status: "APPROVED" },
          },
        },
      },
      members: {
        include: {
          user: {
            include: {
              profile: true,
              achievements: {
                where: { status: "APPROVED" },
              },
            },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
      achievements: {
        include: {
          comments: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { dateAchieved: "desc" },
      },
      feedbacks: {
        orderBy: { createdAt: "desc" },
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

  // Format data for interactive component
  const teamFormatted = {
    ...team,
    createdAt: team.createdAt.toISOString(),
    members: acceptedMembers.map((m) => ({
      ...m,
      user: {
        ...m.user,
        profile: m.user.profile
          ? {
              ...m.user.profile,
              id: m.user.id,
              achievements: m.user.achievements,
            }
          : null,
      },
    })),
    leader: {
      ...team.leader,
      profile: team.leader.profile
        ? {
            ...team.leader.profile,
            id: team.leader.id,
            achievements: team.leader.achievements,
          }
        : null,
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/teams"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-tiu-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Barcha jamoalarga qaytish</span>
      </Link>

      <TeamDetailInteractive
        team={teamFormatted as any}
        currentUser={currentUser as any}
        isAlreadyMember={!!isAlreadyMember}
        isPending={!!isPending}
      />
    </div>
  );
}