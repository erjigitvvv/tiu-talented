import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { UserCheck, Search, Trophy, ExternalLink, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { FACULTIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface DepartmentTalentsPageProps {
  searchParams?: {
    q?: string;
    faculty?: string;
  };
}

export default async function DepartmentTalentsPage({ searchParams }: DepartmentTalentsPageProps) {
  const q = searchParams?.q?.toLowerCase() || "";
  const selectedFaculty = searchParams?.faculty || "";

  const students = await prisma.user.findMany({
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
      achievements: true,
      teamMembers: {
        include: { team: true },
      },
    },
    orderBy: {
      profile: {
        totalPoints: "desc",
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Sarlavha */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-tiu-700" />
            <span>Universitet Iqtidorli Talabalari Reyestri</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Barcha iqtidorli talabalar, ularning umumiy ballari, fakultetlari va a&apos;zo bo&apos;lgan jamoalari monitoringi
          </p>
        </div>
        <div className="neu-pill px-3.5 py-1.5 rounded-xl text-tiu-900 font-bold text-xs self-start md:self-auto">
          Jami: {students.length} nafar talaba
        </div>
      </div>

      {/* Qidiruv va Filter */}
      <form method="GET" className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Talaba ismi, ko'nikmasi yoki guruhi..."
            className="neu-sunken w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            name="faculty"
            defaultValue={selectedFaculty}
            className="neu-sunken w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tiu-600/30 font-semibold"
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
          className="neu-btn-primary px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm"
        >
          Saralash
        </button>
      </form>

      {/* Talabalar Jadvali */}
      <div className="glass-neu-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/70 border-b border-slate-200/60 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-4 px-6">Talaba</th>
                <th className="py-4 px-6">Fakultet / Guruh</th>
                <th className="py-4 px-6 text-center">GPA</th>
                <th className="py-4 px-6 text-center">Yutuqlar</th>
                <th className="py-4 px-6 text-right">Reyting Balli</th>
                <th className="py-4 px-6 text-center">Harakat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 font-medium">
              {students.map((st) => {
                const approvedCount = st.achievements.filter((a) => a.status === "APPROVED").length;
                const pendingCount = st.achievements.filter((a) => a.status === "PENDING").length;

                return (
                  <tr key={st.id} className="hover:bg-tiu-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-tiu-800 text-white flex items-center justify-center font-bold text-xs overflow-hidden flex-shrink-0 shadow-xs border border-white/40">
                          {st.profile?.avatarUrl ? (
                            <img src={st.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            st.profile?.fullName.charAt(0) || "T"
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{st.profile?.fullName}</div>
                          <div className="text-[11px] text-slate-400">ID: {st.studentId || "Mavjud emas"}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-600">
                      <div>{st.profile?.faculty}</div>
                      <div className="text-[11px] text-slate-400">{st.profile?.groupName} ({st.profile?.courseYear}-kurs)</div>
                    </td>

                    <td className="py-4 px-6 text-center font-bold text-slate-800">
                      {st.profile?.gpa.toFixed(2) || "4.50"}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center space-x-1 shadow-xs" title="Tasdiqlangan">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{approvedCount}</span>
                        </span>
                        {pendingCount > 0 && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold inline-flex items-center space-x-1 shadow-xs" title="Kutilmoqda">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>{pendingCount}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <span className="text-base font-extrabold text-tiu-800">
                        {st.profile?.totalPoints || 0}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">ball</span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <Link
                        href={`/talents/${st.id}`}
                        target="_blank"
                        className="neu-btn-white px-3 py-1.5 rounded-xl text-tiu-800 font-bold text-xs inline-flex items-center space-x-1"
                      >
                        <span>Portfolio</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
