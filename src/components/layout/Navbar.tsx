"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, X, ArrowLeft } from "lucide-react";

interface CurrentUser {
  id: string;
  email?: string;
  phone?: string;
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

  const isDashboard = pathname.startsWith("/dashboard");

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
    { name: "Jamoalar", href: "/teams" },
    { name: "Iqtidorlilar", href: "/talents" },
    { name: "Tanlovlar va Grantlar", href: "/opportunities" },
    { name: "Olimlar Chati", href: "/chat" },
    { name: "Yangiliklar", href: "/news" },
  ];

  const getDashboardHref = () => {
    if (!user) return "/login";
    if (user.role === "STUDENT") return "/dashboard/student";
    return "/dashboard/department";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-white/80 shadow-[0_8px_30px_rgba(15,23,42,0.035),inset_0_-1px_0_rgba(255,255,255,0.9)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* YUQORI CHAP TARAFDA: TIU RASMIY LOGOSI VA MINIMALISTIK BRENDING */}
          <Link href="/" className="flex items-center space-x-3 group">
            {/* TIU Rasmiy Logosi - Backgroundsiz */}
            <img
              src="/images/tiu-logo.png"
              alt="Tashkent International University"
              className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />

            {/* Platforma Matnli Logosi */}
            <div className="hidden sm:block">
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-xl tracking-tight text-tiu-950">TIU</span>
                <span className="text-xl font-black bg-gradient-to-r from-tiu-700 via-tiu-800 to-amber-600 bg-clip-text text-transparent">
                  TALENTED
                </span>
              </div>
              <p className="text-[10px] tracking-wider uppercase text-slate-400 font-bold -mt-1">
                {isDashboard ? "Boshqaruv Kabineti" : "Toshkent Xalqaro Universiteti"}
              </p>
            </div>
          </Link>

          {/* O'rta: Minimalistik va Backgroundsiz Navigatsiya (Cursor qoyilganda animatsion chiziq) */}
          {!isDashboard ? (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 text-xs lg:text-sm font-bold transition-colors duration-200 group ${
                      isActive ? "text-tiu-950 font-black" : "text-slate-600 hover:text-tiu-950"
                    }`}
                  >
                    <span className="relative z-10 transition-transform duration-200 group-hover:-translate-y-0.5 inline-block">
                      {link.name}
                    </span>
                    {/* Backgroundsiz jonli animatsion chiziq */}
                    <span
                      className={`absolute bottom-0 left-2 right-2 h-[2.5px] bg-gradient-to-r from-tiu-800 via-tiu-900 to-amber-500 rounded-full transition-all duration-300 ease-out ${
                        isActive
                          ? "opacity-100 scale-x-100"
                          : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/"
                className="neu-btn-white inline-flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-tiu-950 px-4 py-2 rounded-xl transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Asosiy sahifaga qaytish</span>
              </Link>
            </div>
          )}

          {/* O'ng tomon: Kirish / Profil Boshqaruvi (Glassmorphism & Neumorphism) */}
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="w-24 h-10 bg-slate-100/80 animate-pulse rounded-2xl" />
            ) : user ? (
              <div className="flex items-center space-x-2 bg-white/85 backdrop-blur-md p-1.5 pl-3 pr-2 rounded-2xl border border-white/90 shadow-[4px_4px_14px_rgba(15,23,42,0.04),-3px_-3px_10px_rgba(255,255,255,0.95)]">
                <Link
                  href={getDashboardHref()}
                  className="flex items-center space-x-2.5 py-1 pr-2 rounded-xl text-slate-800 hover:text-tiu-900 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-tiu-900 text-white flex items-center justify-center text-xs font-black uppercase overflow-hidden shadow-xs ring-1 ring-white/60">
                    {user.profile?.avatarUrl ? (
                      <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.profile?.fullName?.charAt(0) || "U"
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <span className="text-xs font-extrabold text-slate-900 block max-w-[130px] truncate leading-tight">
                      {user.profile?.fullName || user.phone || user.email}
                    </span>
                    <span className="text-[10px] font-bold text-tiu-700 block">
                      {user.role === "STUDENT" ? "Talaba Kabineti" : "Bo'lim Boshlig'i"}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Chiqish"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="neu-btn-primary px-6 py-2.5 text-xs font-black rounded-2xl"
                >
                  Kirish
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="neu-btn-white p-2.5 text-slate-700 hover:text-tiu-900 rounded-2xl"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Glassmorphic) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200/70 bg-white/95 backdrop-blur-2xl px-5 pt-3 pb-6 space-y-2">
          {!isDashboard ? (
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-tiu-900"
              >
                {link.name}
              </Link>
            ))
          ) : (
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Asosiy portalga qaytish</span>
            </Link>
          )}

          <div className="pt-3 border-t border-slate-200">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-2xl bg-tiu-900 text-white font-bold text-sm shadow-sm"
                >
                  Kabinetga o&apos;tish ({user.profile?.fullName || "Profil"})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center px-4 py-2.5 rounded-2xl border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-sm shadow-md"
              >
                Kirish
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}