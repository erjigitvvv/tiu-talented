"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Award, PlusCircle, Users, Calendar, AlertCircle, CheckCircle2, Gift, X } from "lucide-react";
import { OPPORTUNITY_TYPES } from "@/lib/constants";

export default function DepartmentOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    type: OPPORTUNITY_TYPES[0].value,
    description: "",
    requirements: "",
    deadline: "",
    quota: "3",
    award: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = () => {
    setLoading(true);
    fetch("/api/admin/opportunities")
      .then((res) => res.json())
      .then((data) => {
        if (data.opportunities) setOpportunities(data.opportunities);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Tanlov yaratishda xatolik yuz berdi");
        setSubmitting(false);
        return;
      }

      setSuccessMsg("Yangi tanlov/grant muvaffaqiyatli e'lon qilindi!");
      setShowModal(false);
      setFormData({
        title: "",
        type: OPPORTUNITY_TYPES[0].value,
        description: "",
        requirements: "",
        deadline: "",
        quota: "3",
        award: "",
      });
      loadData();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch {
      setError("Aloqa xatosi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Tanlovlar va Grantlar Boshqaruvi</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Universitet ichki va xalqaro stipendiyalari, rektor grantlari va hakatonlarni e&apos;lon qiling
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="neu-btn-primary px-5 py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi Tanlov E&apos;lon Qilish</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl text-xs sm:text-sm text-emerald-800 font-semibold flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Yuklanmoqda...</div>
      ) : opportunities.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-xs text-slate-500">
          Hozircha hech qanday tanlov e&apos;lon qilinmagan.
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="glass-neu-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="neu-pill px-2.5 py-0.5 rounded-md text-[11px] font-extrabold text-amber-800 uppercase">
                    {opp.type}
                  </span>
                  <span className="text-xs text-slate-400">
                    Muddati: {new Date(opp.deadline).toLocaleDateString("uz-UZ")}
                  </span>
                  <span className="text-xs text-slate-400">• Kvota: {opp.quota} ta</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{opp.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl line-clamp-2">
                  {opp.description}
                </p>

                {opp.award && (
                  <div className="text-xs font-semibold text-emerald-700 flex items-center space-x-1">
                    <Gift className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mukofot: {opp.award}</span>
                  </div>
                )}
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-3 flex-shrink-0">
                <div className="text-xs text-slate-500 font-medium">
                  Kelgan arizalar: <strong className="text-slate-900">{opp.applications?.length || 0} ta</strong>
                </div>
                <Link
                  href="/dashboard/department/applications"
                  className="neu-btn-white px-4 py-2 rounded-xl text-tiu-800 font-bold text-xs"
                >
                  Arizalarni ko&apos;rish &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Yangi Tanlov E'lon Qilish Modali */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Yangi Tanlov / Grant E&apos;lon Qilish</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center space-x-2 shadow-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tanlov Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masalan: TIU Rektor Granti 2026"
                  className="neu-sunken w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Toifasi *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="neu-sunken w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30 font-semibold"
                  >
                    {OPPORTUNITY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Kvota (O&apos;rinlar soni) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.quota}
                    onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                    className="neu-sunken w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Qabul tugash muddati (Deadline) *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="neu-sunken w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mukofot jamg&apos;armasi
                  </label>
                  <input
                    type="text"
                    value={formData.award}
                    onChange={(e) => setFormData({ ...formData, award: e.target.value })}
                    placeholder="Masalan: 100% Kontrakt qoplash yoki 10,000,000 UZS"
                    className="neu-sunken w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30"
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
                  placeholder="Tanlov maqsadi va ishtirok tartibi..."
                  className="neu-sunken w-full p-3.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Talablar va Mezonlar (ixtiyoriy)
                </label>
                <textarea
                  rows={2}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="GPA kamida 4.5, IELTS 7.0+, ilmiy maqola..."
                  className="neu-sunken w-full p-3.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="neu-btn-primary flex-grow py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm disabled:opacity-50"
                >
                  {submitting ? "Saqlanmoqda..." : "E'lon qilish"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="neu-btn-white py-3 px-4 rounded-xl text-slate-600 font-semibold text-xs"
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
