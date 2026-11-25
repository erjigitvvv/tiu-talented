import { prisma } from "@/lib/prisma";
import { Newspaper, Calendar, Sparkles, Camera } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentNewsPage() {
  const news = await prisma.newsEvent.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        include: { profile: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <Newspaper className="w-6 h-6 text-tiu-700" />
          <span>Universitet Yangiliklari va E&apos;lonlari</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Iqtidorli talabalar bilan ishlash bo&apos;limi va universitet rahbariyati rasmiy xabarlari
        </p>
      </div>

      {news.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-xs text-slate-400">
          Hozircha yangiliklar kiritilmagan.
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="glass-neu-card rounded-2xl p-6 flex flex-col md:flex-row gap-5 items-start"
            >
              {item.imageUrl && (
                <div className="w-full md:w-48 h-36 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 shadow-xs border border-white/40">
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-2 flex-grow">
                <div className="flex items-center space-x-2">
                  <span className="neu-pill text-[10px] font-bold px-2 py-0.5 rounded text-tiu-800 inline-flex items-center space-x-1">
                    {item.type === "EVENT_HIGHLIGHT" ? (
                      <>
                        <Camera className="w-3 h-3 text-tiu-700" />
                        <span>Tadbirdan fotolavha</span>
                      </>
                    ) : (
                      <>
                        <Newspaper className="w-3 h-3 text-blue-700" />
                        <span>Yangilik</span>
                      </>
                    )}
                  </span>
                  <span className="text-xs text-slate-400">
                    {item.eventDate
                      ? new Date(item.eventDate).toLocaleDateString("uz-UZ")
                      : new Date(item.createdAt).toLocaleDateString("uz-UZ")}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>

                <div className="pt-2 text-[11px] text-slate-400 font-medium">
                  Manba: {item.author?.profile?.fullName || "Iqtidorlar bo'limi"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
