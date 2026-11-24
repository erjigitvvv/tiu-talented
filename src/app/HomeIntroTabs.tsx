"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  Trophy,
  Award,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export default function HomeIntroTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const introSlides = [
    {
      id: 0,
      title: "1. Platforma Missiyasi va Maqsadi",
      subtitle: "Iqtidorli Yoshlar Ekotizimi",
      description:
        "Toshkent Xalqaro Universiteti (TIU) iqtidorli talabalarini erta bosqichda aniqlash, ularning intellektual salohiyatini to'liq namoyon etishi uchun zarur shart-sharoit yaratish hamda rag'batlantirish tizimi.",
      points: [
        "Yagona rasmiy iqtidorlar reyestri",
        "Shaffof ball hisoblash va verifikatsiya",
        "Xalqaro miqyosga yo'naltirilgan mentorlik",
      ],
      actionText: "Iqtidorlilar Ro'yxati",
      actionHref: "/talents",
      icon: Sparkles,
    },
    {
      id: 1,
      title: "2. Loyiha va Startap Jamoalari",
      subtitle: "Birlashgan Kuch — Katta Natijalar",
      description:
        "Dasturchilar, muhandislar, dizaynerlar va yosh iqtisodchilarni yagona startap hamda hakaton jamoalariga jamlaymiz. O'z g'oyangiz bilan jamoa tuzing yoki mavjud jamoalarga qo'shiling.",
      points: [
        "Hakatonlar va startap musobaqalari",
        "Jamoa sardori va a'zolari rollari taqsimoti",
        "Universitet laboratoriyalari va texnik resurslari",
      ],
      actionText: "Jamoalar Katalogi",
      actionHref: "/teams",
      icon: Users,
    },
    {
      id: 2,
      title: "3. Raqamli Talaba Portfoliosi",
      subtitle: "Raqamli CV va Tasdiqlangan Yutuqlar",
      description:
        "Har bir talabaning ilmiy maqolalari, xalqaro sertifikatlari (IELTS, GCP, AWS) va sport-madaniy yutuqlari dekanat va bo'lim tomonidan QR-kodli verifikatsiya qilinadi.",
      points: [
        "1 klikda to'liq portfoliosi shakllantirish",
        "Ijtimoiy tarmoqlar (Telegram, Instagram) integratsiyasi",
        "Kafedralar va ish beruvchilar uchun ochiq profil",
      ],
      actionText: "Iqtidorlilar Portfoliosi",
      actionHref: "/talents",
      icon: Trophy,
    },
    {
      id: 3,
      title: "4. Rektorat Grantlari va Rag'bat",
      subtitle: "Talabalar Uchun Moliyaviy Ko'mak",
      description:
        "Universitet rektori granti, 'Yilning eng yaxshi dasturchisi' va ilmiy tadqiqotlar uchun ajratilgan 100% to'lov-kontrakt qoplami hamda xalqaro stajirovkalar.",
      points: [
        "100% kontraktni qoplash imkoniyati",
        "Oylik maxsus rag'batlantiruvchi stipendiyalar",
        "Yevropa universitetlarida akademik almashinuv",
      ],
      actionText: "Grantlar va Tanlovlar",
      actionHref: "/opportunities",
      icon: Award,
    },
  ];

  const current = introSlides[activeTab];
  const Icon = current.icon;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 3-4 ta sahifa (Tablar) tugmalari */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
        {introSlides.map((slide) => (
          <button
            key={slide.id}
            onClick={() => setActiveTab(slide.id)}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
              activeTab === slide.id
                ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            {slide.title.split(".")[0]}-bo&apos;lim
          </button>
        ))}
      </div>

      {/* Tanlangan bo'lim (Tanishtiruv kartochkasi) */}
      <div className="bg-slate-900/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl text-left space-y-5 animate-in fade-in duration-300">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
              {current.subtitle}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {current.title}
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {current.description}
        </p>

        {/* Asosiy afzalliklari */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {current.points.map((pt, i) => (
            <div
              key={i}
              className="flex items-center space-x-2 text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/5"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="font-medium line-clamp-1">{pt}</span>
            </div>
          ))}
        </div>

        {/* Harakat tugmasi */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {introSlides.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  activeTab === idx ? "w-6 bg-amber-400" : "w-2 bg-slate-600"
                }`}
              />
            ))}
          </div>

          <Link
            href={current.actionHref}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <span>{current.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}