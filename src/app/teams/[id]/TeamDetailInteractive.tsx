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
  Crown,
  Calendar,
  Building2,
  Target,
  Medal,
  Clock,
  ArrowRight,
  LayoutGrid,
  List,
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
    createdAt?: string | Date;
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
  // Tabs: 1-Tab: A'zolar va Tarkib, 2-Tab: Ilmiy va Amaliy Yutuqlar, 3-Tab: Xulosalar va Izohlar
  const [activeTab, setActiveTab] = useState<"members" | "achievements" | "feedback">("members");
  const [membersView, setMembersView] = useState<"cards" | "table">("cards");

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

  // Tashkiliy sanani formatlash
  const formattedCreatedDate = team.createdAt
    ? new Date(team.createdAt).toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "2024-yil Sentabr";

  return (
    <div className="space-y-8">
      {/* 1. JAMOA ASOSIY BLOKI: 16x9 BANNER, NOMI, TASHKILIY SANA, YO'NALISHLAR VA 1x1 AZOLAR RASMLARI */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        
        {/* 16x9 Widescreen Banner va Jamoa Sarlavhasi */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-950 shadow-md">
          <img
            src={
              team.avatarUrl ||
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80"
            }
            alt={team.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />

          {/* Banner Ichidagi Kontent */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* Jamoa 1x1 Rasmi */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-2xl bg-white p-1 shadow-2xl flex-shrink-0">
                <div className="w-full h-full rounded-xl overflow-hidden bg-tiu-900 text-white flex items-center justify-center font-black text-2xl">
                  {team.avatarUrl ? (
                    <img src={team.avatarUrl} alt="" className="w-full h-full object-cover aspect-square" />
                  ) : (
                    team.name.charAt(0)
                  )}
                </div>
              </div>

              {/* Jamoa Nomi va Toifalari */}
              <div className="text-white space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 rounded-lg text-xs font-black uppercase bg-amber-400 text-slate-950 shadow-xs">
                    {team.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {team.faculty || "Axborot Texnologiyalari"}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                  {team.name}
                </h1>
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
        </div>

        {/* Jamoa Tashkiliy Sanasi va Yo'nalishlar Metriklari */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Tashkiliy Sana */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-blue-100/70 text-blue-900">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Tashkiliy Sana</div>
              <div className="text-sm font-black text-slate-900">
                {formattedCreatedDate}
              </div>
            </div>
          </div>

          {/* Asosiy Yo'nalish / Qiziqish */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-amber-100/70 text-amber-900">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Asosiy Qiziqish & Yo&apos;nalish</div>
              <div className="text-sm font-black text-slate-900 truncate">
                {team.category}
              </div>
            </div>
          </div>

          {/* Dekanat va Fakultet */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-900">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Dekanat / Fakultet</div>
              <div className="text-sm font-black text-slate-900 truncate">
                {team.faculty || "Axborot Texnologiyalari Dekanati"}
              </div>
            </div>
          </div>
        </div>

        {/* Jamoa Haqida To'liq Ma'lumot */}
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Jamoa Haqida To&apos;liq Ma&apos;lumot va Missiyasi
          </h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal bg-slate-50/70 p-5 rounded-2xl border border-slate-100 whitespace-pre-line">
            {team.description}
          </p>
        </div>

        {/* Qidirilayotgan Yo'nalishlar / Ko'nikmalar */}
        {team.neededRoles && (
          <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-2xl flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase text-amber-900 tracking-wider">
                Qiziqish va Talab qilinayotgan mutaxassisliklar:
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {team.neededRoles.split(",").map((role) => (
                  <span
                    key={role}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-amber-950 border border-amber-200/80 shadow-2xs"
                  >
                    {role.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* JAMOA SARDORI ALOHIDA BLOKI */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-base shadow-sm ring-2 ring-amber-400 overflow-hidden flex-shrink-0">
              {team.leader.profile?.avatarUrl ? (
                <img
                  src={team.leader.profile.avatarUrl}
                  alt=""
                  className="w-full h-full object-cover aspect-square"
                />
              ) : (
                team.leader.profile?.fullName?.charAt(0) || "S"
              )}
              <div className="absolute top-1 right-1 p-0.5 rounded bg-amber-400 text-slate-950">
                <Crown className="w-3 h-3" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-black text-amber-800 uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>Jamoa Sardori (Team Leader)</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                {team.leader.profile?.fullName || "Yetakchi"}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {team.leader.profile?.faculty || "Axborot Texnologiyalari"} • Guruh: {team.leader.profile?.groupName || "SE-22-01"} • GPA: {team.leader.profile?.gpa?.toFixed(2) || "4.85"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedStudent(team.leader.profile || null)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-tiu-900 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center space-x-1.5 self-start sm:self-auto flex-shrink-0"
          >
            <span>Sardor Portfoliosi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* JAMOA A'ZOLARI VA SARDORNING 1x1 RASMLARI (GALEREYA & PORTFOLIO) */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-2">
              <Users className="w-4 h-4 text-tiu-800" />
              <span>Jamoa Tarkibi va A&apos;zolari (1x1 Formatda):</span>
            </h4>
            <span className="text-xs text-slate-400 font-semibold">
              {sortedMembers.length} nafar a&apos;zo
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {sortedMembers.map((member, idx) => {
              const isLeader =
                member.role.toLowerCase().includes("sardor") &&
                !member.role.toLowerCase().includes("vitse") &&
                !member.role.toLowerCase().includes("yordamchi");
              const isVice =
                member.role.toLowerCase().includes("vitse") ||
                member.role.toLowerCase().includes("yordamchi");

              return (
                <div
                  key={member.id || idx}
                  onClick={() => setSelectedStudent(member.user.profile || null)}
                  className={`group p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center space-y-2 hover:-translate-y-1 hover:shadow-md ${
                    isLeader
                      ? "bg-amber-50/70 border-amber-300 shadow-2xs"
                      : isVice
                      ? "bg-blue-50/60 border-blue-200/80"
                      : "bg-white border-slate-200/80 hover:border-tiu-800"
                  }`}
                  title={`${member.user.profile?.fullName || "A'zo"} - Portfoliosini ko'rish`}
                >
                  {/* 1x1 Formatdagi Rasm */}
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 aspect-square rounded-2xl overflow-hidden bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                    {member.user.profile?.avatarUrl ? (
                      <img
                        src={member.user.profile.avatarUrl}
                        alt=""
                        className="w-full h-full object-cover aspect-square"
                      />
                    ) : (
                      member.user.profile?.fullName?.charAt(0) || "A"
                    )}

                    {isLeader && (
                      <div className="absolute top-1 right-1 p-1 rounded-md bg-amber-400 text-slate-950 shadow-xs">
                        <Crown className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <div className="text-xs font-black text-slate-900 group-hover:text-tiu-800 transition-colors truncate">
                      {member.user.profile?.fullName || "A'zo"}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 truncate flex items-center justify-center space-x-1">
                      {isLeader ? (
                        <span className="text-amber-800 font-extrabold flex items-center space-x-0.5">
                          <Crown className="w-2.5 h-2.5 inline" />
                          <span>Sardor</span>
                        </span>
                      ) : isVice ? (
                        <span className="text-blue-800 font-extrabold flex items-center space-x-0.5">
                          <Star className="w-2.5 h-2.5 inline" />
                          <span>Vitse-sardor</span>
                        </span>
                      ) : (
                        <span>{member.role}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. TABLAR: 1-TAB: A'ZOLAR (CARD & JADVAL) | 2-TAB: YUTUQLAR (POST & LIKE & COMMENTS) | 3-TAB: XULOSALAR */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Tab sarlavhalari */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`py-4 px-6 text-sm font-black transition-all border-b-2 flex items-center space-x-2 flex-shrink-0 ${
              activeTab === "members"
                ? "border-tiu-900 text-tiu-900 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4 text-tiu-700" />
            <span>1-Tab: Jamoa A&apos;zolari ({sortedMembers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("achievements")}
            className={`py-4 px-6 text-sm font-black transition-all border-b-2 flex items-center space-x-2 flex-shrink-0 ${
              activeTab === "achievements"
                ? "border-tiu-900 text-tiu-900 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>2-Tab: Ilmiy va Amaliy Yutuqlar ({achievements.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("feedback")}
            className={`py-4 px-6 text-sm font-black transition-all border-b-2 flex items-center space-x-2 flex-shrink-0 ${
              activeTab === "feedback"
                ? "border-tiu-900 text-tiu-900 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-tiu-700" />
            <span>3-Tab: Mentor va Bo&apos;lim Xulosalari ({feedbacks.length})</span>
          </button>
        </div>

        {/* Tab Tarkibi */}
        <div className="p-6 sm:p-8">
          
          {/* ==================== 1-TAB: JAMOA A'ZOLARI (CARDLAR VA JADVAL SWITCHERI) ==================== */}
          {activeTab === "members" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Jamoa Tarkibi va Mas&apos;uliyat Taqsimoti ({sortedMembers.length} nafar)
                  </h3>
                  <p className="text-xs text-slate-500">
                    1-qatorda jamoa sardori, so&apos;ng vitse-sardor va tegishli rollardagi a&apos;zolar
                  </p>
                </div>

                {/* Switcher: Cardlar vs Jadval ko'rinishi */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 space-x-1 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setMembersView("cards")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                      membersView === "cards"
                        ? "bg-white text-tiu-950 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Cardlar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMembersView("table")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                      membersView === "table"
                        ? "bg-white text-tiu-950 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Jadval</span>
                  </button>
                </div>
              </div>

              {/* 1. CARDLAR KO'RINISHI */}
              {membersView === "cards" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedMembers.map((member, index) => {
                    const isLeader = index === 0;
                    const isViceLeader = index === 1;

                    return (
                      <div
                        key={member.id}
                        onClick={() => setSelectedStudent(member.user.profile || null)}
                        className={`group p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-lg ${
                          isLeader
                            ? "bg-amber-50/50 border-amber-300 shadow-2xs"
                            : isViceLeader
                            ? "bg-blue-50/40 border-blue-200"
                            : "bg-white border-slate-200/90 hover:border-tiu-800"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            {/* 1x1 Rasm */}
                            <div className="relative w-14 h-14 aspect-square rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm overflow-hidden group-hover:scale-105 transition-transform flex-shrink-0">
                              {member.user.profile?.avatarUrl ? (
                                <img
                                  src={member.user.profile.avatarUrl}
                                  alt=""
                                  className="w-full h-full object-cover aspect-square"
                                />
                              ) : (
                                member.user.profile?.fullName?.charAt(0) || "A"
                              )}

                              {isLeader && (
                                <div className="absolute top-1 right-1 p-0.5 rounded bg-amber-400 text-slate-950 shadow-xs">
                                  <Crown className="w-3 h-3" />
                                </div>
                              )}
                            </div>

                            {/* Rol Nishoni */}
                            {isLeader ? (
                              <span className="px-2.5 py-1 rounded-xl text-[11px] font-black uppercase bg-amber-400 text-slate-950 shadow-xs flex items-center space-x-1">
                                <Crown className="w-3 h-3" />
                                <span>Sardor</span>
                              </span>
                            ) : isViceLeader ? (
                              <span className="px-2.5 py-1 rounded-xl text-[11px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-300 flex items-center space-x-1">
                                <Star className="w-3 h-3" />
                                <span>Vitse-sardor</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700">
                                {member.role}
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-tiu-800 transition-colors">
                              {member.user.profile?.fullName || "A'zo"}
                            </h4>
                            <p className="text-xs text-tiu-800 font-semibold mt-0.5">
                              {member.user.profile?.specialty || member.user.profile?.faculty || "Dasturiy injiniring"}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Guruh: {member.user.profile?.groupName || "SE-22-01"}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-500">
                            GPA: <strong className="text-slate-800">{member.user.profile?.gpa?.toFixed(2) || "4.80"}</strong>
                          </span>
                          <span className="text-tiu-800 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                            <span>Portfolio</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* 2. JADVAL KO'RINISHI */
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/90 border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-wider">
                        <th scope="col" className="py-3 px-4 w-14 text-center">#</th>
                        <th scope="col" className="py-3 px-6">Talaba F.I.SH</th>
                        <th scope="col" className="py-3 px-6">Jamoaviy Roli</th>
                        <th scope="col" className="py-3 px-6">Yo&apos;nalishi</th>
                        <th scope="col" className="py-3 px-6">Guruhi</th>
                        <th scope="col" className="py-3 px-6 text-right w-36">Harakat</th>
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
                            <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                              {index + 1}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3.5">
                                <div className="w-10 h-10 rounded-xl bg-tiu-900 text-white flex items-center justify-center font-bold text-xs overflow-hidden shadow-xs flex-shrink-0">
                                  {member.user.profile?.avatarUrl ? (
                                    <img
                                      src={member.user.profile.avatarUrl}
                                      alt=""
                                      className="w-full h-full object-cover aspect-square"
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
                            <td className="py-4 px-6">
                              {isLeader ? (
                                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase bg-amber-400 text-slate-950 shadow-xs border border-amber-500">
                                  <Crown className="w-3.5 h-3.5" />
                                  <span>Jamoa Sardori</span>
                                </span>
                              ) : isViceLeader ? (
                                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase bg-blue-100 text-blue-900 border border-blue-300">
                                  <Star className="w-3.5 h-3.5" />
                                  <span>Vitse-sardor</span>
                                </span>
                              ) : (
                                <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                                  {member.role}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-xs font-semibold text-tiu-800">
                              {member.user.profile?.specialty || member.user.profile?.faculty || "Dasturiy injiniring"}
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 font-bold text-xs text-slate-700">
                                {member.user.profile?.groupName || "SE-22-01"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                type="button"
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
              )}
            </div>
          )}

          {/* ==================== 2-TAB: ILMIY VA AMALIY YUTUQLAR (POST KABI) ==================== */}
          {activeTab === "achievements" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Jamoaning Rasmiy Ilmiy va Amaliy Yutuqlari
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hakatonlar, startap tanlovlari va ilmiy olimpiadalarda erishilgan nufuzli natijalar
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
                          {/* Yutuqda tushgan rasm */}
                          {ach.imageUrl ? (
                            <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
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
                          ) : (
                            <div className="h-28 w-full bg-gradient-to-r from-tiu-950 to-tiu-900 p-4 flex items-end justify-between text-white relative">
                              <span className="px-3 py-1 rounded-lg text-xs font-black uppercase bg-amber-400 text-slate-950">
                                {ach.rank}
                              </span>
                              <Trophy className="w-6 h-6 text-amber-400 opacity-60" />
                            </div>
                          )}

                          <div className="p-6 space-y-3">
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
                              type="button"
                              onClick={() => handleLike(ach.id)}
                              className={`flex items-center space-x-1.5 text-xs font-bold transition-colors ${
                                likedMap[ach.id]
                                  ? "text-red-600"
                                  : "text-slate-500 hover:text-red-500"
                              }`}
                              title="Yoqdi"
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
                              type="button"
                              onClick={() =>
                                setOpenCommentsId(isCommentsOpen ? null : ach.id)
                              }
                              className={`flex items-center space-x-1.5 text-xs font-bold transition-colors ${
                                isCommentsOpen
                                  ? "text-tiu-800"
                                  : "text-slate-500 hover:text-tiu-800"
                              }`}
                              title="Izohlar"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>{ach.comments.length} ta izoh</span>
                            </button>
                          </div>

                          {/* Ko'rishlar Soni */}
                          <div className="flex items-center space-x-1 text-xs text-slate-400 font-medium">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{ach.viewsCount || 120} ko&apos;rildi</span>
                          </div>
                        </div>

                        {/* Izohlar Paneli va Izoh Yozish */}
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
                                type="button"
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
                                  Hozircha izohlar mavjud emas. Birinchi bo&apos;lib fikr bildiring!
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

          {/* ==================== 3-TAB: MENTOR VA BO'LIM XULOSALARI ==================== */}
          {activeTab === "feedback" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Jamoa Faoliyati Bo&apos;yicha Mentor va Bo&apos;lim Xulosalari
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