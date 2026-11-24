# 🎓 TIU-Talented Platformasi

> **Toshkent Xalqaro Universiteti (TIU)** iqtidorli talabalarini aniqlash, ularning yutuqlarini yagona reyestrda tasdiqlash hamda universitetda e'lon qilinadigan tanlovlar, stipendiyalar, grantlar va ilmiy/innovatsion loyihalarga arizalarni qabul qilish va boshqarish tizimi.

---

## 📌 Asosiy Xususiyatlar va Modullar

- **🏛️ Iqtidorli talabalar bilan ishlash bo'limi:**
  - Talabalar yuklagan yutuqlarni tekshirish (Moderatsiya: Approve + Ball berish / Reject + Izoh).
  - Yangi grantlar, tanlovlar va stipendiyalarni e'lon qilish.
  - Kelib tushgan arizalarni baholash va g'oliblarni saralash.
  - Tadbirdan lavhalar va universitet yangiliklarini joylashtirish.
- **🎓 Talaba Kabineti:**
  - Shaxsiy profil va raqamli portfolio (Bio, GPA, ko'nikmalar, ijtimoiy tarmoqlar).
  - Yutuqlar yuklash (dalil hujjatlari/sertifikatlar bilan).
  - Ochiq tanlov va grantlarga ariza topshirish.
  - Reytingdagi o'rnini va to'plagan ballarini kuzatish.
- **🌐 Ommaviy Portal:**
  - Jonli statistika va "Tadbirdan lavhalar" fotogalereyasi.
  - Iqtidorlar katalogi (Fakultet va ko'nikmalar bo'yicha filter).
  - Ommaviy reyting (Leaderboard).
  - Faol grantlar va tanlovlar e'lonlar taxtasi.

---

## 🛠️ Texnologik Stek

- **Frontend & Backend:** Next.js 14+ (App Router, Server Actions, Route Handlers, TypeScript)
- **Styling & UI:** Tailwind CSS, Radix UI / shadcn/ui, Lucide React
- **ORM & Database:** Prisma ORM + SQLite (Production uchun PostgreSQL)
- **Autentifikatsiya:** JWT sessiyalar + HttpOnly Secure Cookies, bcryptjs
- **Validatsiya:** Zod

---

## 🚀 O'rnatish va Ishga Tushirish

```bash
# 1. Repozitoriyani klonlash
git clone https://github.com/erjigitvvv/tiu-talented.git
cd tiu-talented

# 2. Paketlarni o'rnatish
npm install

# 3. Ma'lumotlar bazasini yangilash va test ma'lumotlarini yuklash (Seed)
npx prisma db push
npm run prisma:seed

# 4. Loyihani ishlab chiqish rejimida ishga tushirish
npm run dev
```

Brauzerda oching: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Test Foydalanuvchilari (Boshlang'ich hisoblar)

| Rol | Email | Parol | Tavsif |
|---|---|---|---|
| **Super Admin** | `admin@tiu.uz` | `admin123` | Bosh administrator |
| **Bo'lim Boshlig'i** | `department@tiu.uz` | `dept123` | Iqtidorli talabalar bilan ishlash bo'limi |
| **Talaba (IT)** | `jasur@student.tiu.uz` | `student123` | Jasur Aliyev (175 ball) |
| **Talaba (Iqtisodiyot)** | `madina@student.tiu.uz` | `student123` | Madina Karimova (140 ball) |
| **Talaba (Biznes)** | `behruz@student.tiu.uz` | `student123` | Behruz Toshmatov (90 ball) |

---

## 📄 Litsenziya
Ushbu loyiha Toshkent Xalqaro Universiteti (TIU) uchun maxsus ishlab chiqilgan.
