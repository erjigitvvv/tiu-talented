# TIU-Talented Workspace Development Rules

Bu qoidalar "TIU-Talented" (Tashkent International University) loyihasida ishlab chiqish, arxitektura va kodlash standartlarini belgilaydi.

## 1. Loyiha va Hamkorlik Standartlari
- **Rol:** Agent — Yetakchi Full-Stack Dasturchi va Texnik PM; Foydalanuvchi — Product Owner (PO).
- **Muloqot tili:** O'zbek tili (professional, aniq va texnik jihatdan to'g'ri).
- **Git Repo:** `https://github.com/erjigitvvv/tiu-talented.git` (asosiy tarmoq: `main`).

## 2. Texnologik Stack va Muhit
- **Frontend & Backend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Ma'lumotlar bazasi & ORM:** Prisma ORM, SQLite (`prisma/dev.db`).
- **Autentifikatsiya:** JWT sessiya (`tiu_auth_token` HttpOnly cookie), `bcryptjs` parol xeshlash.
- **Operatsion tizim:** Windows (PowerShell muhiti, port 3001/3000 boshqaruvi).

## 3. Windows va Prisma DLL Lock Qoidasi
- Prisma sxemasi o'zgarganda (`prisma/schema.prisma`) yoki `npx prisma generate` / `npx prisma db push` ishlatilganda, fondagi `npm run dev` serverini to'xtatish zarur. Aks holda `query_engine-windows.dll.node` fayli Windows tomonidan band qilinib, `EPERM` xatoligi yuzaga keladi.
- Migratsiya yoki push tugagach, dev server qayta ishga tushiriladi.

## 4. Ruxsatlar va Rollar Ierarxiyasi
1. **Mehmon (Public):**
   - Navbar faqat 4 ta havola: `Asosiy` (`/`), `Jamoalar` (`/teams`), `Iqtidorlilar` (`/talents`), `Tanlovlar va Grantlar` (`/opportunities`) hamda `Kirish` (`/login`).
2. **Talaba (Student):**
   - Registratsiya oson: Ism, Familiya, Telefon, Parol (Email ixtiyoriy).
   - Kabinet faqat 6 ta bo'lim:
     1. Umumiy kabinet (`/dashboard/student`)
     2. E‘lonlar va tanlovlar (`/dashboard/student/opportunities`)
     3. Yangiliklar (`/dashboard/student/news`)
     4. Mening arizalarim (`/dashboard/student/applications`)
     5. Yutuqlarim (`/dashboard/student/achievements`)
     6. Profil (`/dashboard/student/profile`): Dekanat, Yo'nalish, Guruh, Kurs, GPA, Ko'nikmalar.
3. **Bo'lim Rahbari (Department Head):**
   - KPI monitoring, Iqtidorlilar ro'yxati, Jamoalar katalogi va a'zolik moderatsiyasi, Grant va tanlovlar yaratish, Arizalarni ko'rib chiqish va yutuqlarni verifikatsiya qilish.
4. **Admin:**
   - Butun platforma, foydalanuvchilar va ma'lumotlar bazasi ustidan to'liq nazorat.

## 5. Kod Sifati va Tekshiruv
- Har qanday yangi xususiyat qo'shilgandan so'ng:
  1. `npm run build` orqali TypeScript va Next.js marshrutlar tekshiriladi.
  2. Git commit qilinib, `origin main` ga yuklanadi.
  3. Serverning 200 OK javobi tasdiqlanadi.
