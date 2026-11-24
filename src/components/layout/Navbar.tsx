"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, X, ArrowLeft, ShieldCheck } from "lucide-react";

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

  // Ommaviy navlinklar: faqat ommaviy sahifalarda ko'rinadi (kabinet ichida kerak emas)
  const navLinks = [
    { name: "Asosiy", href: "/" },
    { name: "Jamoalar", href: "/teams" },
    { name: "Iqtidorlilar", href: "/talents" },
    { name: "Tanlovlar va Grantlar", href: "/opportunities" },
    { name: "Yangiliklar", href: "/news" },
  ];

  const getDashboardHref = () => {
    if (!user) return "/login";
    if (user.role === "STUDENT") return "/dashboard/student";
    return "/dashboard/department";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Chap tomon: Platforma Logosi */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-tiu-900 flex items-center justify-center text-white shadow-md shadow-tiu-900/10 group-hover:scale-105 transition-transform">
              <span className="font-black text-sm tracking-tighter">TIU</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-tiu-950">TIU</span>
                <span className="text-xl font-bold bg-gradient-to-r from-tiu-600 to-tiu-800 bg-clip-text text-transparent">
                  TALENTED
                </span>
              </div>
              <p className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold -mt-1">
                {isDashboard ? "Boshqaruv Kabineti" : "Iqtidorli Talabalar Portali"}
              </p>
            </div>
          </Link>

          {/* O'rta: Navigatsiya (Faqat kabinet tashqarisida ko'rinadi) */}
          {!isDashboard ? (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "text-tiu-900 bg-tiu-50/90 font-bold shadow-xs"
                        : "text-slate-600 hover:text-tiu-900 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-tiu-900 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Asosiy portalga qaytish</span>
              </Link>
            </div>
          )}

          {/* O'ng tomon: Kirish/Kabinet tugmalari va YUQORI O'NG BURCHAKDAGI TIU RASMIY LOGOSI */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Foydalanuvchi Kabineti / Kirish tugmasi */}
            <div className="hidden sm:flex items-center space-x-3">
              {loading ? (
                <div className="w-20 h-9 bg-slate-100 animate-pulse rounded-xl" />
              ) : user ? (
                <div className="flex items-center space-x-2">
                  <Link
                    href={getDashboardHref()}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-tiu-50 border border-slate-200/80 text-slate-800 transition-all hover:border-tiu-300"
                  >
                    <div className="w-7 h-7 rounded-full bg-tiu-800 text-white flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                      {user.profile?.avatarUrl ? (
                        <img src={user.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user.profile?.fullName?.charAt(0) || "U"
                      )}
                    </div>
                    <span className="text-xs font-semibold max-w-[120px] truncate">
                      {user.profile?.fullName || user.phone || user.email}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-tiu-100 text-tiu-800">
                      {user.role === "STUDENT" ? "Talaba" : "Bo'lim"}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    title="Chiqish"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 text-xs font-bold text-white bg-tiu-900 hover:bg-tiu-950 rounded-xl shadow-xs transition-all"
                >
                  Kirish
                </Link>
              )}
            </div>

            {/* YUQORI O'NG BURCHAKDAGI TIU RASMIY LOGOSI */}
            <div className="flex items-center pl-2 sm:pl-3 sm:border-l sm:border-slate-200">
              <Link href="https://tiu.uz" target="_blank" rel="noopener noreferrer" title="Tashkent International University Rasmiy Sayti">
                <img
                  src="/images/tiu-logo.png"
                  alt="Tashkent International University"
                  className="h-11 sm:h-12 w-auto object-contain hover:opacity-90 transition-opacity"
                />
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-tiu-900 hover:bg-slate-100 rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2">
          {!isDashboard ? (
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:bg-tiu-50 hover:text-tiu-900"
              >
                {link.name}
              </Link>
            ))
          ) : (
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              &larr; Asosiy portalga qaytish
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-tiu-900 text-white font-semibold text-sm"
                >
                  Kabinetga o&apos;tish ({user.profile?.fullName || "Profil"})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center px-4 py-2 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2.5 rounded-xl bg-tiu-900 text-white font-bold text-sm"
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