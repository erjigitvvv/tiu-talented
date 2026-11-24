"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Star,
  ExternalLink,
  X,
  Phone,
  Mail,
  Award,
  Search,
  Filter,
  Send,
  Instagram,
  CheckCircle2,
  Calendar,
  Users,
  Target,
  Medal,
} from "lucide-react";

export interface StudentOpportunityItem {
  id: string;
  title: string;
  type: string;
  result?: string | null;
  year?: string | null;
}

export interface StudentAchievementItem {
  id: string;
  title: string;
  category: string;
  points: number;
  dateAchieved: string | Date;
  proofUrl?: string;
}

export interface TalentRow {
  id: string;
  rank: number;
  displayRank?: number;
  fullName: string;
  avatarUrl?: string | null;
  faculty?: string | null;
  dekanat?: string | null;
  specialty?: string | null;
  groupName?: string | null;
  courseYear?: number | null;
  gpa: number;
  totalPoints: number;
  bio?: string | null;
  skills?: string | null;
  phone?: string | null;
  email?: string | null;
  telegram?: string | null;
  instagram?: string | null;
  achievements: StudentAchievementItem[];
  portfolioOpportunities: StudentOpportunityItem[];
  teams: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}

interface TalentsTableClientProps {
  initialTalents: TalentRow[];
  faculties: string[];
}

export default function TalentsTableClient({
  initialTalents,
  faculties,
}: TalentsTableClientProps) {
  const [talents] = useState<TalentRow[]>(initialTalents);
  const [search, setSearch] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("ALL");
  const [selectedStudent, setSelectedStudent] = useState<TalentRow | null>(null);
  const [portfolioTab, setPortfolioTab] = useState<"achievements" | "teams" | "opportunities">("achievements");

  // Fakultetlar kesimida va umumiy kesimda filtrlash
  const filteredTalents = talents
    .filter((t) => {
      const matchesFaculty =
        selectedFaculty === "ALL" ||
        (t.dekanat && t.dekanat.toLowerCase().includes(selectedFaculty.toLowerCase())) ||
        (t.faculty && t.faculty.toLowerCase().includes(selectedFaculty.toLowerCase()));

      const matchesSearch =
        t.fullName.toLowerCase().includes(search.toLowerCase()) ||
        (t.groupName && t.groupName.toLowerCase().includes(search.toLowerCase())) ||
        (t.skills && t.skills.toLowerCase().includes(search.toLowerCase())) ||
        (t.specialty && t.specialty.toLowerCase().includes(search.toLowerCase()));

      return matchesFaculty && matchesSearch;
    })
    .map((t, idx) => ({
      ...t,
      displayRank: idx + 1,
    }));

  return (
    <div className="space-y-6">
      {/* 1. Umumiy va Fakultetlar Kesimi Boshqaruvi */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        {/* Kesimni tanlash: Umumiy reyting vs Fakultetlar kesimi */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Ko&apos;rinish kesimi:
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedFaculty("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFaculty === "ALL"
                  ? "bg-tiu-900 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Umumiy Reyting
            </button>
            {faculties.map((fac) => (
              <button
                key={fac}
                onClick={() => setSelectedFaculty(fac)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFaculty === fac
                    ? "bg-tiu-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {fac.replace(" Fakulteti", "").replace(" Dekanati", "")}
              </button>
            ))}
          </div>
        </div>

        {/* Qidiruv Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="F.I.SH, guruh, mutaxassislik yoki ko'nikma bo'yicha tezkor qidiruv..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiu-800 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 2. JADVAL: FAQAT 3 TA O'RIN AJRALIB TURADI, QOLGANLARI ODDIY */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
                <th scope="col" className="py-4 px-4 text-center w-16">
                  #
                </th>
                <th scope="col" className="py-4 px-4 w-36">
                  O&apos;rni
                </th>
                <th scope="col" className="py-4 px-6">
                  F.I.SH
                </th>
                <th scope="col" className="py-4 px-6 w-36">
                  Guruh
                </th>
                <th scope="col" className="py-4 px-6">
                  Fakultet / Dekanat
                </th>
                <th scope="col" className="py-4 px-6 text-right w-36">
                  Harakat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTalents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Ushbu kesimda talaba ma&apos;lumotlari topilmadi.
                  </td>
                </tr>
              ) : (
                filteredTalents.map((student, idx) => {
                  const rank = student.displayRank;
                  const isTop3 = rank <= 3;

                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`cursor-pointer transition-colors ${
                        rank === 1
                          ? "bg-amber-50/40 hover:bg-amber-50/70"
                          : rank === 2
                          ? "bg-slate-50/60 hover:bg-slate-100/70"
                          : rank === 3
                          ? "bg-amber-50/20 hover:bg-amber-50/40"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* 1. Tartib raqami */}
                      <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                        {idx + 1}
                      </td>

                      {/* 2. O'RNI: FAQAT 3 TA O'RIN AJRALIB TURADI */}
                      <td className="py-4 px-4">
                        {rank === 1 ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase bg-amber-400 text-slate-950 shadow-xs border border-amber-500">
                            <Medal className="w-3.5 h-3.5" />
                            <span>1-o&apos;rin</span>
                          </span>
                        ) : rank === 2 ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase bg-slate-300 text-slate-900 border border-slate-400">
                            <Medal className="w-3.5 h-3.5" />
                            <span>2-o&apos;rin</span>
                          </span>
                        ) : rank === 3 ? (
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                            <Medal className="w-3.5 h-3.5" />
                            <span>3-o&apos;rin</span>
                          </span>
                        ) : (
                          /* Qolganlari oddiy ko'rinishda */
                          <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            #{rank}
                          </span>
                        )}
                      </td>

                      {/* 3. F.I.SH */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-10 h-10 rounded-xl bg-tiu-900 text-white flex items-center justify-center font-bold text-xs overflow-hidden shadow-xs flex-shrink-0">
                            {student.avatarUrl ? (
                              <img
                                src={student.avatarUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              student.fullName.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 hover:text-tiu-800 transition-colors">
                              {student.fullName}
                            </div>
                            <div className="text-[11px] font-semibold text-tiu-700">
                              {student.specialty || "Dasturiy injiniring"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 4. Guruh */}
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-xs text-slate-700 border border-slate-200/80">
                          {student.groupName || "Biriktirilmagan"}
                        </span>
                      </td>

                      {/* 5. Fakultet */}
                      <td className="py-4 px-6 text-slate-600 text-xs font-medium">
                        <div>{student.dekanat || student.faculty}</div>
                        <div className="text-[11px] text-slate-400">
                          GPA: <strong>{student.gpa.toFixed(2)}</strong> • {student.totalPoints} ball
                        </div>
                      </td>

                      {/* 6. Harakat */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                          }}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-tiu-900 bg-white hover:bg-tiu-900 hover:text-white text-tiu-900 font-bold text-xs transition-all shadow-xs"
                        >
                          Portfolio
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. TO'LIQ TALABA PORTFOLIO MODALI (TABLAR BILAN) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header Profile */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-tiu-900 text-white flex items-center justify-center font-bold text-2xl overflow-hidden shadow-md flex-shrink-0">
                  {selectedStudent.avatarUrl ? (
                    <img
                      src={selectedStudent.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selectedStudent.fullName.charAt(0)
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-black text-slate-900">
                      {selectedStudent.fullName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs">
                      #{selectedStudent.displayRank || selectedStudent.rank}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-tiu-800">
                    {selectedStudent.specialty || selectedStudent.faculty}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedStudent.dekanat || selectedStudent.faculty} • Guruh: {selectedStudent.groupName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrikalar: GPA, Ballar, Aloqa */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                <div className="text-[10px] font-bold text-amber-800 uppercase">GPA Balli</div>
                <div className="text-base font-black text-amber-950">{selectedStudent.gpa.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-center">
                <div className="text-[10px] font-bold text-blue-800 uppercase">Iqtidor Balli</div>
                <div className="text-base font-black text-blue-950">{selectedStudent.totalPoints}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Yutuqlari</div>
                <div className="text-base font-black text-slate-900">{selectedStudent.achievements.length} ta</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <div className="text-[10px] font-bold text-emerald-800 uppercase">Jamoalari</div>
                <div className="text-base font-black text-emerald-950">{selectedStudent.teams.length} ta</div>
              </div>
            </div>

            {/* Ijtimoiy tarmoqlar va aloqa havolalari */}
            <div className="flex flex-wrap gap-2 text-xs">
              {selectedStudent.telegram && (
                <a
                  href={`https://t.me/${selectedStudent.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-semibold hover:bg-blue-100 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{selectedStudent.telegram}</span>
                </a>
              )}
              {selectedStudent.instagram && (
                <a
                  href={`https://instagram.com/${selectedStudent.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-pink-50 text-pink-800 border border-pink-200 font-semibold hover:bg-pink-100 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>{selectedStudent.instagram}</span>
                </a>
              )}
              {selectedStudent.phone && (
                <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedStudent.phone}</span>
                </span>
              )}
              {selectedStudent.email && (
                <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedStudent.email}</span>
                </span>
              )}
            </div>

            {/* Tarjimai hol va Qiziqishlar */}
            {selectedStudent.bio && (
              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                {selectedStudent.bio}
              </p>
            )}

            {selectedStudent.skills && (
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.skills.split(",").map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* PORTFOLIO TABLARI: 1. Yutuqlar, 2. Jamoalar, 3. Tanlovlar & Grantlar */}
            <div className="space-y-4 pt-2">
              <div className="flex border-b border-slate-200 gap-4">
                <button
                  onClick={() => setPortfolioTab("achievements")}
                  className={`pb-2.5 text-xs font-black transition-all border-b-2 inline-flex items-center space-x-1.5 ${
                    portfolioTab === "achievements"
                      ? "border-tiu-900 text-tiu-900"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Yutuqlar ({selectedStudent.achievements.length})</span>
                </button>
                <button
                  onClick={() => setPortfolioTab("teams")}
                  className={`pb-2.5 text-xs font-black transition-all border-b-2 inline-flex items-center space-x-1.5 ${
                    portfolioTab === "teams"
                      ? "border-tiu-900 text-tiu-900"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-tiu-700" />
                  <span>Loyiha Jamoalari ({selectedStudent.teams.length})</span>
                </button>
                <button
                  onClick={() => setPortfolioTab("opportunities")}
                  className={`pb-2.5 text-xs font-black transition-all border-b-2 inline-flex items-center space-x-1.5 ${
                    portfolioTab === "opportunities"
                      ? "border-tiu-900 text-tiu-900"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tanlov va Grantlar ({selectedStudent.portfolioOpportunities.length})</span>
                </button>
              </div>

              {/* Tab 1: Yutuqlar */}
              {portfolioTab === "achievements" && (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {selectedStudent.achievements.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-4">
                      Tasdiqlangan yutuqlar mavjud emas.
                    </div>
                  ) : (
                    selectedStudent.achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{ach.title}</div>
                          <div className="text-[10px] text-slate-400">
                            {ach.category} • {new Date(ach.dateAchieved).toLocaleDateString("uz-UZ")}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[11px]">
                          +{ach.points} ball
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: Jamoalar */}
              {portfolioTab === "teams" && (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {selectedStudent.teams.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-4">
                      Hozircha faol jamoalari yo&apos;q.
                    </div>
                  ) : (
                    selectedStudent.teams.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{t.name}</div>
                          <div className="text-[10px] text-tiu-700 font-semibold">{t.role}</div>
                        </div>
                        <Link
                          href={`/teams/${t.id}`}
                          className="text-xs font-bold text-tiu-800 hover:underline"
                        >
                          Jamoa &rarr;
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Tanlov va Grantlar */}
              {portfolioTab === "opportunities" && (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {selectedStudent.portfolioOpportunities.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-4">
                      Hozircha biriktirilgan grant va tanlovlar mavjud emas.
                    </div>
                  ) : (
                    selectedStudent.portfolioOpportunities.map((op) => (
                      <div
                        key={op.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{op.title}</div>
                          <div className="text-[10px] text-slate-400">
                            {op.type} • Yil: {op.year || "2026"}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-black text-[11px]">
                          {op.result || "Ishtirokchi"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Modal Pastki Qismi */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/talents/${selectedStudent.id}`}
                className="text-xs font-bold text-tiu-800 hover:underline flex items-center space-x-1"
              >
                <span>Alohida sahifada ochish</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-950 transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}