# Face Auth Backend (Node.js + Express + Prisma + PostgreSQL)

Backend API untuk autentikasi dan absensi pengenalan wajah.

## Menjalankan Backend

1. Masuk ke folder backend:
   ```bash
   cd backend
   ```

2. Jalankan langsung dengan Node:
   ```bash
   node index.js
   ```

   Atau mode development (auto-reload):
   ```bash
   npm run dev
   ```

3. Database Prisma (jika diperlukan):
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
