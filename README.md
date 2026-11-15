# Sprint

Standup async untuk tim kecil. SaaS multi-tenant dengan tipe aman dari database sampai UI.

## Tech stack

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 15 App Router, React 19 |
| API | tRPC 11 (end-to-end typesafe) |
| Database | Prisma + PostgreSQL |
| Auth | NextAuth |
| Styling | Tailwind CSS 3 |
| Validasi | Zod |
| Bahasa | TypeScript 5.7 |

## Alur singkat

1. Anggota masuk lewat NextAuth.
2. Update harian dikirim: isi pekerjaan dan status (lancar, biasa, terhambat).
3. Server menyimpan lewat tRPC dan Prisma, anggota dibuat otomatis.
4. Feed workspace menampilkan update terbaru.
5. Rencana: ringkasan mingguan, streak, undang anggota lewat tautan.

## Menjalankan

```bash
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

Buka `http://localhost:3000`.

```bash
npm run build
npm run typecheck
npx prisma studio
```

## Struktur

```
prisma/schema.prisma              Workspace, Member, Update
src/server/api/trpc.ts            context, procedure, guard
src/server/api/routers/update.ts  query dan mutation update
src/trpc/react.tsx                client tRPC
src/app/page.tsx                  feed dan form
```

## Status

Scaffold berjalan, build lulus. Butuh `DATABASE_URL` menuju Postgres sebelum dipakai.
