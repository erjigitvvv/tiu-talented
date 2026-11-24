const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Baza tozalanmoqda...");
  await prisma.studentPortfolioOpportunity.deleteMany();
  await prisma.teamFeedback.deleteMany();
  await prisma.opportunityComment.deleteMany();
  await prisma.newsComment.deleteMany();
  await prisma.teamAchievementComment.deleteMany();
  await prisma.teamAchievement.deleteMany();
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
          telegram: "@vohidov_tiu",
          bio: "TIU Bosh Administratori va Ilmiy ishlar bo'yicha mas'ul prorektor",
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
          telegram: "@shahzod_normatov",
          bio: "Iqtidorli yoshlar bilan ishlash bo'yicha yetakchi mutaxassis va mentor",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
          skills: "Talent Discovery, Mentorship, Event Organization",
          totalPoints: 0,
        },
      },
    },
  });

  // 3. Talaba 1: Jasur Aliyev (Top-1)
  const student1 = await prisma.user.create({
    data: {
      email: "jasur@student.tiu.uz",
      phone: "+998901234567",
      studentId: "TIU20230101",
      passwordHash: studentPass,
      role: "STUDENT",
      profile: {
        create: {
          firstName: "Jasur",
          lastName: "Aliyev",
          fullName: "Jasur Aliyev",
          dekanat: "Axborot Texnologiyalari Dekanati",
          faculty: "Axborot Texnologiyalari",
          specialty: "Dasturiy injiniring",
          groupName: "SE-22-01",
          courseYear: 3,
          gpa: 4.92,
          phone: "+998 90 123 45 67",
          telegram: "@jasur_aliyev_dev",
          instagram: "@jasur_codes",
          bio: "Full Stack Developer va AI tadqiqotchisi. Respublika hakatoni g'olibi, xalqaro ICPC yarim finalchisi.",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          skills: "Next.js, TypeScript, Python, TensorFlow, Docker, PostgreSQL",
          totalPoints: 195,
        },
      },
    },
  });

  // 4. Talaba 2: Madina Karimova (Top-2)
  const student2 = await prisma.user.create({
    data: {
      email: "madina@student.tiu.uz",
      phone: "+998902345678",
      studentId: "TIU20230205",
      passwordHash: studentPass,
      role: "STUDENT",
      profile: {
        create: {
          firstName: "Madina",
          lastName: "Karimova",
          fullName: "Madina Karimova",
          dekanat: "Iqtisodiyot va Moliya Dekanati",
          faculty: "Iqtisodiyot",
          specialty: "Bank ishi va moliya",
          groupName: "BF-23-01",
          courseYear: 2,
          gpa: 4.88,
          phone: "+998 90 234 56 78",
          telegram: "@madina_karimova",
          instagram: "@madina_finance",
          bio: "Scopus Q2 ilmiy maqola muallifi. Markaziy Osiyo yosh iqtisodchilari forumi spikeri.",
          avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
          skills: "Financial Modeling, Data Analytics, Python, Econometrics, Stata",
          totalPoints: 160,
        },
      },
    },
  });

  // 5. Talaba 3: Behruz Shodiyev (Top-3)
  const student3 = await prisma.user.create({
    data: {
      email: "behruz@student.tiu.uz",
      phone: "+998903456789",
      studentId: "TIU20230310",
      passwordHash: studentPass,
      role: "STUDENT",
      profile: {
        create: {
          firstName: "Behruz",
          lastName: "Shodiyev",
          fullName: "Behruz Shodiyev",
          dekanat: "Axborot Texnologiyalari Dekanati",
          faculty: "Axborot Texnologiyalari",
          specialty: "Sun'iy intellekt va Data Science",
          groupName: "SE-22-01", // Guruhim bo'limida Jasur bilan bir guruhda!
          courseYear: 3,
          gpa: 4.81,
          phone: "+998 90 345 67 89",
          telegram: "@behruz_ai",
          instagram: "@behruz_iot",
          bio: "Startap asoschisi va IoT muhandisi. 'Yashil energiya' loyihasi bo'yicha Rektor granti sohibi.",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
          skills: "IoT, Arduino, Robotics, Computer Vision, React Native",
          totalPoints: 145,
        },
      },
    },
  });

  // 6. Talaba 4: Sevara Rasulova (Top-4)
  const student4 = await prisma.user.create({
    data: {
      email: "sevara@student.tiu.uz",
      phone: "+998904567890",
      studentId: "TIU20230412",
      passwordHash: studentPass,
      role: "STUDENT",
      profile: {
        create: {
          firstName: "Sevara",
          lastName: "Rasulova",
          fullName: "Sevara Rasulova",
          dekanat: "Filologiya va Xalqaro Tillar Fakulteti",
          faculty: "Xorijiy Tillar",
          specialty: "Amaliy tilshunoslik",
          groupName: "FL-21-03",
          courseYear: 4,
          gpa: 4.90,
          phone: "+998 90 456 78 90",
          telegram: "@sevara_debat",
          instagram: "@sevara_lingua",
          bio: "IELTS 8.5 va xalqaro debat chempioni. TEDxTIU tashkilotchisi va yoshlar elchisi.",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
          skills: "Debate, Public Speaking, Academic Translation, Content Strategy",
          totalPoints: 130,
        },
      },
    },
  });

  // 7. Talaba 5: Dilshod Usmonov (Top-5)
  const student5 = await prisma.user.create({
    data: {
      email: "dilshod@student.tiu.uz",
      phone: "+998905678901",
      studentId: "TIU20230522",
      passwordHash: studentPass,
      role: "STUDENT",
      profile: {
        create: {
          firstName: "Dilshod",
          lastName: "Usmonov",
          fullName: "Dilshod Usmonov",
          dekanat: "Menejment va Xalqaro Biznes Dekanati",
          faculty: "Menejment",
          specialty: "Loyiha boshqaruvi",
          groupName: "MN-22-01",
          courseYear: 3,
          gpa: 4.75,
          phone: "+998 90 567 89 01",
          telegram: "@dilshod_pm",
          instagram: "@dilshod_growth",
          bio: "Biznes inkubator rezidenti, bir qator talabalar startaplarining Product Owneri.",
          avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
          skills: "Agile, Scrum, Business Analytics, Product Growth",
          totalPoints: 115,
        },
      },
    },
  });

  // 8. Talaba 6: Nigora Yoqubova (Top-6)
  const student6 = await prisma.user.create({
    data: {
      email: "nigora@student.tiu.uz",
      phone: "+998906789012",
      studentId: "TIU20230635",
      passwordHash: studentPass,
      role: "STUDENT",
      profile: {
        create: {
          firstName: "Nigora",
          lastName: "Yoqubova",
          fullName: "Nigora Yoqubova",
          dekanat: "Axborot Texnologiyalari Dekanati",
          faculty: "Axborot Texnologiyalari",
          specialty: "Kiberxavfsizlik",
          groupName: "SE-22-01", // Guruhim bo'limida SE-22-01 da!
          courseYear: 2,
          gpa: 4.87,
          phone: "+998 90 678 90 12",
          telegram: "@nigora_cyber",
          instagram: "@nigora_sec",
          bio: "CTF (Capture The Flag) kiberxavfsizlik musobaqalarining doimiy sovrindori.",
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
          skills: "Ethical Hacking, Penetration Testing, Network Security, Linux",
          totalPoints: 110,
        },
      },
    },
  });

  // Student Portfolio Opportunities (Talabaning portfolioga biriktirilgan tanlovlari)
  await prisma.studentPortfolioOpportunity.createMany({
    data: [
      {
        userId: student1.id,
        title: "TIU Rektor Granti 2025",
        type: "GRANT",
        result: "Grant Sohibi (100% Kontrakt)",
        year: "2025",
      },
      {
        userId: student1.id,
        title: "Tashkent Open AI Hackathon",
        type: "HACKATHON",
        result: "1-o'rin (Bosh Mukofot)",
        year: "2026",
      },
      {
        userId: student2.id,
        title: "Markaziy Osiyo Yosh Iqtisodchilari Tanlovi",
        type: "COMPETITION",
        result: "G'olib (Oltin Medal)",
        year: "2025",
      },
    ],
  });

  // Yutuqlar (Achievements)
  await prisma.achievement.create({
    data: {
      userId: student1.id,
      title: "Respublika Yosh Dasturchilar Hakatonida 1-o'rin",
      category: "IT & Startap",
      description: "Toshkent shahrida o'tkazilgan 48 soatlik AI hakatonida universitet jamoasi sardori sifatida 1-o'rinni qo'lga kiritdi.",
      proofUrl: "https://example.com/certificates/hackathon-winner.pdf",
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
      userId: student2.id,
      title: "Scopus Q2 jurnalida ilmiy maqola nashri",
      category: "Ilmiy maqola & Tadqiqot",
      description: "Markaziy Osiyoda raqamli iqtisodiyot rivojlanish omillari mavzusidagi tahliliy maqola.",
      proofUrl: "https://example.com/papers/scopus-article-2025.pdf",
      status: "APPROVED",
      points: 90,
      adminFeedback: "Ilmiy salohiyat uchun yuqori ball berildi.",
      reviewedAt: new Date(),
    },
  });

  // Jamoalar (Teams)
  const team1 = await prisma.team.create({
    data: {
      name: "TIU AI & Robotics Lab",
      slug: "tiu-ai-robotics-lab",
      description: "Sun'iy intellekt, kompyuter ko'rishi va avtonom robototexnika sohasida xalqaro hakatonlarda universitet nomidan qatnashuvchi muhandislar jamoasi. Jamoaning asosiy maqsadi — aqlli transport tizimlari, kompyuter ko'rish algoritmlari va avtonom robotlarni sanoatda tatbiq etish.",
      category: "Hakaton jamoasi",
      faculty: "Axborot Texnologiyalari",
      status: "RECRUITING",
      neededRoles: "Mobile Developer (Flutter), UI/UX Designer, Embedded Engineer",
      avatarUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
      leaderId: student1.id,
      members: {
        create: [
          {
            userId: student1.id,
            role: "Sardor (Team Lead)",
            orderIndex: 1,
            status: "ACCEPTED",
          },
          {
            userId: student3.id,
            role: "Yordamchi (Vitse-sardor & Hardware Lead)",
            orderIndex: 2,
            status: "ACCEPTED",
            joinNote: "Datchiklar va apparat ta'minoti bo'yicha mas'ul",
          },
          {
            userId: student6.id,
            role: "Kiberxavfsizlik va QA Mutaxassisi",
            orderIndex: 3,
            status: "ACCEPTED",
            joinNote: "Tizim xavfsizligi va audit bo'yicha mas'ul",
          },
        ],
      },
    },
  });

  // 1-Tab: Izohlar va xulosalar (TeamFeedbacks)
  await prisma.teamFeedback.createMany({
    data: [
      {
        teamId: team1.id,
        authorName: "Dr. Alisher Vohidov",
        authorRole: "Ilmiy ishlar bo'yicha prorektor",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
        content: "TIU AI & Robotics jamoasi o'tgan o'quv yilida universitetimiz sha'nini xalqaro miqyosda munosib himoya qildi. Ularning AI algoritmlari amaliyotda yuqori samaradorlik ko'rsatmoqda.",
        rating: 5,
      },
      {
        teamId: team1.id,
        authorName: "Shahzod Normatov",
        authorRole: "Iqtidorli talabalar bo'limi boshlig'i",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        content: "Jamoa tarkibi juda jips shakllangan. Hardware va Software qismlari sinxron ishlaydi. Yangi a'zolar uchun ajoyib professional maktab bo'la oladi.",
        rating: 5,
      },
    ],
  });

  // Jamoa Yutuqlari (Team Achievements - 3-Tab uchun)
  await prisma.teamAchievement.create({
    data: {
      teamId: team1.id,
      title: "Markaziy Osiyo AI Hakatonida 1-o'rin va Bosh Mukofot",
      rank: "1-o'rin (Gran-pri)",
      dateAchieved: new Date("2026-04-12"),
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
      description: "Jamoamiz tomonidan ishlab chiqilgan sun'iy intellektga asoslangan aqlli transport tizimi xalqaro hakamlar tomonidan eng yuqori baholandi.",
      viewsCount: 342,
      likesCount: 58,
      comments: {
        create: [
          {
            authorName: "Dr. Alisher Vohidov",
            authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
            content: "Universitetimiz nomidan sizlarni samimiy tabriklayman! Rektorat tomonidan qo'llab-quvvatlash davom etadi.",
          },
          {
            authorName: "Madina Karimova",
            authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
            content: "Qoyilmaqom g'alaba! Barcha jamoa a'zolariga omad!",
          },
        ],
      },
    },
  });

  await prisma.teamAchievement.create({
    data: {
      teamId: team1.id,
      title: "Toshkent Robosumo Open 2026 Musobaqasida Oltin Medal",
      rank: "Oltin Medal",
      dateAchieved: new Date("2026-03-05"),
      imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
      description: "Avtonom robotlarning to'siqlarni yengish va muhandislik yechimlari bo'yicha 1-darajali sertifikat.",
      viewsCount: 198,
      likesCount: 42,
    },
  });

  // Tanlovlar va Grantlar
  const grant1 = await prisma.opportunity.create({
    data: {
      title: "TIU Rektor Granti 2026",
      type: "GRANT",
      description: "O'quv yili davomida eng yuqori ilmiy, akademik va innovatsion yutuqlarga erishgan iqtidorli talabalarning to'lov-kontrakt summasi 100% to'lab beriladi. Tanlov doirasida har bir fakultetdan saralab olingan iqtidor egalari moddiy va ma'naviy rag'batlantiriladi.",
      requirements: "1. GPA ko'rsatkichi kamida 4.5 bo'lishi shart.\n2. Kamida 2 ta tasdiqlangan ilmiy maqola yoki startap loyihasi mavjudligi.\n3. Rektor nomiga yozilgan motivatsion xat va portfolio taqdimoti.",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      quota: 5,
      award: "100% To'lov-kontrakt qoplami + 5,000,000 UZS bir martalik mukofot",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80",
      contactInfo: "Mas'ul: Iqtidorli talabalar bilan ishlash bo'limi, 305-xona. Tel: +998 71 200 00 02. Telegram: @tiu_grant_support",
      likesCount: 124,
      status: "OPEN",
      comments: {
        create: [
          {
            authorName: "Jasur Aliyev",
            authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
            content: "Ariza topshirish uchun maqolalar Scopus bazasida bo'lishi shartmi yoki OAK nashrlari ham qabul qilinadimi?",
          },
          {
            authorName: "Shahzod Normatov (Bo'lim)",
            authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
            content: "Salom Jasur! OAK va xalqaro konferensiya materiallari ham to'liq qabul qilinadi va baholanadi.",
          },
        ],
      },
    },
  });

  const grant2 = await prisma.opportunity.create({
    data: {
      title: "Universitet 'Yil Iqtidorli Dasturchisi' Tanlovi",
      type: "COMPETITION",
      description: "Axborot texnologiyalari va raqamli innovatsiyalar sohasida eng zo'r dasturiy yechim yaratgan talabalar o'rtasida tanlov.",
      requirements: "1. GitHub repozitoriy havolasi va to'liq arxitektura hujjati.\n2. Ishlayotgan MVP yoki veb/mobil ilova havolasi.\n3. 3 daqiqalik video-taqdimot.",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      quota: 3,
      award: "1-o'rin: 15,000,000 UZS + Maxsus noutbuk",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80",
      contactInfo: "IT Fakulteti Dekanati. Telegram: @tiu_dev_contest",
      likesCount: 88,
      status: "OPEN",
    },
  });

  // Yangiliklar (News & Events with comments & likes)
  const news1 = await prisma.newsEvent.create({
    data: {
      title: "TIU TechFest 2026: Iqtidorli talabalar o'z innovatsion loyihalarini namoyish etdi",
      slug: "tiu-techfest-2026-startap-demo-day",
      summary: "Universitetimizda 50 dan ortiq yosh dasturchilar, muhandislar va startapchilar ishtirokida yirik festival bo'lib o'tdi.",
      content: "Toshkent Xalqaro Universitetida iqtidorli yoshlarni qo'llab-quvvatlash maqsadida tashkil etilgan TIU TechFest 2026 ko'tarinki ruhda yakunlandi. Tadbir davomida talabalar sun'iy intellekt, yashil energetika va fintech yo'nalishlarida o'z loyihalarini rektorat va soha yetakchilariga namoyish etdilar. Hakamlar hay'ati yakuniy natijalarga ko'ra eng yaxshi 3 ta jamoani munosib mukofotladi.",
      type: "NEWS",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80",
      eventDate: new Date(),
      authorId: dept.id,
      likesCount: 96,
      comments: {
        create: [
          {
            authorName: "Madina Karimova",
            authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
            content: "Juda ajoyib tadbir bo'ldi! Barcha ishtirokchilarga katta rahmat.",
          },
          {
            authorName: "Behruz Shodiyev",
            authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
            content: "Keyingi mavsumda yanada yangi apparat ishlanmalar bilan qatnashamiz!",
          },
        ],
      },
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