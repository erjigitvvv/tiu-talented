import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Building2 } from "lucide-react";
import DepartmentSidebarNav from "./DepartmentSidebarNav";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Yon Panel */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="glass-neu-card p-5 rounded-3xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-tiu-950 to-tiu-800 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-md border border-white/20">
              <Building2 className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mt-3 line-clamp-1">
              {user.profile?.fullName || "Bo'lim Boshlig'i"}
            </h3>
            <p className="text-[11px] text-tiu-700 font-semibold mt-0.5">
              Iqtidorli talabalar bilan ishlash bo&apos;limi
            </p>
            <div className="neu-pill mt-2.5 px-3 py-1 text-tiu-900 rounded-lg text-[10px] font-extrabold uppercase inline-block">
              Boshqaruvchi
            </div>
          </div>

          <DepartmentSidebarNav />
        </aside>

        {/* Asosiy Kontent */}
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}
