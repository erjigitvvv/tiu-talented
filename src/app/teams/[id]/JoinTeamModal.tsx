"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, CheckCircle2, AlertCircle } from "lucide-react";

interface JoinTeamModalProps {
  teamId: string;
  isLoggedIn: boolean;
  isStudent: boolean;
  isAlreadyMember: boolean;
  isPending: boolean;
}

export default function JoinTeamModal({
  teamId,
  isLoggedIn,
  isStudent,
  isAlreadyMember,
  isPending,
}: JoinTeamModalProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState("DEVELOPER");
  const [joinNote, setJoinNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
        <div className="text-xs text-slate-600 font-medium">
          Jamoaga qo&apos;shilish uchun tizimga kiring:
        </div>
        <Link
          href="/login"
          className="inline-block px-5 py-2 rounded-xl bg-tiu-800 text-white font-bold text-xs hover:bg-tiu-900"
        >
          Kirish &rarr;
        </Link>
      </div>
    );
  }

  if (!isStudent) {
    return null;
  }

  if (isAlreadyMember) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center space-x-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span>Siz allaqachon ushbu jamoaning rasmiy a&apos;zosisiz!</span>
      </div>
    );
  }

  if (isPending || success) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 font-bold flex items-center space-x-2">
        <span>⏳ A&apos;zolik so&apos;rovingiz jamoa yetakchisi tomonidan ko&apos;rib chiqilmoqda!</span>
      </div>
    );
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/teams/${teamId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, joinNote }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "So'rov yuborishda xatolik yuz berdi");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setShowModal(false);
      router.refresh();
    } catch {
      setError("Aloqa xatosi yuz berdi");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2"
      >
        <UserPlus className="w-4 h-4" />
        <span>Jamoaga a&apos;zo bo&apos;lish</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Jamoaga Qo&apos;shilish So&apos;rovi</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Jamoada qaysi vazifani bajarmoqchisiz? *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                >
                  <option value="DEVELOPER">Dasturchi (Frontend / Backend / Mobile)</option>
                  <option value="DESIGNER">UI/UX Dizayner</option>
                  <option value="RESEARCHER">Tadqiqotchi / Ma&apos;lumotlar tahlilchisi</option>
                  <option value="MEMBER">Loyiha a&apos;zosi / Boshqaruvchi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  O&apos;z ko&apos;nikmangiz va nima qila olishingiz haqida izoh *
                </label>
                <textarea
                  required
                  rows={3}
                  value={joinNote}
                  onChange={(e) => setJoinNote(e.target.value)}
                  placeholder="Qaysi dasturlash tillarini bilasiz, oldin qanday loyihalarda ishlagansiz..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-grow py-3 px-4 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
                >
                  {loading ? "Yuborilmoqda..." : "So'rovni yuborish"}
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
