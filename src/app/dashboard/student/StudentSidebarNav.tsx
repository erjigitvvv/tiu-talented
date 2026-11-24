"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Award,
  Newspaper,
  FileText,
  Trophy,
  User,
  Users2,
  ChevronDown,
  GraduationCap,
} from "lucide-react";

export default function StudentSidebarNav() {
  const pathname = usePathname();
  const [academicSubmenuOpen, setAcademicSubmenuOpen] = useState(
    pathname.startsWith("/dashboard/student/group") ||
      pathname.startsWith("/dashboard/student/profile")
  );

  const mainItems = [
    { name: "Umumiy Kabinet", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "E'lonlar va Tanlovlar", href: "/dashboard/student/opportunities", icon: Award },
    { name: "Yangiliklar", href: "/dashboard/student/news", icon: Newspaper },
    { name: "Mening Arizalarim", href: "/dashboard/student/applications", icon: FileText },
    { name: "Yutuqlarim", href: "/dashboard/student/achievements", icon: Trophy },
  ];

  return (
    <nav className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
      {mainItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              isActive
                ? "text-tiu-900 bg-tiu-50/90 font-bold shadow-xs"
                : "text-slate-700 hover:text-tiu-900 hover:bg-slate-50"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-tiu-900" : "text-slate-500"}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}

      {/* Submenu qilingan Bo'lim: Akademik Bo'lim (Guruhim va Profil) */}
      <div className="pt-1">
        <button
          onClick={() => setAcademicSubmenuOpen(!academicSubmenuOpen)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            pathname.startsWith("/dashboard/student/group") ||
            pathname.startsWith("/dashboard/student/profile")
              ? "text-tiu-900 bg-slate-50 font-bold"
              : "text-slate-700 hover:text-tiu-900 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-4 h-4 text-tiu-700" />
            <span>Akademik Bo&apos;lim</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              academicSubmenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {academicSubmenuOpen && (
          <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-200 space-y-1 py-1">
            <Link
              href="/dashboard/student/group"
              className={`flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                pathname === "/dashboard/student/group"
                  ? "text-tiu-900 bg-tiu-50 font-bold"
                  : "text-slate-600 hover:text-tiu-900 hover:bg-slate-50"
              }`}
            >
              <Users2 className="w-3.5 h-3.5 text-tiu-700" />
              <span>Guruhim</span>
            </Link>

            <Link
              href="/dashboard/student/profile"
              className={`flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                pathname === "/dashboard/student/profile"
                  ? "text-tiu-900 bg-tiu-50 font-bold"
                  : "text-slate-600 hover:text-tiu-900 hover:bg-slate-50"
              }`}
            >
              <User className="w-3.5 h-3.5 text-tiu-700" />
              <span>Mening Profilim</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}