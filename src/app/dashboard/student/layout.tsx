import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  LayoutDashboard,
  Award,
  Newspaper,
  FileText,
  Trophy,
  User,
  Users2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import StudentSidebarNav from "./StudentSidebarNav";

export const dynamic = "force-dynamic";

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/dashboard/department");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Yon Panel (Sidebar) */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs text-center">
            <div className="w-20 h-20 rounded-2xl bg-tiu-900 text-white flex items-center justify-center font-bold text-2xl mx-auto overflow-hidden shadow-sm">
              {user.profile?.avatarUrl ? (
                <img
                  src={user.profile.avatarUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                user.profile?.fullName?.charAt(0) || "T"
              )}
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mt-3 line-clamp-1">
              {user.profile?.fullName}
            </h3>
            <p className="text-xs text-tiu-700 font-bold mt-0.5">
              {user.profile?.dekanat || user.profile?.faculty}
            </p>
            {user.profile?.specialty && user.profile.specialty !== "Yo'nalish tanlanmagan" && (
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                {user.profile.specialty}
              </p>
            )}
            <div className="mt-3 py-1.5 px-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-black inline-flex items-center space-x-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>{user.profile?.totalPoints || 0} ball to&apos;plangan</span>
            </div>
          </div>

          {/* Submenu va navigatsiya qismlari */}
          <StudentSidebarNav />

          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
            <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TIU Jamoalar</span>
            </div>
            <p className="text-xs text-slate-300">
              Loyiha jamoangiz bormi yoki yangi jamoaga qo&apos;shilmoqchimisiz?
            </p>
            <Link
              href="/teams"
              className="inline-block pt-1 text-xs font-bold text-amber-300 hover:underline"
            >
              Jamoalarni ko&apos;rish &rarr;
            </Link>
          </div>
        </aside>

        {/* Asosiy Kontent Maydoni */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}