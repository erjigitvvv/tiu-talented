import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  LayoutDashboard,
  ShieldCheck,
  Award,
  FileCheck2,
  Camera,
  Users,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DepartmentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "DEPT_ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/dashboard/student");
  }

  const navItems = [
    { name: "Bo'lim Boshqaruvi", href: "/dashboard/department", icon: LayoutDashboard },
    { name: "Verifikatsiya Navbati", href: "/dashboard/department/verifications", icon: ShieldCheck },
    { name: "Tanlovlar & Grantlar", href: "/dashboard/department/opportunities", icon: Award },
    { name: "Kelgan Arizalar", href: "/dashboard/department/applications", icon: FileCheck2 },
    { name: "Tadbirdan Lavhalar", href: "/dashboard/department/events", icon: Camera },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Yon Panel */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-tiu-950 to-tiu-800 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
              🏛️
            </div>
            <h3 className="font-bold text-slate-900 text-sm mt-3 line-clamp-1">
              {user.profile?.fullName || "Bo'lim Boshlig'i"}
            </h3>
            <p className="text-[11px] text-tiu-700 font-semibold mt-0.5">
              Iqtidorli talabalar bilan ishlash bo&apos;limi
            </p>
            <div className="mt-2.5 px-2.5 py-1 bg-tiu-50 border border-tiu-200 text-tiu-900 rounded-lg text-[10px] font-extrabold uppercase">
              Boshqaruvchi
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
        </aside>

        {/* Asosiy Kontent */}
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}
