"use client";

import { useState } from "react";
import {
  Newspaper,
  Calendar,
  ArrowRight,
  X,
  Sparkles,
  Filter,
  Heart,
  MessageSquare,
  Send,
  Share2,
} from "lucide-react";

interface CommentItem {
  id: string;
  authorName: string;
  authorAvatar?: string | null;
  content: string;
  createdAt: string | Date;
}

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
  likesCount: number;
  comments: CommentItem[];
  author?: {
    profile?: {
      fullName: string;
    } | null;
  } | null;
}

interface NewsClientProps {
  initialNewsList: NewsItem[];
}

const CATEGORIES = ["Hammasi", "Yangilik", "E'lon", "Tadbir"];

export default function NewsClient({ initialNewsList }: NewsClientProps) {
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNewsList);
  const [activeCategory, setActiveCategory] = useState("Hammasi");
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Likes and comments state
  const [likedMap, setLikedMap] = useState<{ [id: string]: boolean }>({});
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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

  const handleLike = async (newsId: string) => {
    if (likedMap[newsId]) return;
    setLikedMap((prev) => ({ ...prev, [newsId]: true }));
    setNewsList((prev) =>
      prev.map((n) => (n.id === newsId ? { ...n, likesCount: n.likesCount + 1 } : n))
    );
    if (selectedNews?.id === newsId) {
      setSelectedNews((prev) => (prev ? { ...prev, likesCount: prev.likesCount + 1 } : null));
    }

    try {
      await fetch(`/api/news/${newsId}/like`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (newsId: string) => {
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);

    try {
      const res = await fetch(`/api/news/${newsId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });
      const data = await res.json();
      if (data.comment) {
        setNewsList((prev) =>
          prev.map((n) =>
            n.id === newsId ? { ...n, comments: [data.comment, ...n.comments] } : n
          )
        );
        if (selectedNews?.id === newsId) {
          setSelectedNews((prev) =>
            prev ? { ...prev, comments: [data.comment, ...prev.comments] } : null
          );
        }
        setCommentText("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingComment(false);
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
      <div className="flex flex-wrap gap-2.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat
                ? "neu-btn-primary"
                : "neu-btn-white text-slate-600 hover:text-tiu-950"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Yangiliklar Kartochkalari */}
      {filteredNews.length === 0 ? (
        <div className="glass-panel p-14 rounded-3xl text-center text-xs text-slate-500">
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
                className="group glass-neu-card rounded-3xl overflow-hidden flex flex-col justify-between cursor-pointer"
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
                  <div className="flex items-center space-x-3 text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-3.5 h-3.5 text-red-500" />
                      <span>{news.likesCount}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{news.comments?.length || 0}</span>
                    </span>
                  </div>

                  <span className="flex items-center space-x-1 text-tiu-800 group-hover:translate-x-1 transition-transform">
                    <span>O&apos;qish &rarr;</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Batafsil Yangilik Modal Oynasi: Rasm, Sarlavha, Sana, Matn, Like va Comment */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-white/80 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-tiu-50 text-tiu-800 border border-tiu-200">
                  {getTypeLabel(selectedNews.type)}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-snug">
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
                  <span>{selectedNews.author?.profile?.fullName || "Iqtidorlilar bo'limi"}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNews(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rasm */}
            {selectedNews.imageUrl && (
              <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Matn */}
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              <p className="font-semibold text-slate-900 text-base">
                {selectedNews.summary}
              </p>
              <p>{selectedNews.content}</p>
            </div>

            {/* Interaktiv Like va Comment Bo'limi */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleLike(selectedNews.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all text-xs font-bold ${
                    likedMap[selectedNews.id]
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-slate-50 text-slate-700 hover:text-red-500 border-slate-200"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedMap[selectedNews.id] ? "fill-red-600 text-red-600" : ""
                    }`}
                  />
                  <span>Yoqdi ({selectedNews.likesCount})</span>
                </button>

                <div className="text-xs text-slate-400 font-semibold">
                  {selectedNews.comments?.length || 0} ta izoh
                </div>
              </div>

              {/* Yangi izoh qoldirish */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddComment(selectedNews.id);
                  }}
                  placeholder="Yangilik bo'yicha fikr qoldiring..."
                  className="flex-grow p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-tiu-800"
                />
                <button
                  onClick={() => handleAddComment(selectedNews.id)}
                  disabled={isSubmittingComment}
                  className="p-2.5 bg-tiu-900 text-white rounded-xl hover:bg-tiu-950 shadow-xs"
                  title="Yuborish"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Izohlar ro'yxati */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {(!selectedNews.comments || selectedNews.comments.length === 0) ? (
                  <p className="text-[11px] text-slate-400 italic">
                    Hozircha izohlar yo&apos;q.
                  </p>
                ) : (
                  selectedNews.comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{c.authorName}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleDateString("uz-UZ")}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{c.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
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