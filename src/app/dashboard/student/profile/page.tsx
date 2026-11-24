"use client";

import { useState, useEffect } from "react";
import { User, Save, CheckCircle2, AlertCircle, Building2, BookOpen, GraduationCap } from "lucide-react";
import { DEKANATLAR, SPECIALTIES } from "@/lib/constants";

export default function StudentProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    dekanat: DEKANATLAR[0],
    specialty: SPECIALTIES[DEKANATLAR[0]]?.[0] || "",
    groupName: "",
    courseYear: "1",
    gpa: "4.5",
    phone: "",
    bio: "",
    avatarUrl: "",
    skills: "",
    telegram: "",
    instagram: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.profile) {
          const p = data.user.profile;
          const currentDekanat = p.dekanat || p.faculty || DEKANATLAR[0];
          setFormData({
            firstName: p.firstName || "",
            lastName: p.lastName || "",
            fullName: p.fullName || "",
            dekanat: currentDekanat,
            specialty: p.specialty || SPECIALTIES[currentDekanat]?.[0] || "",
            groupName: p.groupName || "",
            courseYear: String(p.courseYear || "1"),
            gpa: String(p.gpa || "4.5"),
            phone: p.phone || data.user.phone || "",
            bio: p.bio || "",
            avatarUrl: p.avatarUrl || "",
            skills: p.skills || "",
            telegram: p.telegram || "",
            instagram: p.instagram || "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDekanatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDekanat = e.target.value;
    const defaultSpecialty = SPECIALTIES[newDekanat]?.[0] || "";
    setFormData({
      ...formData,
      dekanat: newDekanat,
      specialty: defaultSpecialty,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          faculty: formData.dekanat,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Profilni saqlashda xatolik yuz berdi");
        setSaving(false);
        return;
      }

      setSuccess("Profil va akademik ma'lumotlar muvaffaqiyatli saqlandi!");
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setError("Server bilan aloqa xatosi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Profil yuklanmoqda...</div>;
  }

  const availableSpecialties = SPECIALTIES[formData.dekanat] || [];

  return (
    <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <User className="w-6 h-6 text-tiu-700" />
          <span>Talaba Profili va Akademik Ma&apos;lumotlari</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Dekanat, ta&apos;lim yo&apos;nalishi, guruh va shaxsiy ko&apos;nikmalaringizni to&apos;ldiring
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-700 font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Shaxsiy ma'lumotlar */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            1. Shaxsiy Ma&apos;lumotlar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Ism va Familiya (F.I.O) *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jasur Aliyev"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Telefon Raqam *
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Telegram Username
              </label>
              <input
                type="text"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                placeholder="@username"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Instagram Username
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="@username"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
              />
            </div>
          </div>
        </div>

        {/* 2. Akademik ma'lumotlar: Dekanat, Yo'nalish, Guruh, Kurs */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-tiu-700" />
            <span>2. Universitet Akademik Tuzilmasi</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dekanat tanlovi */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Dekanat (Fakultet) *
              </label>
              <select
                name="dekanat"
                value={formData.dekanat}
                onChange={handleDekanatChange}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-tiu-600"
              >
                {DEKANATLAR.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Yo'nalish tanlovi (Dekanatga bog'liq dinamik) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Ta&apos;lim Yo&apos;nalishi (Mutaxassislik) *
              </label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-tiu-600"
              >
                {availableSpecialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Akademik Guruh *
              </label>
              <input
                type="text"
                name="groupName"
                required
                value={formData.groupName}
                onChange={handleChange}
                placeholder="Masalan: IT-21-02"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kurs
              </label>
              <select
                name="courseYear"
                value={formData.courseYear}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
              >
                <option value="1">1-kurs</option>
                <option value="2">2-kurs</option>
                <option value="3">3-kurs</option>
                <option value="4">4-kurs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                GPA Ko&apos;rsatkichi (0.00 - 5.00)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
              />
            </div>
          </div>
        </div>

        {/* 3. Portfolio va Ko'nikmalar */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            3. Portfolio va Ko&apos;nikmalar
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Ko&apos;nikmalar (Vergul bilan ajrating)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Python, React, Data Analysis, IELTS 7.5, UI/UX"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Avatar Rasm Havolasi (URL)
            </label>
            <input
              type="url"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/... yoki rasm linki"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Qisqacha o&apos;zingiz haqingizda (Bio)
            </label>
            <textarea
              rows={3}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Qiziqishlaringiz, loyihalaringiz va maqsadlaringiz haqida..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="py-3 px-6 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saqlanmoqda..." : "Profilni saqlash"}</span>
        </button>
      </form>
    </div>
  );
}
