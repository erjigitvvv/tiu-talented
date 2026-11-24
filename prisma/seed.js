const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Baza tozalanmoqda...");
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
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

  // 2. Department Coordinator (Bo'lim rahbari)
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

  // 3. Talaba 1: Jasur Aliyev
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
          bio: "Full Stack Developer va AI tadqiqotchisi. Respublika hakatoni g'olibi.",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          skills: "TypeScript, Python, Machine Learning, Next.js, Docker",
          totalPoints: 175,
        },
      },
    },
  });

  // 4. Talaba 2: Madina Karimova
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

  // 5. Talaba 3: Behruz Toshmatov
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

  // Yutuqlar
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

  // JAMOLAR (TEAMS) — Yangi modul
  const team1 = await prisma.team.create({
    data: {
      name: "TIU AI & Robotics Lab",
      slug: "tiu-ai-robotics-lab",
      description: "Sun'iy intellekt, kompyuter ko'rishi va avtonom robototexnika sohasida xalqaro hakatonlarda universitet nomidan qatnashuvchi muhandislar jamoasi.",
      category: "Hakaton jamoasi",
      faculty: "Axborot Texnologiyalari",
      status: "RECRUITING",
      neededRoles: "Mobile Developer (Flutter), UI/UX Designer, Embedded Engineer",
      avatarUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&auto=format&fit=crop&q=80",
      leaderId: student1.id,
      members: {
        create: [
          {
            userId: student1.id,
            role: "LEADER",
            status: "ACCEPTED",
          },
          {
            userId: student2.id,
            role: "RESEARCHER",
            status: "ACCEPTED",
            joinNote: "Ekonometrik tahlil va ma'lumotlar bilan ishlash bo'yicha mas'ul",
          },
        ],
      },
    },
  });

  const team2 = await prisma.team.create({
    data: {
      name: "EcoSmart Green Solutions",
      slug: "ecosmart-green-solutions",
      description: "Yashil energetika va ekologik toza startap loyihalarini yaratuvchi iqtidorli talabalar startapi.",
      category: "Startap",
      faculty: "Biznes va Boshqaruv",
      status: "RECRUITING",
      neededRoles: "Backend Developer, Marketing Manager, Pitch Master",
      avatarUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&auto=format&fit=crop&q=80",
      leaderId: student3.id,
      members: {
        create: [
          {
            userId: student3.id,
            role: "LEADER",
            status: "ACCEPTED",
          },
        ],
      },
    },
  });

  const team3 = await prisma.team.create({
    data: {
      name: "Fintech Alpha TIU",
      slug: "fintech-alpha-tiu",
      description: "Markaziy Osiyoda mikromoliya va raqamli to'lov tizimlarini avtomatlashtirish bo'yicha ilmiy-amaliy tadqiqot jamoasi.",
      category: "Ilmiy tadqiqot",
      faculty: "Xalqaro Iqtisodiyot",
      status: "RECRUITING",
      neededRoles: "Data Analyst, Frontend Dasturchi",
      avatarUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80",
      leaderId: student2.id,
      members: {
        create: [
          {
            userId: student2.id,
            role: "LEADER",
            status: "ACCEPTED",
          },
        ],
      },
    },
  });

  // Jamoaga a'zo bo'lish uchun kutilayotgan so'rov (Test uchun)
  await prisma.teamMember.create({
    data: {
      teamId: team2.id,
      userId: student1.id,
      role: "DEVELOPER",
      status: "PENDING",
      joinNote: "Loyiha uchun IoT datchiklar va veb boshqaruv panelini ishlab chiqishda yordam bermoqchiman.",
    },
  });

  // Tanlovlar va Grantlar
  const grant1 = await prisma.opportunity.create({
    data: {
      title: "TIU Rektor Granti 2026",
      type: "GRANT",
      description: "O'quv yili davomida eng yuqori ilmiy, akademik va innovatsion yutuqlarga erishgan 5 nafar iqtidorli talabaning to'lov-kontrakt summasi 100% to'lab beriladi.",
      requirements: "GPA kamida 4.5, kamida 2 ta tasdiqlangan ilmiy yoki startap yutuq, motivatsion xat.",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      quota: 3,
      award: "1-o'rin: 15,000,000 UZS + Maxsus noutbuk",
      status: "OPEN",
    },
  });

  // Namunaviy ariza
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

  // Yangiliklar
  await prisma.newsEvent.create({
    data: {
      title: "TIU TechFest 2026: Iqtidorli talabalar o'z startap loyihalarini namoyish etdi",
      slug: "tiu-techfest-2026-startap-demo-day",
      summary: "Universitetimizda 50 dan ortiq yosh dasturchilar va innovatorlar ishtirokida yirik festival bo'lib o'tdi.",
      content: "Toshkent Xalqaro Universitetida iqtidorli yoshlarni qo'llab-quvvatlash maqsadida tashkil etilgan TIU TechFest 2026 yakunlandi. Tadbir davomida talabalar sun'iy intellekt, yashil energetika va fintech yo'nalishlarida o'z ishlanmalarini rektorat va soha mutaxassislariga namoyish etdilar.",
      type: "EVENT_HIGHLIGHT",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80",
      eventDate: new Date(),
      authorId: dept.id,
    },
  });

  console.log("Seeding muvaffaqiyatli yakunlandi! Jamoalar qo'shildi.");
}

main()
  .catch((e) => {
    console.error("Seedingda xatolik:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
