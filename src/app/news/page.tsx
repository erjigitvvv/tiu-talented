import { prisma } from "@/lib/prisma";
import { Newspaper } from "lucide-react";
import NewsClient from "./NewsClient";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const newsList = await prisma.newsEvent.findMany({
    include: {
      author: {
        include: {
          profile: true,
        },
      },
      comments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Sarlavha */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-tiu-800 uppercase tracking-wider mb-2">
            <Newspaper className="w-4 h-4 text-tiu-700" />
            <span>Universitet Xabarlari va Voqealari</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Yangiliklar va E&apos;lonlar
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Toshkent Xalqaro Universiteti iqtidorli talabalarining yangiliklari, tanlovlar va ilmiy tadbirlaridan fotolavhalar
          </p>
        </div>
        <div className="text-xs font-bold px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 self-start md:self-auto">
          Jami xabarlar: <strong className="text-tiu-900">{newsList.length} ta</strong>
        </div>
      </div>

      {/* Interaktiv Yangiliklar Ro'yxati */}
      <NewsClient initialNewsList={newsList as any} />
    </div>
  );
}