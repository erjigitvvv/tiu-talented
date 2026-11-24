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
      joinedAt: string | Date;
      user: {
        id: string;
        email?: string | null;
        profile?: UserProfileData | null;
      };
    }>;
    achievements: TeamAchievementItem[];
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
  // State for achievements, likes and comments
  const [achievements, setAchievements] = useState<TeamAchievementItem[]>(team.achievements);
  const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<{ [achId: string]: string }>({});
  const [likedMap, setLikedMap] = useState<{ [achId: string]: boolean }>({});

  // State for Student Portfolio Modal
  const [selectedStudent, setSelectedStudent] = useState<UserProfileData | null>(null);

  // Handle Like
  const handleLike = async (achId: string) => {
    if (likedMap[achId]) return;

    // Optimistic UI update
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

  // Handle Comment Submission
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

  return (
    <div className="space-y-10">
      {/* 1. Jamoa Bosh Kartochkasi */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-black text-3xl shadow-md overflow-hidden flex-shrink-0">
              {team.avatarUrl ? (
                <img src={team.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                team.name.charAt(0)
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-black uppercase bg-tiu-50 text-tiu-900 border border-tiu-200">
                  {team.category}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                  {team.faculty || "Universitetlararo"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {team.name}
              </h1>
              
              {/* Jamoa Sardori: Kichik profil kabi rasm va F.I.SH */}
              <div className="pt-2 flex items-center justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(team.leader.profile || null)}
                  className="group inline-flex items-center space-x-3 p-1.5 pr-4 rounded-full bg-slate-50 hover:bg-tiu-50 border border-slate-200 hover:border-tiu-300 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-tiu-800 text-white flex items-center justify-center font-bold text-xs overflow-hidden border border-white shadow-xs">
                    {team.leader.profile?.avatarUrl ? (
                      <img src={team.leader.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      team.leader.profile?.fullName?.charAt(0) || "S"
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold uppercase text-tiu-700 tracking-wider">
                      👑 Jamoa Sardori (Profilni ko&apos;rish)
                    </div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-tiu-900">
                      {team.leader.profile?.fullName || "Yetakchi"}
                    </div>
                  </div>
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

        {/* Jamoa Tavsifi */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Jamoa Maqsadi va Yo&apos;nalishi
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {team.description}
          </p>
        </div>

        {/* Qidirilayotgan mutaxassislar */}
        {team.neededRoles && (
          <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-2xl flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase text-amber-900 tracking-wider">
                Jamoaga quyidagi mutaxassislar kerak:
              </h4>
              <p className="text-xs sm:text-sm text-amber-950 font-semibold mt-0.5">
                {team.neededRoles}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Jamoa A'zolari — Ko'p Rasmlar va Ularning Yo'nalishlari */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2.5">
            <Users className="w-5 h-5 text-tiu-800" />
            <span>Jamoa Tarkibi va Yo&apos;nalishlari ({team.members.length} a&apos;zo)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            (Profil ustiga bosib to&apos;liq portfolioni ko&apos;ring)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.members.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedStudent(member.user.profile || null)}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-13 h-13 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-base overflow-hidden border border-slate-200 group-hover:border-tiu-600 transition-colors flex-shrink-0">
                  {member.user.profile?.avatarUrl ? (
                    <img
                      src={member.user.profile.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.user.profile?.fullName?.charAt(0) || "A"
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-tiu-800 transition-colors line-clamp-1">
                    {member.user.profile?.fullName}
                  </h4>
                  {/* Jamoa a'zosi yo'nalishi */}
                  <div className="text-xs font-semibold text-tiu-700 mt-0.5">
                    {member.user.profile?.specialty || member.role}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {member.user.profile?.groupName || member.user.profile?.faculty}
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-bold text-tiu-800 group-hover:underline flex-shrink-0">
                Portfolio &rarr;
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Jamoaning Yutuqlari — Post Kabi Kichik Rasm, Sana, Sarlavha, O'rni, Like va Izohlar */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2.5">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Jamoaning Qo&apos;lga Kiritgan Yutuqlari ({achievements.length})</span>
          </h2>
        </div>

        {achievements.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
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

                      {/* Comment Iconi — bosganda izoh yozish va ko'rish ochiladi */}
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

                  {/* Izohlar Paneli (Comments Drawer / Tray) */}
                  {isCommentsOpen && (
                    <div className="p-6 bg-slate-50/90 border-t border-slate-200 space-y-4">
                      {/* Yangi izoh yozish formasi */}
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

                      {/* Mavjud izohlar ro'yxati */}
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

      {/* 4. To'liq Talaba Portfoliosi Modali (Profilga bosilganda chiqadi) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-tiu-900 text-white flex items-center justify-center font-bold text-2xl overflow-hidden shadow-md">
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
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {selectedStudent.fullName}
                  </h3>
                  <p className="text-xs font-bold text-tiu-800">
                    {selectedStudent.specialty || selectedStudent.faculty}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {selectedStudent.dekanat || selectedStudent.faculty} • Guruh: {selectedStudent.groupName || "Biriktirilgan"}
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

            {/* GPA va Ballar Ko'rsatkichi */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center space-x-3">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-amber-800">
                    Akademik GPA
                  </div>
                  <div className="text-base font-black text-amber-950">
                    {selectedStudent.gpa ? selectedStudent.gpa.toFixed(2) : "4.80"} / 5.0
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

            {/* Bio (Tarjimai hol) */}
            {selectedStudent.bio && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Qisqacha Tarjimai Hol
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedStudent.bio}
                </p>
              </div>
            )}

            {/* Ko'nikmalar (Skills) */}
            {selectedStudent.skills && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Asosiy Ko&apos;nikmalar
                </h4>
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
              </div>
            )}

            {/* Aloqa */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-slate-600">
                {selectedStudent.phone && (
                  <span className="flex items-center space-x-1 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedStudent.phone}</span>
                  </span>
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