"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, FileText, AlertCircle } from "lucide-react";

interface ApplyClientSectionProps {
  opportunityId: string;
  isLoggedIn: boolean;
  isStudent: boolean;
  existingApplication: any | null;
}

export default function ApplyClientSection({
  opportunityId,
  isLoggedIn,
  isStudent,
  existingApplication,
}: ApplyClientSectionProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
        <h4 className="font-bold text-slate-800 text-sm">
          Tanlovga ariza topshirish uchun tizimga kiring
        </h4>
        <p className="text-xs text-slate-500">
          Arizangiz avtomatik ravishda tasdiqlangan yutuqlaringiz va portfoliosiz bilan birga ko&apos;rib chiqiladi.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-tiu-800 text-white font-bold text-xs hover:bg-tiu-900 transition-colors"
          >
            Kirish
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </div>
      </div>
    );
  }

  if (!isStudent) {
    return (
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 font-medium">
        ℹ️ Siz tizimda bo&apos;lim xodimi sifatida kirdingiz. Arizalar faqat talabalar tomonidan topshiriladi.
      </div>
    );
  }

  if (existingApplication || success) {
    const status = existingApplication?.status || "SUBMITTED";
    return (
      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Sizning arizangiz muvaffaqiyatli qabul qilingan!</span>
        </div>
        <p className="text-xs text-emerald-900 leading-relaxed">
          Arizangiz Iqtidorli talabalar bilan ishlash bo&apos;limi tomonidan ko&apos;rib chiqilmoqda. Holat:{" "}
          <strong className="uppercase">{status}</strong>
        </p>
        {existingApplication?.adminNotes && (
          <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
            Izoh: {existingApplication.adminNotes}
          </div>
        )}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter, portfolioUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ariza yuborishda xatolik yuz berdi");
        setLoading(false);
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setError("Server bilan aloqa uzildi. Qaytadan urinib ko'ring.");
      setLoading(false);
    }
  };

  return (
    <div>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-tiu-800 to-tiu-950 hover:from-tiu-700 hover:to-tiu-900 text-white font-bold text-sm shadow-md shadow-tiu-900/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <span>Ushbu tanlovga ariza topshirish</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <FileText className="w-4 h-4 text-tiu-700" />
            <span>Tanlov uchun Ariza Shakli</span>
          </h4>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Motivatsion xat (Nega aynan siz g&apos;olib bo&apos;lishingiz kerak?) *
            </label>
            <textarea
              required
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="O'z maqsadlaringiz, yutuqlaringiz va ushbu grant nima uchun muhim ekanligini yozing..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Qo&apos;shimcha loyiha / Portfolio / GitHub havolasi (ixtiyoriy)
            </label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://github.com/sizning-loyihangiz yoki portfolio link"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-grow py-3 px-4 rounded-xl bg-tiu-800 hover:bg-tiu-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Yuborilmoqda..." : "Arizani tasdiqlash va topshirish"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors"
            >
              Bekor qilish
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
