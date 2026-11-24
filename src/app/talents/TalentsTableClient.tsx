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
} from "lucide-react";

export interface TalentRow {
  id: string;
  rank: number;
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
  achievementsCount: number;
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
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<TalentRow | null>(null);

  const filteredTalents = talents.filter((t) => {
    const matchesSearch =
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (t.groupName && t.groupName.toLowerCase().includes(search.toLowerCase())) ||
      (t.skills && t.skills.toLowerCase().includes(search.toLowerCase())) ||
      (t.specialty && t.specialty.toLowerCase().includes(search.toLowerCase()));

    const matchesFaculty =
      !selectedFaculty ||
      (t.faculty && t.faculty.toLowerCase().includes(selectedFaculty.toLowerCase())) ||
      (t.dekanat && t.dekanat.toLowerCase().includes(selectedFaculty.toLowerCase()));

    return matchesSearch && matchesFaculty;
  });

  return (
    <div className="space-y-6">
      {/* Qidiruv va Filtr Formasi */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="F.I.SH, guruh, ko'nikma yoki yo'nalish bo'yicha qidiruv..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiu-800 focus:bg-white transition-all"
          />
        </div>

        <div className="w-full md:w-72 relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-tiu-800 focus:bg-white transition-all"
          >
            <option value="">Barcha fakultetlar / dekanatlar</option>
            {faculties.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* JADVAL: Raqam, O'rni, FISH, Guruh, Fakultet */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
                <th scope="col" className="py-4 px-4 text-center w-16">
                  #
                </th>
                <th scope="col" className="py-4 px-4 w-32">
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
                    Hech qanday talaba ma&apos;lumotlari topilmadi.
                  </td>
                </tr>
              ) : (
                filteredTalents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* 1. Raqam */}
                    <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                      {idx + 1}
                    </td>

                    {/* 2. O'rni */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                          student.rank === 1
                            ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-xs"
                            : student.rank === 2
                            ? "bg-slate-200 text-slate-900 border border-slate-300"
                            : student.rank === 3
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-blue-50 text-blue-800 border border-blue-200"
                        }`}
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{student.rank}-o&apos;rin</span>
                      </span>
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
                          <div
                            onClick={() => setSelectedStudent(student)}
                            className="font-extrabold text-slate-900 hover:text-tiu-800 transition-colors cursor-pointer"
                          >
                            {student.fullName}
                          </div>
                          <div className="text-[11px] font-semibold text-tiu-700">
                            {student.specialty || "Yo'nalish biriktirilmagan"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 4. Guruh */}
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 font-bold text-xs text-slate-700 border border-slate-200/80">
                        {student.groupName || "Noma'lum"}
                      </span>
                    </td>

                    {/* 5. Fakultet */}
                    <td className="py-4 px-6 text-slate-600 text-xs font-medium">
                      <div>{student.dekanat || student.faculty}</div>
                      <div className="text-[11px] text-slate-400">
                        {student.courseYear ? `${student.courseYear}-kurs` : ""} • GPA: {student.gpa.toFixed(2)}
                      </div>
                    </td>

                    {/* 6. Harakat */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-tiu-800 bg-white hover:bg-tiu-900 hover:text-white text-tiu-900 font-bold text-xs transition-all shadow-xs"
                      >
                        Portfolio
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Talaba To'liq Portfoliosi Modali */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-tiu-900 text-white flex items-center justify-center font-bold text-2xl overflow-hidden shadow-md">
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
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-black text-slate-900">
                      {selectedStudent.fullName}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-xs">
                      #{selectedStudent.rank}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-tiu-800 mt-0.5">
                    {selectedStudent.specialty || selectedStudent.faculty}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {selectedStudent.dekanat || selectedStudent.faculty} • {selectedStudent.groupName}
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

            {/* GPA va Ballar Ko'rsatkichi */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center space-x-3">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-amber-800">
                    Akademik GPA
                  </div>
                  <div className="text-base font-black text-amber-950">
                    {selectedStudent.gpa.toFixed(2)} / 5.0
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center space-x-3">
                <Trophy className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-blue-800">
                    Iqtidor Balli
                  </div>
                  <div className="text-base font-black text-blue-950">
                    {selectedStudent.totalPoints} ball
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {selectedStudent.bio && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Qisqacha Tarjimai Hol
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedStudent.bio}
                </p>
              </div>
            )}

            {/* Ko'nikmalar */}
            {selectedStudent.skills && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Ko&apos;nikmalar
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.skills.split(",").map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Aloqa va batafsil sahifa havolasi */}
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