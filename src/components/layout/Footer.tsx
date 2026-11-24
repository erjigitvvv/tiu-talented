import Link from "next/link";
import { Sparkles, Mail, Phone, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-tiu-950 text-slate-300 border-t border-tiu-900/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-tiu-700 to-tiu-900 flex items-center justify-center text-white border border-tiu-700/50 shadow-inner">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">TIU TALENTED</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Toshkent Xalqaro Universiteti (TIU) iqtidorli talabalarini aniqlash, qo&apos;llab-quvvatlash va ularning yutuqlarini keng jamoatchilikka namoyon etish milliy ekotizimi.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Platforma
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/talents" className="hover:text-white transition-colors">
                  Iqtidorlar Katalogi
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-white transition-colors">
                  Tanlovlar & Grantlar
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-white transition-colors">
                  Talabalar Reytingi
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Tadbirdan lavhalar
                </Link>
              </li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Mas&apos;ul Bo&apos;lim
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Iqtidorli talabalar bilan ishlash bo&apos;limi talabalar yutuqlarini rasmiy tasdiqlaydi va stipendiya/grant tanlovlarini o&apos;tkazadi.
            </p>
            <div className="text-xs text-amber-400 font-medium">
              TIU Bosh binosi, 3-qavat, 305-xona
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Aloqa
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-tiu-400" />
                <span>talented@tiu.uz</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-tiu-400" />
                <span>+998 (71) 200-00-01</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-tiu-400" />
                <span>Toshkent shahri, TIU kampusi</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-tiu-400" />
                <span>tiu.uz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-tiu-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TIU Talented. Barcha huquqlar himoyalangan.</p>
          <p className="mt-2 sm:mt-0">Toshkent Xalqaro Universiteti rasmiy portali</p>
        </div>
      </div>
    </footer>
  );
}
