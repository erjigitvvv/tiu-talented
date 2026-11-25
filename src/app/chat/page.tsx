"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Paperclip, 
  Send, 
  Smile, 
  Search, 
  Menu, 
  ChevronUp, 
  CheckCheck, 
  FileText, 
  Image as ImageIcon, 
  BarChart2, 
  Link as LinkIcon,
  X
} from "lucide-react";

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  category?: string;
  time: string;
  attachment?: string;
}

interface Scientist {
  id: string;
  name: string;
  degree: string;
  folder: "jurisprudence" | "business" | "tg-bot";
  dept: string;
  avatar: string;
  online: boolean;
  syncStatus: string;
  lastMsg: string;
  time: string;
  messages: Message[];
}

export default function OlimlarChatPage() {
  const [folder, setFolder] = useState<"all" | "jurisprudence" | "business" | "tg-bot">("jurisprudence");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [category, setCategory] = useState<string>("GRANT");
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  const [scientists, setScientists] = useState<Scientist[]>([
    {
      id: "TIU-SCI-1042",
      name: "Prof. Dr. Alisher Karimov",
      degree: "DSc • Professor",
      folder: "jurisprudence",
      dept: "Xalqaro va Davlat Huquqi Kafedrasi Mudiri",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      online: true,
      syncStatus: "Telegram & Veb-sayt sinxron",
      lastMsg: "Ha, 1-jild doirasidagi 3 ta iqtidorli talabani loyihaga kiritdik.",
      time: "11:22",
      messages: [
        { id: "1", sender: "them", text: "Assalomu alaykum, Ziyoda! Xalqaro ilmiy anjuman tezislaringizni ko'rib chiqdim.", category: "CONFERENCE", time: "11:15" },
        { id: "2", sender: "me", text: "Assalomu alaykum, domla! Rahmat. Xalqaro grant arizasi bo'yicha hujjatlarni ham kiritaymi?", category: "GRANT", time: "11:18" },
        { id: "3", sender: "them", text: "Ha, albatta. 1-jild doirasidagi 3 ta iqtidorli talabani loyihaga kiritdik. Bugun arizani topshiramiz.", category: "DEADLINE", time: "11:22" }
      ]
    },
    {
      id: "TIU-SCI-1043",
      name: "Dots. Nigora Mahmudova",
      degree: "PhD • Dotsent",
      folder: "jurisprudence",
      dept: "Fuqarolik va Korporativ Huquq Eksperti",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      online: true,
      syncStatus: "Telegram orqali ulangan",
      lastMsg: "Maqolangiz Scopus jurnaliga qabul qilindi!",
      time: "12:05",
      messages: [
        { id: "1", sender: "them", text: "Maqolangiz tahririyatdan ijobiy xulosa oldi. Tabriklayman!", category: "NEWS", time: "12:05" }
      ]
    },
    {
      id: "TIU-SCI-1044",
      name: "Dr. Farhod Olimov",
      degree: "PhD • Katta O'qituvchi",
      folder: "jurisprudence",
      dept: "Kiber-xavfsizlik va Axborot Huquqi",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      online: false,
      syncStatus: "Faqat veb-sayt",
      lastMsg: "Yangi dars jadvali tasdiqlandi.",
      time: "Kecha",
      messages: [
        { id: "1", sender: "them", text: "Ilmiy reja bo'yicha savollaringiz bo'lsa, dushanba kuni kabinetga kiring.", category: "RESEARCH", time: "Kecha" }
      ]
    },
    {
      id: "TIU-SCI-2081",
      name: "Prof. Jamshid Ergashev",
      degree: "DSc • Biznes Eksperti",
      folder: "business",
      dept: "Raqamli Iqtisodiyot va Startap Inkubator Rahbari",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      online: true,
      syncStatus: "Telegram & Veb-sayt sinxron",
      lastMsg: "Startap loyihangiz bo'yicha pitch-deckni tayyorlang.",
      time: "13:45",
      messages: [
        { id: "1", sender: "them", text: "Yangi startap inkubatsiyasi dasturiga saralash boshlandi. Talabalaringiz g'oyalari bormi?", category: "STARTUP", time: "10:30" }
      ]
    },
    {
      id: "TIU-BOT-001",
      name: "TIU Talents Telegram Boti",
      degree: "Rasmiy Telegram Tizimi",
      folder: "tg-bot",
      dept: "Rektorat & Ilmiy Bo'lim Avtomatik Xabarnomalari",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
      online: true,
      syncStatus: "Telegram API 24/7 Faol",
      lastMsg: "Yangi xalqaro grant qabuli e'lon qilindi!",
      time: "Hozir",
      messages: [
        { id: "1", sender: "them", text: "🤖 Xush kelibsiz! Bu TIU Talents rasmiy Telegram boti. Bu yer orqali yozilgan xabarlar olimlarning Telegram akkauntiga avtomatik yetkaziladi.", category: "NEWS", time: "10:00" }
      ]
    }
  ]);

  const [activeScientistId, setActiveScientistId] = useState<string>("TIU-SCI-1042");
  const activeScientist = scientists.find((s) => s.id === activeScientistId) || scientists[0];

  const filteredScientists = scientists.filter((sci) => {
    const matchesFolder = folder === "all" || sci.folder === folder;
    const matchesSearch =
      searchQuery === "" ||
      sci.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sci.dept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const categories = ["GRANT", "CONFERENCE", "RESEARCH", "STARTUP", "DEADLINE", "NEWS"];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: inputText.trim(),
      category: category || undefined,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setScientists((prev) =>
      prev.map((sci) => {
        if (sci.id === activeScientist.id) {
          return {
            ...sci,
            lastMsg: newMsg.text,
            time: newMsg.time,
            messages: [...sci.messages, newMsg],
          };
        }
        return sci;
      })
    );

    setInputText("");
    setCategoryPopoverOpen(false);
    setAttachmentOpen(false);
    setEmojiOpen(false);

    // Auto reply simulation from scientist
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "them",
        text: `Qabul qildim! ${category ? `[${category}]` : ""} bo'yicha ma'lumotlaringizni ko'rib chiqib, tez orada javob yozaman.`,
        category: category || undefined,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setScientists((prev) =>
        prev.map((sci) => {
          if (sci.id === activeScientist.id) {
            return {
              ...sci,
              lastMsg: autoReply.text,
              time: autoReply.time,
              messages: [...sci.messages, autoReply],
            };
          }
          return sci;
        })
      );
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-100 flex flex-col p-2 sm:p-4 md:p-6">
      
      {/* Container */}
      <div className="w-full max-w-7xl mx-auto h-[85vh] bg-white rounded-3xl shadow-xl border border-slate-200/90 flex flex-col overflow-hidden relative">
        
        {/* TOP BAR / WINDOW CHROME */}
        <div className="bg-gradient-to-r from-[#229ed9] to-[#0088cc] text-white px-4 py-2.5 flex items-center justify-between select-none shadow-sm z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition active:scale-95"
              title="Jildlar va olimlarni yashirish / ochish (☰)"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse" />
              <span className="font-bold text-sm tracking-wide">TIU Telegram Messenger</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium ml-1">
                Ilmiy Olimlar Muloqot Platformasi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-lg font-mono">
              24/7 Telegram Bot Sinxron
            </span>
          </div>
        </div>

        {/* SPLIT VIEW */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* LEFT SIDEBAR: 3 JILD & SCIENTISTS */}
          <aside
            className={`${
              sidebarOpen ? "w-80 md:w-96" : "-ml-80 md:-ml-96 opacity-0"
            } border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 transition-all duration-300 ease-in-out z-10`}
          >
            {/* Search */}
            <div className="p-3 bg-white border-b border-slate-200">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Olimlarni qidirish (F.I.SH, soha)..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white rounded-xl border border-transparent focus:border-blue-400 focus:outline-none transition"
                />
              </div>
            </div>

            {/* 3 FOLDERS (JILDLAR) TABS */}
            <div className="px-2 pt-2 bg-white border-b border-slate-200 flex items-center justify-between text-xs font-semibold select-none overflow-x-auto">
              <button
                onClick={() => setFolder("jurisprudence")}
                className={`pb-2 px-2.5 border-b-2 whitespace-nowrap transition flex items-center gap-1 ${
                  folder === "jurisprudence"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>⚖️</span> 1. Yurisprudensiya
              </button>
              <button
                onClick={() => setFolder("business")}
                className={`pb-2 px-2.5 border-b-2 whitespace-nowrap transition flex items-center gap-1 ${
                  folder === "business"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>🚀</span> 2. Biznes
              </button>
              <button
                onClick={() => setFolder("tg-bot")}
                className={`pb-2 px-2.5 border-b-2 whitespace-nowrap transition flex items-center gap-1 ${
                  folder === "tg-bot"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>🤖</span> 3. TG-Bot
              </button>
            </div>

            {/* Title */}
            <div className="px-3.5 py-2 bg-slate-100/80 border-b border-slate-200/80 flex items-center justify-between text-[11px] font-semibold text-slate-600 tracking-wider uppercase">
              <span>
                {folder === "jurisprudence"
                  ? "Yurisprudensiya Olimlari (1-Jild)"
                  : folder === "business"
                  ? "Biznes & Inovatsion (2-Jild)"
                  : "Telegram Bot Xizmati (3-Jild)"}
              </span>
              <span className="text-blue-600 font-bold">{filteredScientists.length} ta olim</span>
            </div>

            {/* Scientists List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
              {filteredScientists.map((sci) => {
                const isActive = sci.id === activeScientist.id;
                return (
                  <div
                    key={sci.id}
                    onClick={() => setActiveScientistId(sci.id)}
                    className={`p-3 flex items-center gap-3 cursor-pointer transition select-none ${
                      isActive ? "bg-blue-50/80 border-l-4 border-blue-600" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={sci.avatar}
                        alt={sci.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      {sci.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-800 truncate">{sci.name}</h4>
                        <span className="text-[10px] text-slate-400">{sci.time}</span>
                      </div>
                      <div className="text-[11px] text-blue-600 font-medium truncate">{sci.degree}</div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{sci.lastMsg}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* RIGHT CHAT AREA */}
          <section className="flex-1 flex flex-col bg-slate-100 overflow-hidden relative">
            
            {/* Active Header */}
            <div className="h-16 px-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeScientist.avatar}
                    alt={activeScientist.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-blue-500/30"
                  />
                  {activeScientist.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                      {activeScientist.name}
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      {activeScientist.degree}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span className="truncate max-w-[200px] md:max-w-md">{activeScientist.dept}</span>
                    <span className="text-emerald-600 font-medium">• {activeScientist.syncStatus}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
                ID: {activeScientist.id}
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto tg-chat-bg space-y-3">
              {activeScientist.messages.map((msg) => {
                const isMe = msg.sender === "me";
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-[85%] sm:max-w-md ${
                        isMe
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm shadow-md"
                          : "bg-white text-slate-800 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200"
                      } p-3.5`}
                    >
                      {msg.category && (
                        <div
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1.5 ${
                            isMe ? "bg-white/20 text-white" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          🏷️ {msg.category}
                        </div>
                      )}
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <div
                        className={`mt-1 text-right text-[10px] flex items-center justify-end gap-1 ${
                          isMe ? "text-blue-100" : "text-slate-400"
                        }`}
                      >
                        <span>{msg.time}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ============================================================== */}
            {/* BOTTOM INPUT BAR (CATEGORY PICKER ▲ STRICTLY INSIDE INPUT) */}
            {/* ============================================================== */}
            <div className="bg-white border-t border-slate-200 p-2.5 sm:p-3 relative z-20">
              
              {/* Floating Category Popover (Triggered by ▲) */}
              {categoryPopoverOpen && (
                <div className="absolute bottom-full mb-2 left-10 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 flex items-center gap-1.5 flex-wrap max-w-sm sm:max-w-md">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setCategoryPopoverOpen(false);
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Attachment Modal (📎) */}
              {attachmentOpen && (
                <div className="absolute bottom-full mb-2 left-3 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 w-56 z-30 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setInputText((prev) => prev + " [📷 Rasm biriktirildi] ");
                      setAttachmentOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 text-slate-700"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    <span>Rasm va Video</span>
                  </button>
                  <button
                    onClick={() => {
                      setInputText((prev) => prev + " [📄 Ilmiy_maqola.pdf] ");
                      setAttachmentOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 text-slate-700"
                  >
                    <FileText className="w-4 h-4 text-purple-500" />
                    <span>Hujjat & Maqola</span>
                  </button>
                  <button
                    onClick={() => {
                      setInputText((prev) => prev + " 📊 [So'rovnoma: Mavzu tanlash] ");
                      setAttachmentOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 text-slate-700"
                  >
                    <BarChart2 className="w-4 h-4 text-amber-500" />
                    <span>So'rovnoma (Poll)</span>
                  </button>
                  <button
                    onClick={() => {
                      setInputText((prev) => prev + " https://doi.org/10.1016/tiu.2026 ");
                      setAttachmentOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 text-slate-700"
                  >
                    <LinkIcon className="w-4 h-4 text-emerald-500" />
                    <span>Scopus / DOI Havola</span>
                  </button>
                </div>
              )}

              {/* Emoji Picker (😊) */}
              {emojiOpen && (
                <div className="absolute bottom-full mb-2 right-14 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 w-64 z-30 grid grid-cols-5 gap-2 text-xl text-center">
                  {["👍", "🎓", "📚", "🔬", "💡", "🚀", "⚖️", "✅", "🤝", "🎯"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setInputText((prev) => prev + emoji);
                        setEmojiOpen(false);
                      }}
                      className="hover:bg-slate-100 p-1 rounded transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Main Input Container */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                
                {/* 1. 📎 Paperclip (Attach) */}
                <button
                  type="button"
                  onClick={() => {
                    setAttachmentOpen(!attachmentOpen);
                    setCategoryPopoverOpen(false);
                    setEmojiOpen(false);
                  }}
                  className="p-1.5 text-slate-500 hover:text-blue-600 rounded-xl transition"
                  title="📎 Biriktirish"
                >
                  <Paperclip className="w-5 h-5 -rotate-45" />
                </button>

                {/* 2. ▲ UPWARD CHEVRON ARROW ICON (Inside Input Bar) */}
                <button
                  type="button"
                  onClick={() => {
                    setCategoryPopoverOpen(!categoryPopoverOpen);
                    setAttachmentOpen(false);
                    setEmojiOpen(false);
                  }}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-extrabold flex items-center justify-center transition border border-blue-200"
                  title="Xabar toifasini tanlash (▲)"
                >
                  ▲
                </button>

                {/* 3. Active Category Chip inside Input */}
                {category && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1 shrink-0">
                    <span>{category}</span>
                    <button
                      type="button"
                      onClick={() => setCategory("")}
                      className="hover:text-red-200 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* 4. Text Input Field */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  placeholder="Olimga xabar yozing (fayl, so'rovnoma biriktirish mumkin)..."
                  className="flex-1 bg-transparent text-xs focus:outline-none px-1 text-slate-800"
                />

                {/* 5. 😊 Emoji Button */}
                <button
                  type="button"
                  onClick={() => {
                    setEmojiOpen(!emojiOpen);
                    setAttachmentOpen(false);
                    setCategoryPopoverOpen(false);
                  }}
                  className="p-1.5 text-slate-500 hover:text-amber-500 rounded-xl transition"
                  title="😊 Emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                {/* 6. ✈️ Blue Send Button */}
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#229ed9] to-[#0088cc] text-white flex items-center justify-center hover:shadow-md hover:opacity-95 active:scale-95 transition shrink-0"
                >
                  <Send className="w-4 h-4 rotate-45 -mr-0.5 -mt-0.5" />
                </button>
              </div>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}
