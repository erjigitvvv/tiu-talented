"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Trophy, FileCheck, ExternalLink, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { ACHIEVEMENT_CATEGORIES } from "@/lib/constants";

export default function StudentAchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: ACHIEVEMENT_CATEGORIES[0],
    description: "",
    proofUrl: "",
    dateAchieved: new Date().toISOString().split("T")[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadAchievements = () => {
    setLoading(true);
    fetch("/api/achievements")
      .then((res) => res.json())
      .then((data) => {
        if (data.achievements) setAchievements(data.achievements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Yutuqni yuklashda xatolik yuz berdi");
        setSubmitting(false);
        return;
      }

      setSuccessMsg("Yutuq muvaffaqiyatli yuklandi va bo'lim tekshiruviga yuborildi!");
      setShowModal(false);
      setFormData({
        title: "",
        category: ACHIEVEMENT_CATEGORIES[0],
        description: "",
        proofUrl: "",
        dateAchieved: new Date().toISOString().split("T")[0],
      });
      loadAchievements();
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch {
      setError("Aloqa xatosi yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>Mening Yutuqlarim va Sertifikatlarim</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Yangi yutuq yuklang. Bo&apos;lim xodimi tekshirib tasdiqlagach, profilingizga rasmiy ball qo&apos;shiladi
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center space-x-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi yutuq qo&apos;shish</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Yutuqlar Ro'yxati */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Yuklanmoqda...</div>
      ) : achievements.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Hozircha yutuqlar yo&apos;q</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Sertifikatingiz, hakaton diplomi yoki ilmiy maqolangiz bormi? Uni yuklang va ball to&apos;plang!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-tiu-100 text-tiu-800">
                    {ach.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    Sana: {new Date(ach.dateAchieved).toLocaleDateString("uz-UZ")}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{ach.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{ach.description}</p>

                {ach.adminFeedback && (
                  <div
                    className={`text-xs px-3 py-1.5 rounded-lg border inline-block font-medium ${
                      ach.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                        : "bg-red-50 text-red-800 border-red-100"
                    }`}
                  >
                    Bo&apos;lim izohi: {ach.adminFeedback}
                  </div>
                )}
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-3">
                <div>
                  {ach.status === "APPROVED" && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Tasdiqlandi (+{ach.points} ball)
                    </span>
                  )}
                  {ach.status === "PENDING" && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Tekshiruvda</span>
                    </span>
                  )}
                  {ach.status === "REJECTED" && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                      ✗ Rad etildi
                    </span>
                  )}
                </div>

                {ach.proofUrl && (
                  <a
                    href={ach.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-tiu-800 hover:underline"
                  >
                    <span>Dalil hujjati</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Yangi Yutuq Qo'shish Modali */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Yangi Yutuq Yuklash</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Yutuq yoki Sertifikat Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masalan: Respublika Dasturlash Olimpiadasi 1-o'rin"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Toifasi *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                  >
                    {ACHIEVEMENT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Erishilgan sana *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateAchieved}
                    onChange={(e) => setFormData({ ...formData, dateAchieved: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Batafsil Tavsifi *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Musobaqa qayerda o'tkazildi, nechanchi o'rin bo'ldi, loyiha nimadan iborat..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Dalil hujjati / Sertifikat havolasi (Google Drive, Cloud yoki fayl linki) *
                </label>
                <input
                  type="url"
                  required
                  value={formData.proofUrl}
                  onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
                  placeholder="https://drive.google.com/... yoki sertifikat linki"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  Bo&apos;lim xodimi tekshirishi uchun havola ochiq bo&apos;lishi kerak
                </span>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-grow py-3 px-4 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? "Yuklanmoqda..." : "Tekshiruvga yuborish"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
