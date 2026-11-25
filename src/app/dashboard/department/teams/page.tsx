"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, PlusCircle, CheckCircle2, XCircle, UserPlus, ExternalLink, AlertCircle, ShieldCheck, Crown, X } from "lucide-react";
import { FACULTIES } from "@/lib/constants";

export default function DepartmentTeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Yangi jamoa yaratish formasi
  const [formData, setFormData] = useState({
    name: "",
    category: "Hakaton jamoasi",
    faculty: FACULTIES[0],
    description: "",
    neededRoles: "",
    avatarUrl: "",
    projectUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const loadTeams = () => {
    setLoading(true);
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => {
        if (data.teams) setTeams(data.teams);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleMemberStatus = async (teamId: string, memberId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, status }),
      });

      if (res.ok) {
        setMsg(status === "ACCEPTED" ? "A'zo jamoaga qabul qilindi!" : "A'zolik rad etildi.");
        loadTeams();
        setTimeout(() => setMsg(""), 4000);
      }
    } catch {
      alert("Xatolik");
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Jamoa yaratishda xatolik yuz berdi");
        setSubmitting(false);
        return;
      }

      setMsg("Yangi iqtidorlar jamoasi muvaffaqiyatli ro'yxatga olindi!");
      setShowModal(false);
      setFormData({
        name: "",
        category: "Hakaton jamoasi",
        faculty: FACULTIES[0],
        description: "",
        neededRoles: "",
        avatarUrl: "",
        projectUrl: "",
      });
      loadTeams();
      setTimeout(() => setMsg(""), 4000);
    } catch {
      setError("Aloqa xatosi yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-tiu-700" />
            <span>Jamoalar Katalogi va A&apos;zolar Boshqaruvi</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Universitet talabalar jamoalari, tarkibidagi talabalar va jamoalarga a&apos;zo bo&apos;lish so&apos;rovlari
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="neu-btn-primary px-5 py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi Jamoa Ro&apos;yxatdan O&apos;tkazish</span>
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl text-xs sm:text-sm text-emerald-800 font-semibold flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Jamoalar yuklanmoqda...</div>
      ) : teams.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-xs text-slate-500">
          Hozircha ro&apos;yxatdan o&apos;tgan jamoalar mavjud emas.
        </div>
      ) : (
        <div className="space-y-6">
          {teams.map((team) => {
            const acceptedMembers = team.members.filter((m: any) => m.status === "ACCEPTED");
            const pendingMembers = team.members.filter((m: any) => m.status === "PENDING");

            return (
              <div
                key={team.id}
                className="glass-neu-card rounded-3xl p-6 sm:p-8 space-y-6"
              >
                {/* Jamoa Asosiy Qismi */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200/60 pb-5">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-tiu-950 to-tiu-700 text-white flex items-center justify-center font-bold text-xl overflow-hidden shadow-md flex-shrink-0 border border-white/20">
                      {team.avatarUrl ? (
                        <img src={team.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        team.name.charAt(0)
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="neu-pill px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase text-blue-900">
                          {team.category}
                        </span>
                        <span className="text-xs text-slate-400">
                          Fakultet: {team.faculty || "Universitetlararo"}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-lg">{team.name}</h3>
                      <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{team.description}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Link
                      href={`/teams/${team.id}`}
                      target="_blank"
                      className="neu-btn-white px-4 py-2 rounded-xl text-slate-800 font-bold text-xs inline-flex items-center space-x-1.5"
                    >
                      <span>Ommaviy sahifa</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                  </div>
                </div>

                {/* Qidirilayotgan mutaxassislar */}
                {team.neededRoles && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-950 flex items-center space-x-2 shadow-xs">
                    <UserPlus className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <div>
                      <strong>Jamoaga kerakli kadrlar:</strong> {team.neededRoles}
                    </div>
                  </div>
                )}

                {/* Kutilayotgan A'zolik So'rovlari (Pending Join Requests) */}
                {pendingMembers.length > 0 && (
                  <div className="p-4 bg-blue-50/50 border border-blue-200/60 rounded-2xl space-y-3 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center space-x-1.5">
                      <span>Yangi A&apos;zolik So&apos;rovlari ({pendingMembers.length} ta kutilmoqda):</span>
                    </h4>
                    <div className="space-y-2">
                      {pendingMembers.map((req: any) => (
                        <div
                          key={req.id}
                          className="p-3.5 bg-white/90 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-900">
                              {req.user?.profile?.fullName} ({req.user?.profile?.faculty})
                            </div>
                            <div className="text-slate-500 mt-0.5">
                              Taklif qilgan roli: <strong className="text-tiu-800">{req.role}</strong> • 
                              Izoh: &quot;{req.joinNote || "Jamoaga qo'shilmoqchiman"}&quot;
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <button
                              onClick={() => handleMemberStatus(team.id, req.id, "ACCEPTED")}
                              className="neu-btn-primary px-3 py-1.5 rounded-lg text-white font-bold text-xs inline-flex items-center space-x-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Qabul qilish</span>
                            </button>
                            <button
                              onClick={() => handleMemberStatus(team.id, req.id, "REJECTED")}
                              className="neu-btn-white px-3 py-1.5 rounded-lg text-red-600 font-bold text-xs inline-flex items-center space-x-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Rad etish</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Jamoa Ichidagi Tasdiqlangan Talabalar */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Jamoa Tarkibi va Talabalar ({acceptedMembers.length} nafar):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {acceptedMembers.map((member: any) => (
                      <div
                        key={member.id}
                        className="neu-sunken p-3 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-tiu-800 text-white flex items-center justify-center font-bold text-xs overflow-hidden shadow-xs">
                            {member.user?.profile?.avatarUrl ? (
                              <img src={member.user?.profile?.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              member.user?.profile?.fullName.charAt(0) || "T"
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">
                              {member.user?.profile?.fullName}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {member.role === "LEADER" ? (
                                <span className="inline-flex items-center space-x-1 text-amber-700 font-bold">
                                  <Crown className="w-3 h-3 text-amber-500" />
                                  <span>Jamoa Yetakchisi</span>
                                </span>
                              ) : (
                                member.role
                              )}
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/talents/${member.user?.id}`}
                          target="_blank"
                          className="text-tiu-800 font-bold text-[11px] hover:underline"
                        >
                          CV &rarr;
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Yangi Jamoa Yaratish Modali */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Yangi Iqtidorlar Jamoasini Yaratish</h3>
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

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Jamoa Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masalan: RoboTech TIU"
                  className="neu-sunken w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30"
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
                    className="neu-sunken w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30 font-semibold"
                  >
                    <option value="Hakaton jamoasi">Hakaton jamoasi</option>
                    <option value="Startap">Startap</option>
                    <option value="Ilmiy tadqiqot">Ilmiy tadqiqot</option>
                    <option value="Robototexnika">Robototexnika</option>
                    <option value="Debat klubi">Debat klubi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Fakultet
                  </label>
                  <select
                    value={formData.faculty}
                    onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                    className="neu-sunken w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30 font-semibold"
                  >
                    {FACULTIES.map((fac) => (
                      <option key={fac} value={fac}>
                        {fac}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Jamoa Tavsifi va Maqsadi *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jamoa nima ustida ishlaydi, qanday musobaqalarda qatnashadi..."
                  className="neu-sunken w-full p-3.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Qidirilayotgan rollar / vakansiyalar (masalan: Frontend, UI Designer)
                </label>
                <input
                  type="text"
                  value={formData.neededRoles}
                  onChange={(e) => setFormData({ ...formData, neededRoles: e.target.value })}
                  placeholder="Frontend Developer, Data Analyst..."
                  className="neu-sunken w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Jamoa Rasm / Logo URL
                </label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... yoki rasm linki"
                  className="neu-sunken w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="neu-btn-primary flex-grow py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm disabled:opacity-50"
                >
                  {submitting ? "Yaratilmoqda..." : "Jamoani Saqlash"}
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
