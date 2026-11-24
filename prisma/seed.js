const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Tozalash boshlandi...");
  await prisma.achievementReview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.newsEvent.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log("Parollar shifrlanmoqda...");
  const adminPass = await bcrypt.hash("admin123", 10);
  const deptPass = await bcrypt.hash("dept123", 10);
  const studentPass = await bcrypt.hash("student123", 10);

  // 1. Super Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@tiu.uz",
      passwordHash: adminPass,
      role: "SUPER_ADMIN",
      profile: {
        create: {
          fullName: "Dr. Alisher Vohidov",
          faculty: "Rektorat",
          groupName: "Rahbariyat",
          courseYear: 0,
          gpa: 5.0,
          phone: "+998 71 200 00 01",
          bio: "TIU Bosh Administratori va Ilmiy ishlar bo'yicha mas'ul",
          avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
          skills: "Management, Education, Strategic Planning",
          totalPoints: 0,
        },
      },
    },
  });

  // 2. Department Coordinator
  const dept = await prisma.user.create({
    data: {
      email: "department@tiu.uz",
      passwordHash: deptPass,
      role: "DEPT_ADMIN",
      profile: {
        create: {
          fullName: "Shahzod Normatov",
          faculty: "Iqtidorli talabalar bilan ishlash bo'limi",
          groupName: "Bo'lim Boshlig'i",
          courseYear: 0,
          gpa: 5.0,
          phone: "+998 71 200 00 02",
          bio: "Iqtidorli yoshlar bilan ishlash bo'yicha yetakchi mutaxassis",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
          skills: "Talent Discovery, Mentorship, Event Organization",
          totalPoints: 0,
        },
      },
    },
  });

  // 3. Talaba 1: Jasur Aliyev (IT & Startap)
  const student1 = await prisma.user.create({
    data: {
      email: "jasur@student.tiu.uz",
      studentId: "TIU20230101",
      passwordHash: studentPass,
      role: "STUDENT",
      profile: {
        create: {
          fullName: "Jasur Aliyev",
          faculty: "Axborot Texnologiyalari",
          groupName: "IT-21-02",
          courseYear: 3,
          gpa: 4.85,
          phone: "+998 90 123 45 67",
          bio: "Full Stack Developer va AI tadqiqotchisi. Hackathonlar sovrindori.",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          skills: "TypeScript, Python, Machine Learning, Next.js, Docker",
          totalPoints: 175,
        },
      },
    },
  });

  // 4. Talaba 2: Madina Karimova (Ilmiy maqola & Iqtisod)
  const student2 = await prisma.user.create({
    data: {
      email: "madina@student.tiu.uz",
      studentId: "TIU20230205",
      passwordHash: studentPass,
      role: "STUDENT",
      profile: {
        create: {
          fullName: "Madina Karimova",
          faculty: "Xalqaro Iqtisodiyot",
          groupName: "EC-22-01",
          courseYear: 2,
          gpa: 4.92,
          phone: "+998 93 987 65 43",
          bio: "Iqtisodiy tahlilchi, xalqaro konferensiyalar ma'ruzachisi va Scopus muallifi.",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
          skills: "Financial Modeling, Data Analysis, Econometrics, IELTS 8.0",
          totalPoints: 140,
        },
      },
    },
  });

  // 5. Talaba 3: Behruz Toshmatov (Biznes & Yetakchilik)
  const student3 = await prisma.user.create({
    data: {
      email: "behruz@student.tiu.uz",
      studentId: "TIU20240312",
      passwordHash: studentPass,
      role: "STUDENT",
      profile: {
        create: {
          fullName: "Behruz Toshmatov",
          faculty: "Biznes va Boshqaruv",
          groupName: "BM-24-03",
          courseYear: 1,
          gpa: 4.65,
          phone: "+998 97 555 44 33",
          bio: "Startap asoschisi va yoshlar debatlar ligasi yetakchisi.",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
          skills: "Public Speaking, Product Management, Negotiation, Pitching",
          totalPoints: 90,
        },
      },
    },
  });

  // Yutuqlar yaratish
  // Jasur uchun tasdiqlangan va kutilayotgan yutuqlar
  await prisma.achievement.create({
    data: {
      userId: student1.id,
      title: "Respublika Yoshlar Hakatonida 1-o'rin",
      category: "IT & Startap",
      description: "AI yordamida suv resurslarini tejash ekotizimi loyihasi bilan mutlaq g'oliblik.",
      proofUrl: "https://example.com/certificates/hackathon-2025.pdf",
      status: "APPROVED",
      points: 90,
      adminFeedback: "Ajoyib natija! Universitet sha'nini munosib himoya qilganingiz uchun.",
      reviewedAt: new Date(),
    },
  });

  await prisma.achievement.create({
    data: {
      userId: student1.id,
      title: "Google Cloud Certified Associate Cloud Engineer",
      category: "IT & Startap",
      description: "Xalqaro darajadagi bulutli arxitektura sertifikati.",
      proofUrl: "https://example.com/certificates/gcp-cert.pdf",
      status: "APPROVED",
      points: 85,
      adminFeedback: "Xalqaro sertifikat tasdiqlandi.",
      reviewedAt: new Date(),
    },
  });

  // Kutilayotgan yutuq (Bo'lim tekshirishi uchun test navbati)
  await prisma.achievement.create({
    data: {
      userId: student1.id,
      title: "O'zbekiston Talabalar Dasturlash Olimpiadasi 2-darajali diplomi",
      category: "Olimpiada & Tanlov",
      description: "Algoritmik dasturlash (ICPC uslubi) bo'yicha 2-o'rin.",
      proofUrl: "https://example.com/certificates/icpc-uzb.pdf",
      status: "PENDING",
      points: 0,
    },
  });

  // Madina yutuqlari
  await prisma.achievement.create({
    data: {
      userId: student2.id,
      title: "Scopus Q2 jurnalida ilmiy maqola nashri",
      category: "Ilmiy maqola & Tadqiqot",
      description: "Markaziy Osiyoda raqamli iqtisodiyot rivojlanish omillari mavzusidagi maqola.",
      proofUrl: "https://example.com/papers/scopus-article-2025.pdf",
      status: "APPROVED",
      points: 90,
      adminFeedback: "Ilmiy salohiyat uchun yuqori ball berildi.",
      reviewedAt: new Date(),
    },
  });

  await prisma.achievement.create({
    data: {
      userId: student2.id,
      title: "IELTS 8.0 Xalqaro Til Sertifikati",
      category: "Olimpiada & Tanlov",
      description: "Listening: 8.5, Reading: 8.5, Writing: 7.5, Speaking: 7.5",
      proofUrl: "https://example.com/certificates/ielts-8.pdf",
      status: "APPROVED",
      points: 50,
      adminFeedback: "C1 darajasi tasdiqlandi.",
      reviewedAt: new Date(),
    },
  });

  // Behruz yutuqlari
  await prisma.achievement.create({
    data: {
      userId: student3.id,
      title: "Markaziy Osiyo Debat Turniri Finalchisi",
      category: "Ijtimoiy & Yetakchilik",
      description: "Xalqaro iqtisodiy forum doirasidagi parlament debatlari g'olibi.",
      proofUrl: "https://example.com/certificates/debate-winner.pdf",
      status: "APPROVED",
      points: 60,
      adminFeedback: "Universitet notiqlik san'ati bo'yicha yutug'i.",
      reviewedAt: new Date(),
    },
  });

  await prisma.achievement.create({
    data: {
      userId: student3.id,
      title: "Universitet 'Eng yaxshi yosh yetakchi' nishoni",
      category: "Ijtimoiy & Yetakchilik",
      description: "Talabalar Kengashi volontyorlik harakati koordinatori.",
      proofUrl: "https://example.com/certificates/leader-badge.pdf",
      status: "APPROVED",
      points: 30,
      adminFeedback: "Ijtimoiy faollik uchun tasdiqlandi.",
      reviewedAt: new Date(),
    },
  });

  // Tanlovlar va Grantlar
  const grant1 = await prisma.opportunity.create({
    data: {
      title: "TIU Rektor Granti 2026",
      type: "GRANT",
      description: "O'quv yili davomida eng yuqori ilmiy, akademik va innovatsion yutuqlarga erishgan 5 nafar iqtidorli talabaning to'lov-kontrakt summasi 100% to'lab beriladi.",
      requirements: "GPA kamida 4.5, kamida 2 ta tasdiqlangan ilmiy yoki startap yutuq, motivatsion xat.",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 kundan keyin
      quota: 5,
      award: "100% To'lov-kontrakt qoplami",
      status: "OPEN",
    },
  });

  const grant2 = await prisma.opportunity.create({
    data: {
      title: "Universitet 'Yil Iqtidorli Dasturchisi' Tanlovi",
      type: "COMPETITION",
      description: "Axborot texnologiyalari va raqamli innovatsiyalar sohasida eng zo'r dasturiy yechim yaratgan talabalar o'rtasida tanlov.",
      requirements: "GitHub loyiha havolasi, ishlayotgan MVP va arxitektura taqdimoti.",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 kundan keyin
      quota: 3,
      award: "1-o'rin: 15,000,000 UZS + Maxsus noutbuk",
      status: "OPEN",
    },
  });

  const grant3 = await prisma.opportunity.create({
    data: {
      title: "Dubay Xalqaro Texnologiyalar Konferensiyasi Stajirovkasi",
      type: "SCHOLARSHIP",
      description: "TIU tomonidan iqtidorli talabalarni xalqaro forum va stajirovkaga yuborish uchun to'liq moliyalashtiriladigan sayohat granti.",
      requirements: "IELTS 7.5+, startap yoki tadqiqot loyihasi mavjudligi.",
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      quota: 2,
      award: "To'liq sayohat, turar joy va stajirovka xarajatlari",
      status: "OPEN",
    },
  });

  // Namunaviy ariza topshirish
  await prisma.application.create({
    data: {
      opportunityId: grant1.id,
      userId: student1.id,
      coverLetter: "Hurmatli komissiya a'zolari! Men o'tgan o'quv yilida sun'iy intellekt bo'yicha Respublika hakatonida g'olib bo'ldim va universitetimiz nomini xalqaro arenalarda munosib himoya qilishda davom etmoqchiman.",
      portfolioUrl: "https://jasur-portfolio.dev",
      status: "UNDER_REVIEW",
      adminNotes: "Yutuqlari to'liq tekshirildi, intervyu bosqichiga tavsiya etildi.",
    },
  });

  await prisma.application.create({
    data: {
      opportunityId: grant2.id,
      userId: student1.id,
      coverLetter: "Dasturchilar tanlovi uchun o'zim yaratgan universitet elektron kutubxona va AI tavsiya tizimini taqdim etmoqchiman.",
      portfolioUrl: "https://github.com/jasur/tiu-ai-library",
      status: "SUBMITTED",
    },
  });

  // Yangiliklar va Tadbirdan lavhalar
  await prisma.newsEvent.create({
    data: {
      title: "TIU TechFest 2026: Iqtidorli talabalar o'z startap loyihalarini namoyish etdi",
      slug: "tiu-techfest-2026-startap-demo-day",
      summary: "Universitetimizda 50 dan ortiq yosh dasturchilar va innovatorlar ishtirokida yirik festival bo'lib o'tdi.",
      content: "Toshkent Xalqaro Universitetida iqtidorli yoshlarni qo'llab-quvvatlash maqsadida tashkil etilgan TIU TechFest 2026 yakunlandi. Tadbir davomida talabalar sun'iy intellekt, yashil energetika va fintech yo'nalishlarida o'z ishlanmalarini rektorat va soha mutaxassislariga namoyish etdilar. G'oliblarga qimmatbaho sovg'alar va universitet grantlari topshirildi.",
      type: "EVENT_HIGHLIGHT",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80",
      eventDate: new Date(),
      authorId: dept.id,
    },
  });

  await prisma.newsEvent.create({
    data: {
      title: "TIU Talabasi nufuzli xalqaro ilmiy mukofot sovrindori bo'ldi",
      slug: "tiu-talabasi-xalqaro-mukofot-sovrindori",
      summary: "Iqtisodiyot fakulteti 2-kurs talabasi Madina Karimova Singapurda o'tkazilgan xalqaro simpoziumda taqdirlandi.",
      content: "Universitetimiz iqtidorli talabalar safi yana bir g'alaba bilan boyidi. Madina Karimova o'zining ekonometrik modeli bilan 30 dan ortiq davlat yosh olimlari orasida eng yaxshi tadqiqot nominatsiyasiga sazovor bo'ldi.",
      type: "NEWS",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80",
      eventDate: new Date(),
      authorId: dept.id,
    },
  });

  console.log("Seeding muvaffaqiyatli yakunlandi!");
}

main()
  .catch((e) => {
    console.error("Seedingda xatolik:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
