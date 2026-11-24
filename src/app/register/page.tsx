"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Lock, Mail, User, Phone, BookOpen, AlertCircle } from "lucide-react";
import { FACULTIES } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    groupName: "",
    courseYear: "1",
    faculty: FACULTIES[0],
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        setError(data.error || "Ro'yxatdan o'tishda xatolik");
        setLoading(false);
        return;
      }

      router.push("/dashboard/student");
      router.refresh();
    } catch {
      setError("Server bilan aloqa uzildi. Qaytadan urinib ko'ring.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-tiu-900 to-tiu-700 text-white shadow-md shadow-tiu-900/20 mb-4">
            <GraduationCap className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Talaba Ro&apos;yxatdan O&apos;tish
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            TIU Talented portali orqali jamoalarga qo&apos;shiling va grantlar yutib oling
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* 1. Ism va Familiya */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Ism *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jasur"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-tiu-600 focus:bg-white"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-tiu-600 focus:bg-white"
              />
            </div>
          </div>

          {/* 2. Telefon raqam va Guruh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Telefon Raqam *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+998 90 123 45 67"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-tiu-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Guruh *
              </label>
              <input
                type="text"
                name="groupName"
                required
                value={formData.groupName}
                onChange={handleChange}
                placeholder="IT-21-02"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-tiu-600 focus:bg-white"
              />
            </div>
          </div>

          {/* 3. Kurs va Fakultet */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kurs *
              </label>
              <select
                name="courseYear"
                value={formData.courseYear}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-tiu-600 focus:bg-white"
              >
                <option value="1">1-kurs</option>
                <option value="2">2-kurs</option>
                <option value="3">3-kurs</option>
                <option value="4">4-kurs</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Fakultet
              </label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-tiu-600 focus:bg-white"
              >
                {FACULTIES.map((fac) => (
                  <option key={fac} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Email (ixtiyoriy) va Parol */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email (ixtiyoriy)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="misol@student.tiu.uz"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-tiu-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Parol *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-tiu-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-tiu-800 to-tiu-950 hover:from-tiu-700 hover:to-tiu-900 shadow-md shadow-tiu-900/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? "Ro'yxatdan o'tkazilmoqda..." : "Ro'yxatdan o'tish"}</span>
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
