import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Calendar, Camera, Sparkles, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const posts = await prisma.newsEvent.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        include: { profile: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Sarlavha */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-tiu-700 uppercase tracking-wider mb-2">
          <Camera className="w-4 h-4" />
          <span>Fotolavhalar va E&apos;lonlar</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Universitet Hayotidan Lavhalar
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          TIU iqtidorli talabalari ishtirokidagi konferensiyalar, hakatonlar, taqdirlash marosimlari va muhim yangiliklar
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          Hozircha e&apos;lonlar yoki lavhalar mavjud emas.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-tiu-950 text-tiu-400">
                      <Sparkles className="w-10 h-10" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/80 backdrop-blur-sm text-white">
                    {post.type === "EVENT_HIGHLIGHT" ? "📸 Fotolavha" : "📰 Yangilik"}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-tiu-800 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-4">
                <span>
                  {post.eventDate
                    ? new Date(post.eventDate).toLocaleDateString("uz-UZ")
                    : new Date(post.createdAt).toLocaleDateString("uz-UZ")}
                </span>
                <span className="font-semibold text-tiu-700">
                  {post.author?.profile?.fullName || "Iqtidorlar bo'limi"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
