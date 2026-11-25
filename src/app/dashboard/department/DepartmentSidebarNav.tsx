"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Award,
  FileCheck2,
  Camera,
  ShieldCheck,
} from "lucide-react";

export default function DepartmentSidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Bosh Sahifa", href: "/dashboard/department", icon: LayoutDashboard },
    { name: "Iqtidorli Talabalar", href: "/dashboard/department/talents", icon: UserCheck },
    { name: "Jamoalar Katalogi", href: "/dashboard/department/teams", icon: Users },
    { name: "Grantlar & Tanlovlar", href: "/dashboard/department/opportunities", icon: Award },
    { name: "Kelgan Arizalar", href: "/dashboard/department/applications", icon: FileCheck2 },
    { name: "E'lonlar & Lavhalar", href: "/dashboard/department/events", icon: Camera },
    { name: "Yutuqlar Verifikatsiyasi", href: "/dashboard/department/verifications", icon: ShieldCheck },
  ];

  return (
    <nav className="glass-panel p-3 rounded-3xl space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              isActive
                ? "text-tiu-950 bg-white/90 shadow-[inset_1.5px_1.5px_3px_rgba(15,23,42,0.06),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.95)] border border-tiu-200/60 font-bold"
                : "text-slate-700 hover:text-tiu-900 hover:bg-white/60 hover:shadow-xs"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-tiu-800" : "text-tiu-700"}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
