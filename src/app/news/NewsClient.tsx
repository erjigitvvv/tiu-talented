"use client";

import { useState } from "react";
import { Newspaper, Calendar, ArrowRight, X, Sparkles, Filter } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  type: string;
  imageUrl?: string | null;
  eventDate?: string | Date | null;
  createdAt: string | Date;
  author?: {
    profile?: {
      fullName: string;
    } | null;
  } | null;
}

interface NewsClientProps {
  newsList: NewsItem[];
}

const CATEGORIES = ["Hammasi", "Yangilik", "E'lon", "Tadbir"];

export default function NewsClient({ newsList }: NewsClientProps) {
  const [activeCategory, setActiveCategory] = useState("Hammasi");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "EVENT_HIGHLIGHT":
        return "Tadbirdan lavha";
      case "ANNOUNCEMENT":
        return "E'lon";
      case "NEWS":
      default:
        return "Yangilik";
    }
  };

  const filteredNews = newsList.filter((item) => {
    if (activeCategory === "Hammasi") return true;
    if (activeCategory === "Yangilik" && item.type === "NEWS") return true;
    if (activeCategory === "E'lon" && item.type === "ANNOUNCEMENT") return true;
    if (activeCategory === "Tadbir" && item.type === "EVENT_HIGHLIGHT") return true;
    return false;
  });

  return (
    <div className="space-y-8">
      {/* Kategoriya filtri */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat
                ? "bg-tiu-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Yangiliklar Kartochkalari */}
      {filteredNews.length === 0 ? (
        <div className="bg-white p-14 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          Ushbu ruknda hozircha yangiliklar mavjud emas.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((news) => {
            const formattedDate = new Date(news.eventDate || news.createdAt).toLocaleDateString(
              "uz-UZ",
              { year: "numeric", month: "long", day: "numeric" }
            );

            return (
              <div
                key={news.id}
                onClick={() => setSelectedNews(news)}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={
                        news.imageUrl ||
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80"
                      }
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-lg text-[11px] font-black uppercase bg-tiu-900 text-white shadow-xs">
                        {getTypeLabel(news.type)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formattedDate}</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 group-hover:text-tiu-800 transition-colors line-clamp-2 leading-snug">
                      {news.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {news.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-tiu-900 group-hover:bg-tiu-50/50 transition-colors">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {news.author?.profile?.fullName || "Iqtidorlilar bo'limi"}
                  </span>
                  <span className="flex items-center space-x-1 text-tiu-800 group-hover:translate-x-1 transition-transform">
                    <span>Batafsil o&apos;qish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Batafsil Yangilik Modal Oynasi */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-tiu-50 text-tiu-800 border border-tiu-200">
                  {getTypeLabel(selectedNews.type)}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {selectedNews.title}
                </h3>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium mt-1">
                  <span>
                    {new Date(selectedNews.eventDate || selectedNews.createdAt).toLocaleDateString(
                      "uz-UZ",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </span>
                  <span>•</span>
                  <span>{selectedNews.author?.profile?.fullName || "TIU Bo'limi"}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNews(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedNews.imageUrl && (
              <div className="h-64 w-full rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              <p className="font-semibold text-slate-900 text-base">
                {selectedNews.summary}
              </p>
              <p>{selectedNews.content}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-950 transition-colors"
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