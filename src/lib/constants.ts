export const DEKANATLAR = [
  "Axborot Texnologiyalari Dekanati",
  "Xalqaro Iqtisodiyot va Moliya Dekanati",
  "Biznes va Menejment Dekanati",
  "Xalqaro Huquq va Diplomatiya Dekanati",
  "Xorijiy Tillar va Filologiya Dekanati",
];

export const FACULTIES = DEKANATLAR;

export const SPECIALTIES: Record<string, string[]> = {
  "Axborot Texnologiyalari Dekanati": [
    "Dasturiy Injiniring (Software Engineering)",
    "Sun'iy Intellekt va Katta Ma'lumotlar (AI & Data Science)",
    "Kiberxavfsizlik (Cybersecurity)",
    "Kompyuter Tizimlari va Tarmoqlari",
    "Raqamli Dizayn va UI/UX",
  ],
  "Xalqaro Iqtisodiyot va Moliya Dekanati": [
    "Xalqaro Iqtisodiy Munosabatlar",
    "Bank Ishi va Audit",
    "Korporativ Moliya va Investitsiyalar",
    "Ekonometrika va Moliyaviy Tahlil",
  ],
  "Biznes va Menejment Dekanati": [
    "Biznes Boshqaruvi (Business Administration)",
    "Startap va Innovatsion Menejment",
    "Marketing va Raqamli Tijorat",
    "Logistika va Ta'minot Zanjiri Boshqaruvi",
  ],
  "Xalqaro Huquq va Diplomatiya Dekanati": [
    "Xalqaro Ommaviy Huquq",
    "Biznes va Xalqaro Tijorat Huquqi",
    "Xalqaro Munozaralar va Diplomatiya",
  ],
  "Xorijiy Tillar va Filologiya Dekanati": [
    "Amaliy Ingliz Tili va Tarjimashunoslik",
    "Xitoy Tili va Sharqshunoslik",
    "Koreys Tili va Madaniyati",
  ],
};

export const ALL_SPECIALTIES = Object.values(SPECIALTIES).flat();

export const ACHIEVEMENT_CATEGORIES = [
  "IT & Startap",
  "Ilmiy maqola & Tadqiqot",
  "Olimpiada & Tanlov",
  "Sport & Madaniyat",
  "Ijtimoiy & Yetakchilik",
];

export const OPPORTUNITY_TYPES = [
  { value: "GRANT", label: "Universitet Granti" },
  { value: "SCHOLARSHIP", label: "Stipendiya Dasturi" },
  { value: "COMPETITION", label: "Ko'rik-tanlov" },
  { value: "HACKATHON", label: "Hakaton & Demo Day" },
];
