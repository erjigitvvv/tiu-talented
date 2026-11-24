---
name: tiu-fullstack-workflow
description: >-
  TIU-Talented platformasida yangi imkoniyatlar (feature), sahifalar, API endpointlar va UI komponentlarni
  Next.js 14 App Router, TypeScript va Tailwind CSS asosida yaratish va sinovdan o'tkazish bo'yicha ko'rsatma.
---

# TIU-Talented Full-Stack Ishlash Skill-i

Ushbu skill TIU-Talented loyihasida sifatli, xatosiz va tezkor dasturlash jarayonini ta'minlaydi.

## 1. Yangi API Endpoint Qo'shish Jarayoni
1. **Marshrut manzili:** `src/app/api/<resurs>/route.ts` yoki `src/app/api/<resurs>/[id]/route.ts`.
2. **Autentifikatsiya tekshiruvi:**
   - Cookie'dan `tiu_auth_token` o'qiladi.
   - `jwt.verify(token, JWT_SECRET)` orqali foydalanuvchi aniqlanadi.
   - Ruxsat darajasi tekshiriladi (`role === 'STUDENT'` yoki `role === 'DEPARTMENT_HEAD' | 'ADMIN'`).
3. **Validatsiya va xatoliklar:**
   - Body maydonlari to'liqligi tekshiriladi.
   - Noto'g'ri so'rovlar uchun `NextResponse.json({ error: '...' }, { status: 400 })`.
   - Muvaffaqiyatli amallar uchun 200 yoki 201 qaytariladi.

## 2. Yangi Sahifa (Page) va UI Komponent Yaratish
1. **Server vs Client komponentlar:**
   - Ma'lumotlarni yuklash va SEO uchun Server Component afzal ko'riladi.
   - Interaktiv formalar, modal oynalar va holat (state) boshqaruvi uchun fayl boshiga `'use client'` yoziladi.
2. **Dizayn va Ranglar:**
   - TIU korporativ ko'k rangi: `blue-600` / `blue-700`.
   - Fon: `bg-slate-50` yoki `bg-white`.
   - Ikonkalar: `lucide-react` to'plami.
   - Barcha matnlar aniq, tushunarli o'zbek tilida yozilishi shart.

## 3. Kod Sifatini Tekshirish (Verification Gate)
1. Har doim o'zgarishlardan so'ng:
   ```bash
   npm run build
   ```
   orqali barcha 37+ marshrutlar va TypeScript tiplari xatosiz kompilyatsiya bo'lishini tekshirish.
2. Agar port 3000 band bo'lsa, avtomatik `http://localhost:3001` da ishlashi nazorat qilinadi.
3. Yangi o'zgarishlar Git orqali `https://github.com/erjigitvvv/tiu-talented.git` repo `main` tarmog'iga push qilinadi.
