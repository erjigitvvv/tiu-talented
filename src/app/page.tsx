import Link from "next/link";
import { ArrowRight, Sparkles, Users, Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
      {/* 1. Universitet Binosi Rasmi (Background) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform transition-transform duration-1000"
        style={{ backgroundImage: `url('/images/tiu-campus.jpg')` }}
      />

      {/* 2. Minimalistik Toza va Qorong'i Filtrlangan Qatlam (Overlay) */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-tiu-950/65 backdrop-blur-[2px]" />

      {/* 3. Faqat Sarlavha va Tanishtirish (Title & Introduction) */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white space-y-8">
        
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

        {/* Tanishtirish Matni */}
        <p className="text-base sm:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto font-normal drop-shadow-sm">
          Toshkent Xalqaro Universiteti (TIU) iqtidorli talabalarini kashf etish, ilmiy va innovatsion 
          loyihalar jamoalariga birlashtirish hamda ularning yutuqlarini xalqaro miqyosga olib chiqish 
          uchun maxsus yaratilgan raqamli platforma.
        </p>

        {/* Tezkor Tugmalar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/teams"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2.5"
          >
            <Users className="w-4 h-4" />
            <span>Jamoalar Katalogi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/talents"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md shadow-lg hover:scale-105 transition-all flex items-center justify-center space-x-2.5"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Iqtidorli Talabalar</span>
          </Link>
        </div>

        {/* Minimalistik Qo'shimcha Izoh */}
        <div className="pt-8 text-xs text-slate-300/80 font-medium">
          Dasturchilar, muhandislar, yosh iqtisodchilar va tadqiqotchilar hamkorlik maydoni
        </div>
      </div>
    </div>
  );
}