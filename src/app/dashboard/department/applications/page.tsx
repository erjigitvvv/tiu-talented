"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, CheckCircle2, XCircle, Clock, ExternalLink, User, AlertCircle, Trophy } from "lucide-react";

export default function DepartmentApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<"ACCEPTED" | "UNDER_REVIEW" | "REJECTED">("ACCEPTED");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const loadData = () => {
    setLoading(true);
    fetch("/api/admin/applications")
      .then((res) => res.json())
      .then((data) => {
        if (data.applications) setApplications(data.applications);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (app: any, status: "ACCEPTED" | "UNDER_REVIEW" | "REJECTED") => {
    setSelectedApp(app);
    setNewStatus(status);
    setNotes(
      status === "ACCEPTED"
        ? "Yutuqlari va motivatsion xati yuqori baholandi. Grantga tavsiya etildi."
        : status === "UNDER_REVIEW"
        ? "Ariza ikkinchi bosqich (suhbat)ga o'tkazildi."
        : "Afsuski, bu gal kvota yetarli bo'lmadi."
    );
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/applications/${selectedApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: notes,
        }),
      });

      if (res.ok) {
        setMsg("Ariza holati muvaffaqiyatli yangilandi!");
        loadData();
        setSelectedApp(null);
        setTimeout(() => setMsg(""), 4000);
      }
    } catch {
      alert("Xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <FileText className="w-6 h-6 text-tiu-700" />
          <span>Tanlov va Grantlarga Kelgan Arizalar</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Talabalarning arizalarini, yutuqlarini va motivatsion xatlarini baholab, g&apos;oliblarni aniqlang
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Yuklanmoqda...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          Hozircha arizalar kelib tushmagan.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {app.user?.profile?.fullName}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({app.user?.profile?.faculty}, {app.user?.profile?.groupName})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200 inline-flex items-center space-x-1">
                      <Trophy className="w-3 h-3 text-amber-600" />
                      <span>{app.user?.profile?.totalPoints || 0} ball</span>
                    </span>
                  </div>

                  <div className="mt-1">
                    <span className="text-xs font-semibold text-tiu-800">
                      Tanlov: {app.opportunity?.title}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      (Topshirilgan: {new Date(app.appliedAt).toLocaleDateString("uz-UZ")})
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {app.status === "ACCEPTED" && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 inline-flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>G&apos;olib / Qabul qilingan</span>
                    </span>
                  )}
                  {app.status === "UNDER_REVIEW" && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 inline-flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ko&apos;rib chiqilmoqda</span>
                    </span>
                  )}
                  {app.status === "SUBMITTED" && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      • Yangi ariza
                    </span>
                  )}
                  {app.status === "REJECTED" && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 inline-flex items-center space-x-1">
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>Rad etilgan</span>
                    </span>
                  )}

                  <Link
                    href={`/talents/${app.user?.id}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center space-x-1"
                    title="Talabaning to'liq portfoliosini ochish"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Portfolio</span>
                  </Link>
                </div>
              </div>

              {/* Motivatsion xat */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-700">Talaba Motivatsion Xati:</div>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-line">
                  {app.coverLetter}
                </p>

                {app.portfolioUrl && (
                  <div className="text-xs">
                    <strong className="text-slate-600">Qo&apos;shimcha havola: </strong>
                    <a
                      href={app.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-tiu-800 hover:underline font-semibold"
                    >
                      {app.portfolioUrl} &rarr;
                    </a>
                  </div>
                )}

                {app.adminNotes && (
                  <div className="text-xs text-tiu-950 font-medium bg-tiu-50/60 p-2.5 rounded-lg border border-tiu-100">
                    Sizning izohingiz: {app.adminNotes}
                  </div>
                )}
              </div>

              {/* Status o'zgartirish tugmalari */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => openModal(app, "ACCEPTED")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors inline-flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>G&apos;olib / Qabul qilish</span>
                </button>
                <button
                  onClick={() => openModal(app, "UNDER_REVIEW")}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors inline-flex items-center space-x-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Suhbat / Ko&apos;rib chiqish</span>
                </button>
                <button
                  onClick={() => openModal(app, "REJECTED")}
                  className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors inline-flex items-center space-x-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Rad etish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Baholash Modali */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">
              Arizani Baholash: {selectedApp.user?.profile?.fullName}
            </h3>

            <div className="text-xs text-slate-500">
              Tanlangan holat: <strong className="text-slate-800">{newStatus}</strong>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Talabaga ko&apos;rinadigan xulosa / izoh *
                </label>
                <textarea
                  required
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-grow py-2.5 px-4 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saqlanmoqda..." : "Saqlash va talabaga yuborish"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100"
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
