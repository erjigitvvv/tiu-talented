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
    <nav className="glass-panel p-3 rounded-3xl space-y-1">
      {mainItems.map((item) => {
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
            <Icon className={`w-4 h-4 ${isActive ? "text-tiu-800" : "text-slate-500"}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}

      {/* Submenu qilingan Bo'lim: Akademik Bo'lim (Guruhim va Profil) */}
      <div className="pt-1.5 border-t border-slate-200/50 mt-1.5">
        <button
          onClick={() => setAcademicSubmenuOpen(!academicSubmenuOpen)}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
            pathname.startsWith("/dashboard/student/group") ||
            pathname.startsWith("/dashboard/student/profile")
              ? "text-tiu-950 bg-white/70 font-bold border border-slate-200/50 shadow-xs"
              : "text-slate-700 hover:text-tiu-900 hover:bg-white/60"
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
          <div className="mt-1.5 ml-4 pl-3.5 border-l-2 border-tiu-200/60 space-y-1 py-1">
            <Link
              href="/dashboard/student/group"
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === "/dashboard/student/group"
                  ? "text-tiu-950 bg-white shadow-[inset_1.5px_1.5px_3px_rgba(15,23,42,0.06),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.95)] border border-tiu-200/60 font-bold"
                  : "text-slate-600 hover:text-tiu-900 hover:bg-white/60"
              }`}
            >
              <Users2 className="w-3.5 h-3.5 text-tiu-700" />
              <span>Guruhim</span>
            </Link>

            <Link
              href="/dashboard/student/profile"
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === "/dashboard/student/profile"
                  ? "text-tiu-950 bg-white shadow-[inset_1.5px_1.5px_3px_rgba(15,23,42,0.06),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.95)] border border-tiu-200/60 font-bold"
                  : "text-slate-600 hover:text-tiu-900 hover:bg-white/60"
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