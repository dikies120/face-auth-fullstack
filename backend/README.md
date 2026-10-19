# Face Auth Backend (Node.js + Express + Prisma + PostgreSQL)

Backend API untuk autentikasi dan pendaftaran pengguna menggunakan Face Recognition Vector Embeddings (128-dimensi).

## Fitur Utama
1. **Registrasi Wajah (`POST /api/auth/register-face`)**:
   - Menerima `name`, `email`, `password`, `faceDescriptor` (128 floats array), dan `faceImageUrl` (base64 snapshot).
   - Validasi keaslian vektor wajah 128 dimensi.
   - Pengecekan anti-duplikasi wajah (mencegah satu orang mendaftar dengan akun berbeda).
   - Hashing password dengan `bcryptjs`.
2. **Verifikasi / Login Wajah (`POST /api/auth/verify-face`)**:
   - Menghitung Euclidean Distance antara wajah yang discan dengan wajah yang tersimpan di database.
   - Ambang batas pencocokan default `0.5` (dapat disesuaikan di `.env`).
3. **Penyimpanan Log Percobaan (`FaceLoginLog`)**:
   - Mencatat setiap percobaan login, skor jarak kemiripan wajah, dan status keberhasilan.

## Menjalankan Backend
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Sesuaikan file `.env` dengan kredensial PostgreSQL Anda:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/face_auth_db?schema=public"
   ```
4. Jalankan migrasi Prisma untuk membuat tabel di PostgreSQL:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Jalankan server dalam mode development:
   ```bash
   npm run dev
   ```
