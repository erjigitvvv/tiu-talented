import Link from "next/link";
import { ArrowRight, Sparkles, Users, Trophy } from "lucide-react";
import HomeIntroTabs from "./HomeIntroTabs";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-16">
      {/* 1. Universitet Binosi Rasmi (Background) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform transition-transform duration-1000"
        style={{ backgroundImage: `url('/images/tiu-campus.jpg')` }}
      />

      {/* 2. Minimalistik Toza va Qorong'i Filtrlangan Qatlam (Overlay) */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-tiu-950/70 backdrop-blur-[2px]" />

      {/* 3. Faqat Sarlavha va Tanishtirish (Title & Introduction — 3-4 sahifali) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-8">
        
        {/* Universitet kichik nishoni */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-100">
            Toshkent Xalqaro Universiteti • Iqtidorli Talabalar Portali
          </span>
        </div>

        {/* Asosiy Sarlavha */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] drop-shadow-md">
          Kelajak Liderlari va{" "}
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
            Iqtidorlar Ekotizimi
          </span>
        </h1>

        {/* 3-4 Sahifali Qisqacha Tanishtiruv Bo'limi (HomeIntroTabs) */}
        <HomeIntroTabs />
      </div>
    </div>
  );
}