"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Trophy, Star, ArrowRight } from "lucide-react";

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
  title?: string;
  subtitle?: string;
}

export default function TalentsCarousel({
  talents,
  title = "Iqtidorli Talabalarimiz (Top Reyting)",
  subtitle = "Universitetimizning eng faol, innovatsion va yuqori akademik natijaga erishgan talabalari",
}: TalentsCarouselProps) {
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
    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] space-y-8">
      {/* Sarlavha va Carousel boshqaruv tugmalari */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-black text-amber-600 uppercase tracking-wider mb-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Iqtidorlar Vitrinasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Carousel Prev / Next tugmalari (Glassmorphic) */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-tiu-950 shadow-xs hover:scale-105 transition-all"
            title="Oldingisi"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-2xl bg-tiu-900 border border-tiu-950 flex items-center justify-center text-white hover:bg-tiu-950 shadow-md hover:scale-105 transition-all"
            title="Keyingisi"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3 talik Carousel Kartochkalari (Glassmorphism & Shadows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
        {currentItems.map((talent, idx) => {
          const isTop3 = talent.rank <= 3;
          return (
            <div
              key={`${talent.id}-${idx}`}
              className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-tiu-900 text-white flex items-center justify-center font-bold text-xl overflow-hidden border border-white shadow-sm group-hover:scale-105 transition-transform">
                      {talent.avatarUrl ? (
                        <img src={talent.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        talent.fullName.charAt(0)
                      )}
                    </div>
                    {/* Rank Badge */}
                    <span
                      className={`absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full font-black text-xs flex items-center justify-center shadow-md border border-white ${
                        talent.rank === 1
                          ? "bg-amber-400 text-slate-950"
                          : talent.rank === 2
                          ? "bg-slate-300 text-slate-900"
                          : talent.rank === 3
                          ? "bg-amber-600 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      #{talent.rank}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-black">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>GPA {talent.gpa.toFixed(2)}</span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-400 mt-1">
                      {talent.totalPoints} ball
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-base text-slate-900 group-hover:text-tiu-900 transition-colors">
                    {talent.fullName}
                  </h3>
                  <p className="text-xs text-tiu-800 font-bold mt-0.5 line-clamp-1">
                    {talent.specialty || talent.faculty || "Axborot Texnologiyalari"}
                  </p>
                  <div className="flex items-center space-x-2 mt-2 text-[11px] text-slate-500 font-medium">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-700">
                      {talent.groupName || "Talaba"}
                    </span>
                    <span>•</span>
                    <span className="truncate">{talent.faculty}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/talents/${talent.id}`}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-tiu-900 bg-slate-50 hover:bg-tiu-900 text-slate-700 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-2xs"
              >
                <span>Portfolioni ko&apos;rish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Indikatorlar (Dots) */}
      <div className="flex justify-center items-center space-x-2 pt-1">
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