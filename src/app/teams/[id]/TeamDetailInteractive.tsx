"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Trophy,
  Heart,
  MessageSquare,
  Eye,
  Send,
  X,
  Star,
  Sparkles,
  Award,
  GraduationCap,
  Mail,
  Phone,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FileText,
  UserCheck,
  Instagram,
} from "lucide-react";
import JoinTeamModal from "./JoinTeamModal";

interface AchievementComment {
  id: string;
  authorName: string;
  authorAvatar?: string | null;
  content: string;
  createdAt: string | Date;
}

interface TeamAchievementItem {
  id: string;
  title: string;
  rank: string;
  dateAchieved: string | Date;
  imageUrl?: string | null;
  description?: string | null;
  viewsCount: number;
  likesCount: number;
  comments: AchievementComment[];
}

interface TeamFeedbackItem {
  id: string;
  authorName: string;
  authorRole?: string | null;
  authorAvatar?: string | null;
  content: string;
  rating: number;
  createdAt: string | Date;
}

interface UserProfileData {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
  dekanat?: string | null;
  faculty?: string | null;
  specialty?: string | null;
  groupName?: string | null;
  courseYear?: number | null;
  gpa?: number | null;
  phone?: string | null;
  email?: string | null;
  telegram?: string | null;
  instagram?: string | null;
  bio?: string | null;
  skills?: string | null;
  totalPoints?: number | null;
  achievements?: Array<{
    id: string;
    title: string;
    category: string;
    points: number;
    dateAchieved: string | Date;
  }>;
}

interface TeamDetailInteractiveProps {
  team: {
    id: string;
    name: string;
    description: string;
    category: string;
    faculty?: string | null;
    avatarUrl?: string | null;
    neededRoles?: string | null;
    leader: {
      id: string;
      email?: string | null;
      profile?: UserProfileData | null;
    };
    members: Array<{
      id: string;
      role: string;
      orderIndex: number;
      joinedAt: string | Date;
      user: {
        id: string;
        email?: string | null;
        profile?: UserProfileData | null;
      };
    }>;
    achievements: TeamAchievementItem[];
    feedbacks: TeamFeedbackItem[];
  };
  currentUser: {
    id: string;
    role: string;
    profile?: {
      fullName: string;
      avatarUrl?: string;
    } | null;
  } | null;
  isAlreadyMember: boolean;
  isPending: boolean;
}

export default function TeamDetailInteractive({
  team,
  currentUser,
  isAlreadyMember,
  isPending,
}: TeamDetailInteractiveProps) {
  // Tabs: 1-Tab: Izohlar va xulosalar, 2-Tab: A'zolar jadvali, 3-Tab: Natijalar va yutuqlar
  const [activeTab, setActiveTab] = useState<"feedback" | "members" | "achievements">("feedback");

  // Feedbacks state
  const [feedbacks, setFeedbacks] = useState<TeamFeedbackItem[]>(team.feedbacks || []);
  const [newFeedbackText, setNewFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Achievements, Likes and Comments state
  const [achievements, setAchievements] = useState<TeamAchievementItem[]>(team.achievements || []);
  const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<{ [achId: string]: string }>({});
  const [likedMap, setLikedMap] = useState<{ [achId: string]: boolean }>({});

  // Student Portfolio Modal state
  const [selectedStudent, setSelectedStudent] = useState<UserProfileData | null>(null);

  // Handle Like
  const handleLike = async (achId: string) => {
    if (likedMap[achId]) return;
    setLikedMap((prev) => ({ ...prev, [achId]: true }));
    setAchievements((prev) =>
      prev.map((item) =>
        item.id === achId ? { ...item, likesCount: item.likesCount + 1 } : item
      )
    );
    try {
      await fetch(`/api/teams/achievements/${achId}/like`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Comment on Achievement
  const handleAddComment = async (achId: string) => {
    const text = newCommentText[achId]?.trim();
    if (!text) return;
    try {
      const res = await fetch(`/api/teams/achievements/${achId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (data.comment) {
        setAchievements((prev) =>
          prev.map((item) =>
            item.id === achId
              ? { ...item, comments: [data.comment, ...item.comments] }
              : item
          )
        );
        setNewCommentText((prev) => ({ ...prev, [achId]: "" }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Feedback Submission
  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackText.trim()) return;
    setSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/teams/${team.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newFeedbackText }),
      });
      const data = await res.json();
      if (data.feedback) {
        setFeedbacks((prev) => [data.feedback, ...prev]);
        setNewFeedbackText("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Sort members: 1st row: Leader, 2nd row: Vice Leader, then rest
  const sortedMembers = [...team.members].sort((a, b) => {
    if (a.role.toLowerCase().includes("sardor") && !a.role.toLowerCase().includes("vitse") && !a.role.toLowerCase().includes("yordamchi")) return -1;
    if (b.role.toLowerCase().includes("sardor") && !b.role.toLowerCase().includes("vitse") && !b.role.toLowerCase().includes("yordamchi")) return 1;
    if (a.role.toLowerCase().includes("vitse") || a.role.toLowerCase().includes("yordamchi")) return -1;
    if (b.role.toLowerCase().includes("vitse") || b.role.toLowerCase().includes("yordamchi")) return 1;
    return (a.orderIndex || 99) - (b.orderIndex || 99);
  });

  return (
    <div className="space-y-8">
      {/* 1. JAMOA ASOSIY BLOKI: RASMI, NOMI, SARLAVHASI, MAQSAD VA YO'NALISHLARI */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Jamoa Rasmi */}
            <div className="w-28 h-28 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-black text-3xl shadow-md overflow-hidden flex-shrink-0">
              {team.avatarUrl ? (
                <img src={team.avatarUrl} alt={team.name} className="w-full h-full object-cover" />
              ) : (
                team.name.charAt(0)
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {/* Sarlavhasi / Toifasi */}
                <span className="px-3 py-1 rounded-lg text-xs font-black uppercase bg-tiu-50 text-tiu-900 border border-tiu-200">
                  {team.category}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                  {team.faculty || "Universitetlararo"}
                </span>
              </div>

              {/* Jamoa Nomi */}
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {team.name}
              </h1>

              {/* Jamoa Sardori Qisqacha */}
              <div className="pt-1 flex items-center justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(team.leader.profile || null)}
                  className="group inline-flex items-center space-x-2.5 p-1 px-3 rounded-full bg-slate-50 hover:bg-tiu-50 border border-slate-200 hover:border-tiu-300 transition-all text-left"
                >
                  <div className="w-6 h-6 rounded-full bg-tiu-900 text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                    {team.leader.profile?.avatarUrl ? (
                      <img src={team.leader.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      "S"
                    )}
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 group-hover:text-tiu-900">
                    👑 Sardor: {team.leader.profile?.fullName || "Yetakchi"} (Profil &rarr;)
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <JoinTeamModal
              teamId={team.id}
              isLoggedIn={!!currentUser}
              isStudent={currentUser?.role === "STUDENT"}
              isAlreadyMember={isAlreadyMember}
              isPending={isPending}
            />
          </div>
        </div>

        {/* Maqsad va Yo'nalishlari */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Jamoaning Asosiy Maqsadi va Yo&apos;nalishi
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {team.description}
          </p>
        </div>

        {/* Qidirilayotgan Yo'nalishlar */}
        {team.neededRoles && (
          <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-2xl flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase text-amber-900 tracking-wider">
                Jamoaga qidirilayotgan mutaxassislar / yo&apos;nalishlar:
              </h4>
              <p className="text-xs sm:text-sm text-amber-950 font-semibold mt-0.5">
                {team.neededRoles}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. TABLAR: 1-TAB: IZOHLAR VA XULOSALAR | 2-TAB: A'ZOLAR JADVALI | 3-TAB: NATIJALAR VA YUTUQLAR */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Tab sarlavhalari */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
          <button
            onClick={() => setActiveTab("feedback")}
            className={`py-4 px-6 text-sm font-black transition-all border-b-2 flex items-center space-x-2 flex-shrink-0 ${
              activeTab === "feedback"
                ? "border-tiu-900 text-tiu-900 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-tiu-700" />
            <span>1-Tab: Izohlar va Xulosalar ({feedbacks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`py-4 px-6 text-sm font-black transition-all border-b-2 flex items-center space-x-2 flex-shrink-0 ${
              activeTab === "members"
                ? "border-tiu-900 text-tiu-900 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4 text-tiu-700" />
            <span>2-Tab: A&apos;zolar Jadvali ({team.members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("achievements")}
            className={`py-4 px-6 text-sm font-black transition-all border-b-2 flex items-center space-x-2 flex-shrink-0 ${
              activeTab === "achievements"
                ? "border-tiu-900 text-tiu-900 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>3-Tab: Natijalar va Yutuqlar ({achievements.length})</span>
          </button>
        </div>

        {/* Tab Tarkibi */}
        <div className="p-6 sm:p-8">
          
          {/* ==================== 1-TAB: IZOHLAR VA XULOSALAR ==================== */}
          {activeTab === "feedback" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Jamoa Faoliyati Bo&apos;yicha Xulosalar va Izohlar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mentorlar, dekanat va bo&apos;lim mas&apos;ullari tomonidan jamoaga berilgan rasmiy baholar
                  </p>
                </div>
              </div>

              {/* Yangi izoh yoki xulosa qoldirish */}
              <form onSubmit={handleAddFeedback} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Jamoa haqida o&apos;z xulosangiz yoki fikringizni bildiring:
                </label>
                <textarea
                  rows={3}
                  value={newFeedbackText}
                  onChange={(e) => setNewFeedbackText(e.target.value)}
                  placeholder="Jamoaning loyihasi, intizomi yoki natijalari haqida fikr..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-tiu-800"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-5 py-2 rounded-xl bg-tiu-900 text-white font-bold text-xs hover:bg-tiu-950 transition-colors shadow-xs flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Xulosani jo&apos;natish</span>
                  </button>
                </div>
              </form>

              {/* Izohlar ro'yxati */}
              <div className="space-y-4">
                {feedbacks.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 rounded-2xl">
                    Hozircha rasmiy xulosalar mavjud emas. Birinchi bo&apos;lib fikr bildiring!
                  </div>
                ) : (
                  feedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs overflow-hidden">
                            {fb.authorAvatar ? (
                              <img src={fb.authorAvatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              fb.authorName.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-slate-900">
                              {fb.authorName}
                            </div>
                            <div className="text-[11px] font-bold text-tiu-800">
                              {fb.authorRole || "Mutaxassis"}
                            </div>
                          </div>
                        </div>

                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(fb.createdAt).toLocaleDateString("uz-UZ")}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {fb.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==================== 2-TAB: A'ZOLAR JADVALI (1-QATOR SARDOR, SO'NG YORDAMCHISI) ==================== */}
          {activeTab === "members" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Jamoa Tarkibi va Mas&apos;uliyat Jadvali
                  </h3>
                  <p className="text-xs text-slate-500">
                    (Istalgan talaba ustiga bosib, uning to&apos;liq portfoliosini ko&apos;rishingiz mumkin)
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/90 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
                      <th scope="col" className="py-3 px-4 w-14 text-center">
                        #
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Talaba F.I.SH
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Jamoaviy Roli
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Yo&apos;nalishi / Mutaxassisligi
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Guruhi
                      </th>
                      <th scope="col" className="py-3 px-6 text-right w-36">
                        Harakat
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {sortedMembers.map((member, index) => {
                      const isLeader = index === 0;
                      const isViceLeader = index === 1;

                      return (
                        <tr
                          key={member.id}
                          onClick={() => setSelectedStudent(member.user.profile || null)}
                          className={`cursor-pointer transition-colors ${
                            isLeader
                              ? "bg-amber-50/40 hover:bg-amber-50/70"
                              : isViceLeader
                              ? "bg-blue-50/30 hover:bg-blue-50/60"
                              : "hover:bg-slate-50/80"
                          }`}
                        >
                          {/* 1. Raqam */}
                          <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                            {index + 1}
                          </td>

                          {/* 2. Talaba F.I.SH */}
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3.5">
                              <div className="w-10 h-10 rounded-xl bg-tiu-900 text-white flex items-center justify-center font-bold text-xs overflow-hidden shadow-xs flex-shrink-0">
                                {member.user.profile?.avatarUrl ? (
                                  <img
                                    src={member.user.profile.avatarUrl}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  member.user.profile?.fullName?.charAt(0) || "T"
                                )}
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900 hover:text-tiu-800 transition-colors">
                                  {member.user.profile?.fullName}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  GPA: {member.user.profile?.gpa?.toFixed(2) || "4.80"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 3. Jamoaviy Roli (1-qator Sardor, 2-qator Yordamchi) */}
                          <td className="py-4 px-6">
                            {isLeader ? (
                              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-black uppercase bg-amber-400 text-slate-950 shadow-xs border border-amber-500">
                                <span>👑 Jamoa Sardori</span>
                              </span>
                            ) : isViceLeader ? (
                              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-black uppercase bg-blue-100 text-blue-900 border border-blue-300">
                                <span>⭐ Vitse-sardor</span>
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                                {member.role}
                              </span>
                            )}
                          </td>

                          {/* 4. Yo'nalishi */}
                          <td className="py-4 px-6 text-xs font-semibold text-tiu-800">
                            {member.user.profile?.specialty || member.user.profile?.faculty || "Dasturiy injiniring"}
                          </td>

                          {/* 5. Guruhi */}
                          <td className="py-4 px-6">
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 font-bold text-xs text-slate-700">
                              {member.user.profile?.groupName || "SE-22-01"}
                            </span>
                          </td>

                          {/* 6. Harakat */}
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(member.user.profile || null);
                              }}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-tiu-900 bg-white hover:bg-tiu-900 hover:text-white text-tiu-900 font-bold text-xs transition-all shadow-xs"
                            >
                              Portfolio &rarr;
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== 3-TAB: NATIJALAR VA YUTUQLAR (POST KABI) ==================== */}
          {activeTab === "achievements" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Jamoaning Rasmiy Yutuqlari va Natijalari
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hakatonlar, musobaqalar va startap tanlovlarida erishilgan g&apos;alabalar
                  </p>
                </div>
              </div>

              {achievements.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 rounded-2xl">
                  Jamoa hali rasmiy yutuqlarni joylamagan.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((ach) => {
                    const isCommentsOpen = openCommentsId === ach.id;
                    const formattedDate = new Date(ach.dateAchieved).toLocaleDateString("uz-UZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });

                    return (
                      <div
                        key={ach.id}
                        className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Post Kichik Rasmi */}
                          {ach.imageUrl && (
                            <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                              <img
                                src={ach.imageUrl}
                                alt={ach.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 rounded-lg text-xs font-black uppercase bg-amber-500 text-slate-950 shadow-md">
                                  {ach.rank}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="p-6 space-y-3">
                            {!ach.imageUrl && (
                              <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase bg-amber-500 text-slate-950">
                                {ach.rank}
                              </span>
                            )}

                            {/* Sanasi */}
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              {formattedDate}
                            </div>

                            {/* Sarlavhasi */}
                            <h3 className="text-lg font-black text-slate-900 leading-snug">
                              {ach.title}
                            </h3>

                            {ach.description && (
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {ach.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Interaktiv Harakatlar: Like, Comment Icon, Ko'rishlar Soni */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Like tugmasi */}
                            <button
                              onClick={() => handleLike(ach.id)}
                              className={`flex items-center space-x-1.5 text-xs font-bold transition-colors ${
                                likedMap[ach.id]
                                  ? "text-red-600"
                                  : "text-slate-500 hover:text-red-500"
                              }`}
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  likedMap[ach.id] ? "fill-red-600 text-red-600" : ""
                                }`}
                              />
                              <span>{ach.likesCount}</span>
                            </button>

                            {/* Comment Iconi */}
                            <button
                              onClick={() =>
                                setOpenCommentsId(isCommentsOpen ? null : ach.id)
                              }
                              className={`flex items-center space-x-1.5 text-xs font-bold transition-colors ${
                                isCommentsOpen
                                  ? "text-tiu-800"
                                  : "text-slate-500 hover:text-tiu-800"
                              }`}
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>{ach.comments.length} ta izoh</span>
                            </button>
                          </div>

                          {/* Ko'rishlar Soni */}
                          <div className="flex items-center space-x-1 text-xs text-slate-400 font-medium">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{ach.viewsCount}</span>
                          </div>
                        </div>

                        {/* Izohlar Paneli */}
                        {isCommentsOpen && (
                          <div className="p-6 bg-slate-50/90 border-t border-slate-200 space-y-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={newCommentText[ach.id] || ""}
                                onChange={(e) =>
                                  setNewCommentText((prev) => ({
                                    ...prev,
                                    [ach.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleAddComment(ach.id);
                                }}
                                placeholder="Fikringizni qoldiring..."
                                className="flex-grow px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tiu-800"
                              />
                              <button
                                onClick={() => handleAddComment(ach.id)}
                                className="p-2 bg-tiu-900 text-white rounded-xl hover:bg-tiu-950 shadow-xs"
                                title="Yuborish"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                              {ach.comments.length === 0 ? (
                                <p className="text-[11px] text-slate-400 italic">
                                  Hozircha izohlar mavjud emas.
                                </p>
                              ) : (
                                ach.comments.map((c) => (
                                  <div
                                    key={c.id}
                                    className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-slate-900">
                                        {c.authorName}
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        {new Date(c.createdAt).toLocaleDateString("uz-UZ")}
                                      </span>
                                    </div>
                                    <p className="text-slate-600 text-[11px]">
                                      {c.content}
                                    </p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 3. TALABA PORTFOLIO MODALI (A'zolar yoki Sardor bosilganda chiqadi) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-18 h-18 rounded-2xl bg-tiu-900 text-white flex items-center justify-center font-bold text-2xl overflow-hidden shadow-md flex-shrink-0">
                  {selectedStudent.avatarUrl ? (
                    <img
                      src={selectedStudent.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selectedStudent.fullName.charAt(0)
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900">
                    {selectedStudent.fullName}
                  </h3>
                  <p className="text-xs font-bold text-tiu-800">
                    {selectedStudent.specialty || selectedStudent.faculty}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedStudent.dekanat || selectedStudent.faculty} • Guruh: {selectedStudent.groupName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPA va Ballar */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center space-x-3">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-amber-800">
                    Akademik GPA
                  </div>
                  <div className="text-base font-black text-amber-950">
                    {selectedStudent.gpa ? selectedStudent.gpa.toFixed(2) : "4.85"} / 5.0
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center space-x-3">
                <Trophy className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-blue-800">
                    Iqtidor Balli
                  </div>
                  <div className="text-base font-black text-blue-950">
                    {selectedStudent.totalPoints || 150} ball
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjimai hol */}
            {selectedStudent.bio && (
              <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                {selectedStudent.bio}
              </p>
            )}

            {/* Ko'nikmalar */}
            {selectedStudent.skills && (
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.skills.split(",").map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Aloqa */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-wrap gap-3 text-xs text-slate-600 font-semibold">
                {selectedStudent.telegram && (
                  <span className="text-blue-700">{selectedStudent.telegram}</span>
                )}
                {selectedStudent.phone && (
                  <span>{selectedStudent.phone}</span>
                )}
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-950 transition-colors"
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