import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FACULTIES } from "@/lib/constants";
import { Search, Trophy, Sparkles, Filter, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

interface TalentsPageProps {
  searchParams?: {
    q?: string;
    faculty?: string;
  };
}

export default async function TalentsPage({ searchParams }: TalentsPageProps) {
  const q = searchParams?.q?.toLowerCase() || "";
  const selectedFaculty = searchParams?.faculty || "";

  const talents = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      profile: {
        AND: [
          selectedFaculty ? { faculty: selectedFaculty } : {},
          q
            ? {
                OR: [
                  { fullName: { contains: q } },
                  { skills: { contains: q } },
                  { faculty: { contains: q } },
                ],
              }
            : {},
        ],
      },
    },
    include: {
      profile: true,
      achievements: {
        where: { status: "APPROVED" },
      },
    },
    orderBy: {
      profile: {
        totalPoints: "desc",
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Sarlavha */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-tiu-700 uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Iqtidorlar Reyestri</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            TIU Iqtidorli Talabalar Katalogi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Universitetning ilmiy, axborot texnologiyalari va jamoat ishlarida yutuqqa erishgan talabalari
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-tiu-50 border border-tiu-200 text-tiu-800 self-start md:self-auto">
          Jami iqtidorlar: {talents.length} nafar
        </div>
      </div>

      {/* Filtr va Qidiruv Formasi */}
      <form method="GET" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Talaba ismi yoki ko'nikmasi bo'yicha qidiruv (masalan: Python, Jasur)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600 focus:bg-white"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            name="faculty"
            defaultValue={selectedFaculty}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600 focus:bg-white"
          >
            <option value="">Barcha fakultetlar</option>
            {FACULTIES.map((fac) => (
              <option key={fac} value={fac}>
                {fac}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-6 py-2 rounded-xl bg-tiu-800 hover:bg-tiu-900 text-white font-bold text-sm transition-colors shadow-sm"
        >
          Filtrlash
        </button>
      </form>

      {/* Talantlar To'plami (Grid) */}
      {talents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Talaba topilmadi</h3>
          <p className="text-xs text-slate-500">
            Qidiruv so&apos;rovini yoki fakultet filtrini o&apos;zgartirib ko&apos;ring.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((student, index) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-tiu-800 to-tiu-600 text-white flex items-center justify-center font-bold text-xl overflow-hidden shadow-sm">
                    {student.profile?.avatarUrl ? (
                      <img
                        src={student.profile.avatarUrl}
                        alt={student.profile.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      student.profile?.fullName?.charAt(0) || "T"
                    )}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200">
                    🏆 {student.profile?.totalPoints || 0} ball
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-tiu-800 transition-colors">
                    {student.profile?.fullName || "Iqtidorli Talaba"}
                  </h3>
                  <p className="text-xs font-medium text-tiu-700 mt-0.5">
                    {student.profile?.faculty}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Guruh: {student.profile?.groupName} • {student.profile?.courseYear}-kurs • GPA: {student.profile?.gpa.toFixed(2) || "4.50"}
                  </p>
                </div>

                {student.profile?.bio && (
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {student.profile.bio}
                  </p>
                )}

                {student.profile?.skills && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {student.profile.skills
                      .split(",")
                      .slice(0, 3)
                      .map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {student.achievements.length} ta tasdiqlangan yutuq
                </span>
                <Link
                  href={`/talents/${student.id}`}
                  className="font-bold text-tiu-800 hover:text-tiu-950 flex items-center space-x-1 hover:underline"
                >
                  <span>Portfolioni ko&apos;rish</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
