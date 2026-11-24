"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Award, BookOpen, Calendar, ChevronRight, LogOut, Menu, Sparkles, Trophy, User, Users, X } from "lucide-react";

interface CurrentUser {
  id: string;
  email: string;
  role: "STUDENT" | "DEPT_ADMIN" | "SUPER_ADMIN";
  profile?: {
    fullName: string;
    avatarUrl?: string;
    faculty?: string;
  };
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Asosiy", href: "/" },
    { name: "Iqtidorlar", href: "/talents" },
    { name: "Tanlovlar & Grantlar", href: "/opportunities" },
    { name: "Tadbirdan lavhalar", href: "/events" },
    { name: "Reyting", href: "/leaderboard" },
  ];

  const getDashboardHref = () => {
    if (!user) return "/login";
    if (user.role === "STUDENT") return "/dashboard/student";
    return "/dashboard/department";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tiu-800 to-tiu-950 flex items-center justify-center text-white shadow-md shadow-tiu-900/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-tiu-950">TIU</span>
                <span className="text-xl font-bold bg-gradient-to-r from-tiu-600 to-tiu-800 bg-clip-text text-transparent">
                  TALENTED
                </span>
              </div>
              <p className="text-[10px] tracking-wider uppercase text-slate-500 font-medium -mt-1">
                Toshkent Xalqaro Universiteti
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-tiu-700 bg-tiu-50/80"
                      : "text-slate-600 hover:text-tiu-900 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Auth Buttons / User Pill */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="w-24 h-9 bg-slate-100 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={getDashboardHref()}
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-tiu-50 border border-slate-200/80 text-slate-800 transition-all hover:border-tiu-300"
                >
                  <div className="w-7 h-7 rounded-full bg-tiu-800 text-white flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                    {user.profile?.avatarUrl ? (
                      <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.profile?.fullName?.charAt(0) || "U"
                    )}
                  </div>
                  <span className="text-xs font-semibold max-w-[120px] truncate">
                    {user.profile?.fullName || user.email}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-tiu-100 text-tiu-800">
                    {user.role === "STUDENT" ? "Talaba" : "Bo'lim"}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Chiqish"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-tiu-900 hover:text-tiu-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-tiu-700 to-tiu-900 hover:from-tiu-800 hover:to-tiu-950 rounded-lg shadow-sm shadow-tiu-900/20 hover:shadow transition-all"
                >
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-tiu-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-tiu-50 hover:text-tiu-800"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-lg bg-tiu-800 text-white font-semibold text-sm"
                >
                  Kabinetga o&apos;tish ({user.profile?.fullName || "Profil"})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center px-4 py-2 rounded-lg border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 rounded-lg border border-slate-200 text-tiu-900 font-semibold text-sm"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 rounded-lg bg-tiu-800 text-white font-semibold text-sm"
                >
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
