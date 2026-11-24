"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Lock, User, Phone, AlertCircle, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ro'yxatdan o'tishda xatolik yuz berdi");
        setLoading(false);
        return;
      }

      // Ro'yxatdan o'tgach, to'g'ridan-to'g'ri profilni to'ldirishga yo'naltiramiz
      router.push("/dashboard/student/profile");
      router.refresh();
    } catch {
      setError("Server bilan aloqa uzildi. Qaytadan urinib ko'ring.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-tiu-900 to-tiu-700 text-white shadow-md shadow-tiu-900/20 mb-3">
            <GraduationCap className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tezkor Ro&apos;yxatdan O&apos;tish
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Dastlabki hisob oching va kabinetingizda dekanat hamda yo&apos;nalishingizni belgilang
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Ism va Familiya */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Ism *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jasur"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Familiya *
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Aliyev"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Telefon raqam */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Telefon Raqam *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600 focus:bg-white"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Ushbu raqam orqali keyinchalik tizimga kirishingiz mumkin bo&apos;ladi
            </span>
          </div>

          {/* Parol */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Parol *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="p-3 bg-tiu-50/70 border border-tiu-200/80 rounded-xl text-xs text-tiu-950 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-tiu-700 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Dekanat</strong>, <strong>Yo&apos;nalish</strong> va <strong>Guruh</strong> ma&apos;lumotlarini ro&apos;yxatdan o&apos;tgach, shaxsiy kabinetingizda biriktirasiz.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-tiu-800 to-tiu-950 hover:from-tiu-700 hover:to-tiu-900 shadow-md shadow-tiu-900/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? "Ro'yxatdan o'tkazilmoqda..." : "Davom etish va Kabinetga o'tish"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          Hisobingiz bormi?{" "}
          <Link href="/login" className="font-bold text-tiu-800 hover:text-tiu-950 underline ml-1">
            Tizimga kirish
          </Link>
        </div>
      </div>
    </div>
  );
}
