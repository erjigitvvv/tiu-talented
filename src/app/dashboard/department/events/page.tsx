"use client";

import { useState, useEffect } from "react";
import { Camera, PlusCircle, AlertCircle, CheckCircle2, Newspaper, X } from "lucide-react";

export default function DepartmentEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    type: "EVENT_HIGHLIGHT",
    imageUrl: "",
    eventDate: new Date().toISOString().split("T")[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const loadData = () => {
    setLoading(true);
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setEvents(data.posts);
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
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Xatolik yuz berdi");
        setSubmitting(false);
        return;
      }

      setMsg("Tadbirdan lavha / yangilik muvaffaqiyatli chop etildi!");
      setShowModal(false);
      setFormData({
        title: "",
        summary: "",
        content: "",
        type: "EVENT_HIGHLIGHT",
        imageUrl: "",
        eventDate: new Date().toISOString().split("T")[0],
      });
      loadData();
      setTimeout(() => setMsg(""), 4000);
    } catch {
      setError("Aloqa xatosi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Camera className="w-6 h-6 text-tiu-700" />
            <span>Tadbirdan Lavhalar va Yangiliklar Boshqaruvi</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Universitet bosh sahifasida chiqadigan tadbirlar fotolavhalari va muhim xabarlarni joylashtiring
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center space-x-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi Lavha Joylash</span>
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Yuklanmoqda...</div>
      ) : events.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          Hozircha hech qanday lavha yoki yangilik kiritilmagan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4 items-start"
            >
              {ev.imageUrl && (
                <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                  <img src={ev.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-tiu-50 text-tiu-800 inline-flex items-center space-x-1">
                  {ev.type === "EVENT_HIGHLIGHT" ? (
                    <>
                      <Camera className="w-3 h-3 text-tiu-700" />
                      <span>Tadbir lavhasi</span>
                    </>
                  ) : (
                    <>
                      <Newspaper className="w-3 h-3 text-blue-700" />
                      <span>Yangilik</span>
                    </>
                  )}
                </span>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{ev.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{ev.content}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Sana: {new Date(ev.eventDate || ev.createdAt).toLocaleDateString("uz-UZ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Yangi Lavha / Yangilik Qo&apos;shish</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg">
                <X className="w-5 h-5" />
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
                  Sarlavha *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="TIU TechFest 2026 g'oliblari taqdirlandi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Toifasi
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                  >
                    <option value="EVENT_HIGHLIGHT">Tadbirdan fotolavha</option>
                    <option value="NEWS">Rasmiy yangilik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Tadbir sanasi
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Rasm havolasi (URL)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... yoki rasm linki"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Qisqacha ta&apos;rif (Summary)
                </label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Universitetda 50 dan ortiq yosh innovatorlar ishtirok etdi..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Batafsil Matn *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tadbir tafsilotlari, taqdirlangan talabalar..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-tiu-600"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-grow py-2.5 px-4 rounded-xl bg-tiu-800 hover:bg-tiu-950 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? "Chop etilmoqda..." : "Chop etish"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
