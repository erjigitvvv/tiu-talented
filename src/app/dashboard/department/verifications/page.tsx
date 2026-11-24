"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, XCircle, ExternalLink, FileText, AlertCircle, Clock } from "lucide-react";

export default function DepartmentVerificationsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAch, setSelectedAch] = useState<any | null>(null);
  const [modalMode, setModalMode] = useState<"APPROVE" | "REJECT" | null>(null);

  // Modal input state
  const [points, setPoints] = useState("50");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const loadPending = () => {
    setLoading(true);
    fetch("/api/achievements")
      .then((res) => res.json())
      .then((data) => {
        // Fetch all achievements
        // In dev/api we can fetch pending ones
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // We can fetch from an endpoint or inline load
  useEffect(() => {
    fetch("/api/admin/verifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.achievements) setAchievements(data.achievements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openApproveModal = (ach: any) => {
    setSelectedAch(ach);
    setPoints("50");
    setFeedback("Yutuq haqiqiyligi tekshirildi va tasdiqlandi.");
    setModalMode("APPROVE");
  };

  const openRejectModal = (ach: any) => {
    setSelectedAch(ach);
    setFeedback("Hujjat formati to'g'ri kelmadi yoki muhr ko'rinmagan.");
    setModalMode("REJECT");
  };

  const handleDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAch) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/achievements/${selectedAch.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: modalMode === "APPROVE" ? "APPROVED" : "REJECTED",
          points: modalMode === "APPROVE" ? points : 0,
          adminFeedback: feedback,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg(
          modalMode === "APPROVE"
            ? `Yutuq tasdiqlandi (+${points} ball biriktirildi)!`
            : "Yutuq rad etildi."
        );
        // Ro'yxatdan olib tashlash
        setAchievements((prev) => prev.filter((item) => item.id !== selectedAch.id));
        setModalMode(null);
        setSelectedAch(null);
        setTimeout(() => setMsg(""), 4000);
      }
    } catch {
      alert("Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span>Yutuqlarni Verifikatsiya Qilish Navbati</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Talabalar yuklagan sertifikat va dalil hujjatlarini tekshirib, standart mezonlar asosida ball biriktiring yoki rad eting
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Navbat yuklanmoqda...</div>
      ) : achievements.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Hozircha tekshiruv navbati bo&apos;sh!</h3>
          <p className="text-xs text-slate-500">
            Talabalar tomonidan yangi yutuq yuklanganda ushbu navbatda darhol paydo bo&apos;ladi.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {ach.user?.profile?.fullName || "Talaba"}
                    </span>
                    <span className="text-xs text-tiu-700 font-medium">
                      • {ach.user?.profile?.faculty} ({ach.user?.profile?.groupName})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-tiu-100 text-tiu-800 text-[10px] font-bold">
                      {ach.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{ach.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl whitespace-pre-line">
                    {ach.description}
                  </p>

                  <div className="text-xs text-slate-400">
                    Yuklangan sana: {new Date(ach.createdAt).toLocaleDateString("uz-UZ")}
                  </div>
                </div>

                {/* Dalil havolasi */}
                <div className="flex-shrink-0">
                  {ach.proofUrl ? (
                    <a
                      href={ach.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors border border-slate-200"
                    >
                      <FileText className="w-4 h-4 text-tiu-700" />
                      <span>Hujjat/Sertifikatni ochish</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Havola ko&apos;rsatilmagan</span>
                  )}
                </div>
              </div>

              {/* Moderatsiya tugmalari */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openApproveModal(ach)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tasdiqlash va Ball berish</span>
                </button>
                <button
                  onClick={() => openRejectModal(ach)}
                  className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors flex items-center space-x-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Rad etish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Qaror Qabul Qilish Modali */}
      {modalMode && selectedAch && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {modalMode === "APPROVE" ? "✓ Yutuqni Tasdiqlash va Ball berish" : "✗ Yutuqni Rad Etish"}
              </h3>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-800">{selectedAch.title}</div>
              <div className="text-slate-500">Talaba: {selectedAch.user?.profile?.fullName}</div>
            </div>

            <form onSubmit={handleDecision} className="space-y-4">
              {modalMode === "APPROVE" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Biriktiriladigan Ball (Standart mezon: 10 - 100 ball) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      min={1}
                      max={200}
                      value={points}
                      onChange={(e) => setPoints(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-tiu-600"
                    />
                    <span className="text-xs font-bold text-slate-500">ball</span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {["30", "50", "70", "90"].map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => setPoints(pt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          points === pt
                            ? "bg-tiu-800 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        +{pt} ball
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {modalMode === "APPROVE" ? "Izoh / Fikr (ixtiyoriy)" : "Rad etish sababi *"}
                </label>
                <textarea
                  required={modalMode === "REJECT"}
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={modalMode === "APPROVE" ? "Ajoyib natija!..." : "Sertifikatda sana yoki muhr ko'rinmagan..."}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-grow py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm transition-colors shadow-sm disabled:opacity-50 ${
                    modalMode === "APPROVE"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {submitting ? "Saqlanmoqda..." : "Tasdiqlash"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
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
