---
name: tiu-database-management
description: >-
  TIU-Talented loyihasida Prisma ORM, SQLite ma'lumotlar bazasi sxemalari, Windows DLL fayl qulflanishini
  oldini olish va test ma'lumotlarini seed qilish bo'yicha operatsion qo'llanma.
---

# TIU Database Management Skill

Ushbu skill Prisma va SQLite ma'lumotlar bazasi bilan xavfsiz va barqaror ishlash qoidalarini belgilaydi.

## 1. Windows Muhitida Sxemani Yangilash Standarti
Windows operatsion tizimida Next.js dev server ishlab turganda `query_engine-windows.dll.node` fayli bloklanishi mumkin (`EPERM` xatosi).
Shuning uchun sxema yangilanganda ushbu qadamlar ketma-ketligi qo'llaniladi:

1. **Dev serverni to'xtatish:** `manage_task` orqali fondagi `npm run dev` taskini to'xtatish.
2. **Sxemani o'zgartirish:** `prisma/schema.prisma` fayliga yangi model yoki ustunlar kiritish.
3. **Bazaga qo'llash:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```
4. **Dev serverni qayta boshlash:** `npm run dev` buyrug'i `IsDaemon: true` parametri bilan fon rejimida ishga tushiriladi.

## 2. Test Ma'lumotlarini Yangilash (Seed Data)
Baza yangilanganda yoki tozalanganda barcha rollar bo'yicha test foydalanuvchilarini qayta tiklash:
```bash
node prisma/seed.js
```

### Standart Test Hisoblari:
- **Admin:** `admin@tiu.uz` / `admin123`
- **Bo'lim Rahbari:** `rahbar@tiu.uz` / `leader123`
- **Iqtidorli Talaba:** `jasur@student.tiu.uz` (yoki `+998901234567`) / `student123`
- **Iqtidorli Talaba 2:** `madina@student.tiu.uz` / `student123`
- **Iqtidorli Talaba 3:** `behruz@student.tiu.uz` / `student123`
