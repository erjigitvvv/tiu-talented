"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kirishda xatolik yuz berdi");
        setLoading(false);
        return;
      }

      if (data.user.role === "STUDENT") {
        router.push("/dashboard/student");
      } else {
        router.push("/dashboard/department");
      }
      router.refresh();
    } catch {
      setError("Server bilan aloqa uzildi. Qaytadan urinib ko'ring.");
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoLogin: string, demoPass: string) => {
    setLogin(demoLogin);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-tiu-900 to-tiu-700 text-white shadow-md shadow-tiu-900/20 mb-4">
            <Sparkles className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tizimga kirish
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            TIU Talented portali talaba va bo&apos;lim boshqaruvchilari uchun
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Login (Email, Telefon raqam yoki Talaba ID)
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="misol@student.tiu.uz yoki +998901234567"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Parol
              </label>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-tiu-800 to-tiu-950 hover:from-tiu-700 hover:to-tiu-900 shadow-md shadow-tiu-900/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? "Kirilmoqda..." : "Kabinetga kirish"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Demo kirish tugmalari */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2.5">
            Tezkor test kirish (1-klikda to&apos;ldirish):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin("jasur@student.tiu.uz", "student123")}
              className="p-2 border border-slate-200 hover:border-tiu-400 rounded-lg text-left bg-slate-50 hover:bg-tiu-50/50 transition-colors"
            >
              <div className="font-bold text-slate-800">🎓 Talaba</div>
              <div className="text-[10px] text-slate-500">jasur@student.tiu.uz</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("department@tiu.uz", "dept123")}
              className="p-2 border border-slate-200 hover:border-tiu-400 rounded-lg text-left bg-slate-50 hover:bg-tiu-50/50 transition-colors"
            >
              <div className="font-bold text-slate-800">🏛️ Bo&apos;lim Boshlig&apos;i</div>
              <div className="text-[10px] text-slate-500">department@tiu.uz</div>
            </button>
          </div>
        </div>

        {/* Ro'yxatdan o'tish havolasi */}
        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          Hali ro&apos;yxatdan o&apos;tmaganmisiz?{" "}
          <Link href="/register" className="font-bold text-tiu-800 hover:text-tiu-950 underline ml-1">
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </div>
      </div>
    </div>
  );
}
