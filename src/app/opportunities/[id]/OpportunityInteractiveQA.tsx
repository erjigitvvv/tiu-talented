"use client";

import { useState } from "react";
import { MessageSquare, Heart, Send, Sparkles, CheckCircle2 } from "lucide-react";

interface CommentItem {
  id: string;
  authorName: string;
  authorAvatar?: string | null;
  content: string;
  createdAt: string | Date;
}

interface OpportunityInteractiveQAProps {
  opportunityId: string;
  initialComments: CommentItem[];
  initialLikes: number;
}

export default function OpportunityInteractiveQA({
  opportunityId,
  initialComments,
  initialLikes,
}: OpportunityInteractiveQAProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikes((prev) => prev + 1);

    try {
      await fetch(`/api/opportunities/${opportunityId}/like`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await res.json();
      if (data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setNewComment("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Sarlavha va Like tugmasi */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2.5">
          <MessageSquare className="w-5 h-5 text-tiu-800" />
          <h3 className="text-lg font-black text-slate-900">
            Savollar va Izohlar ({comments.length})
          </h3>
        </div>

        {/* Like tugmasi */}
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
            hasLiked
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-slate-50 text-slate-600 hover:text-red-500 border-slate-200"
          }`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? "fill-red-600 text-red-600" : ""}`} />
          <span>{likes}</span>
        </button>
      </div>

      {/* Savol/Izoh yozish formasi */}
      <form onSubmit={handleAddComment} className="space-y-3">
        <label className="text-xs font-bold text-slate-700 block">
          Tanlov shartlari yoki grant bo&apos;yicha savol bering:
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Savolingizni yoki fikringizni yozing..."
            className="flex-grow p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-tiu-800 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-3 rounded-xl bg-tiu-900 text-white font-bold text-xs hover:bg-tiu-950 transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Yuborish</span>
          </button>
        </div>
      </form>

      {/* Izohlar Ro'yxati */}
      <div className="space-y-3 pt-2">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-4">
            Hozircha savollar mavjud emas. Birinchi bo&apos;lib savol qoldiring!
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900">{c.authorName}</span>
                <span className="text-[11px] text-slate-400">
                  {new Date(c.createdAt).toLocaleDateString("uz-UZ")}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}