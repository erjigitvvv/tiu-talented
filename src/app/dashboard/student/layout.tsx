import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  User,
  Trophy,
  Award,
  FileText,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";

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

  const navItems = [
    { name: "Umumiy Kabinet", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "Yutuqlarim", href: "/dashboard/student/achievements", icon: Trophy },
    { name: "Mening Arizalarim", href: "/dashboard/student/applications", icon: FileText },
    { name: "Profilni Tahrirlash", href: "/dashboard/student/portfolio", icon: User },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Yon Panel (Sidebar) */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-tiu-800 to-tiu-600 text-white flex items-center justify-center font-bold text-2xl mx-auto overflow-hidden shadow-sm">
              {user.profile?.avatarUrl ? (
                <img
                  src={user.profile.avatarUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                user.profile?.fullName.charAt(0) || "T"
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-base mt-3 line-clamp-1">
              {user.profile?.fullName}
            </h3>
            <p className="text-xs text-tiu-700 font-medium">
              {user.profile?.faculty}
            </p>
            <div className="mt-3 py-1.5 px-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-black inline-block">
              🏆 {user.profile?.totalPoints || 0} ball to&apos;plangan
            </div>
          </div>

          <nav className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-tiu-900 hover:bg-tiu-50/70 transition-colors"
                >
                  <Icon className="w-4 h-4 text-tiu-700" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 bg-gradient-to-br from-tiu-900 to-tiu-950 text-white rounded-2xl space-y-2">
            <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Imkoniyatlar</span>
            </div>
            <p className="text-xs text-slate-300">
              Yangi tanlov va grantlarga ariza topshirib ko&apos;rdingizmi?
            </p>
            <Link
              href="/opportunities"
              className="inline-block pt-1 text-xs font-bold text-amber-300 hover:underline"
            >
              Tanlovlarni ko&apos;rish &rarr;
            </Link>
          </div>
        </aside>

        {/* Asosiy Kontent */}
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}
