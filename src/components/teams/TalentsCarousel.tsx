"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Trophy, Star, ArrowRight, ExternalLink } from "lucide-react";

export interface CarouselTalent {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
  faculty?: string | null;
  specialty?: string | null;
  groupName?: string | null;
  gpa: number;
  totalPoints: number;
  rank: number;
}

interface TalentsCarouselProps {
  talents: CarouselTalent[];
}

export default function TalentsCarousel({ talents }: TalentsCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);

  // Bir vaqtning o'zida ko'rsatiladigan kartochkalar soni: 3 ta
  const visibleCount = 3;
  const maxIndex = Math.max(0, talents.length - visibleCount);

  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  if (!talents || talents.length === 0) return null;

  const currentItems = talents.slice(startIndex, startIndex + visibleCount);
  // Agar oxiriga yetganda 3 tadan kam qolsa, boshidan qo'shib to'ldirish
  if (currentItems.length < visibleCount && talents.length >= visibleCount) {
    currentItems.push(...talents.slice(0, visibleCount - currentItems.length));
  }

  return (
    <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
      {/* Sarlavha va Carousel boshqaruv tugmalari */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Iqtidorlar Vitrinasi</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Iqtidorli Talabalarimiz (Top Reyting)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Universitetimizning eng faol, innovatsion va yuqori akademik natijaga erishgan talabalari
          </p>
        </div>

        {/* Carousel Prev / Next tugmalari */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-tiu-900 shadow-sm transition-all"
            title="Oldingisi"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-xl bg-tiu-900 border border-tiu-950 flex items-center justify-center text-white hover:bg-tiu-950 shadow-md transition-all"
            title="Keyingisi"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3 talik Carousel Kartochkalari */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
        {currentItems.map((talent, idx) => (
          <div
            key={`${talent.id}-${idx}`}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xl overflow-hidden border border-slate-200 group-hover:border-tiu-600 transition-colors">
                    {talent.avatarUrl ? (
                      <img src={talent.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      talent.fullName.charAt(0)
                    )}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shadow-md">
                    #{talent.rank}
                  </span>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>GPA {talent.gpa.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400 mt-1">
                    {talent.totalPoints} ball
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-tiu-800 transition-colors">
                  {talent.fullName}
                </h3>
                <p className="text-xs text-tiu-700 font-semibold mt-0.5">
                  {talent.specialty || talent.faculty || "Axborot Texnologiyalari"}
                </p>
                <div className="flex items-center space-x-2 mt-2 text-[11px] text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                    {talent.groupName || "Talaba"}
                  </span>
                  <span>•</span>
                  <span>{talent.faculty}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/talents/${talent.id}`}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-tiu-800 bg-slate-50 hover:bg-tiu-900 text-slate-700 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <span>Portfolioni ko&apos;rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>

      {/* Indikatorlar (Dots) */}
      <div className="flex justify-center items-center space-x-2 pt-2">
        {Array.from({ length: Math.ceil(talents.length / visibleCount) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setStartIndex(i * visibleCount)}
            className={`h-2 rounded-full transition-all ${
              Math.floor(startIndex / visibleCount) === i
                ? "w-8 bg-tiu-900"
                : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}