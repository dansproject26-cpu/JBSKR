[README.md](https://github.com/user-attachments/files/27110438/README.md)
# FinWork Portal — Job Portal Finance Indonesia

Portal lowongan kerja khusus bidang keuangan, perbankan, dan fintech yang dibangun dengan Next.js 14, Tailwind CSS, dan Supabase.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Deploy**: Vercel (rekomendasi region: Singapore)
- **Fonts**: DM Serif Display + DM Sans (Google Fonts)

## 📦 Fitur

- ✅ Homepage modern dengan hero, statistik, kategori, dan featured jobs
- ✅ Pencarian & filter lowongan (kategori, tipe, level, lokasi)
- ✅ Halaman detail lowongan dengan SEO-friendly meta tags
- ✅ Autentikasi (login/register) via Supabase Auth
- ✅ Dashboard admin: CRUD lowongan (tambah, edit, hapus, featured)
- ✅ Responsive mobile-first design
- ✅ Sitemap.xml & robots.txt otomatis
- ✅ Open Graph & Twitter Card meta tags
- ✅ Row Level Security di Supabase (admin-only mutations)

## 🛠️ Cara Setup

### 1. Clone & Install

```bash
git clone <repo>
cd finwork
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Masuk ke **SQL Editor**
3. Copy & jalankan seluruh isi file `supabase-schema.sql`
4. Ini akan membuat semua tabel, RLS policies, dan seed data lowongan

### 3. Buat Admin User

Di Supabase Dashboard → Authentication → Users → Invite user:
- Email: `admin@finwork.id`
- Setelah terdaftar, jalankan SQL ini di SQL Editor:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@finwork.id';
```

Atau set password langsung:
```sql
-- Di Supabase Auth, gunakan "Reset Password" untuk set password
-- Default demo: admin123
```

### 4. Environment Variables

Buat file `.env.local` dari template:

```bash
cp .env.local.example .env.local
```

Isi dengan nilai dari Supabase Dashboard → Settings → API:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Jalankan Lokal

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy ke Vercel

### Cara Cepat:

1. Push code ke GitHub
2. Import repo di [vercel.com](https://vercel.com)
3. Tambahkan environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (URL production Anda)
4. Deploy! ✨

### Supabase Auth Settings:

Di Supabase → Authentication → URL Configuration:
- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs**: `https://your-domain.vercel.app/**`

## 📁 Struktur Proyek

```
finwork/
├── app/
│   ├── page.tsx              # Homepage
│   ├── jobs/
│   │   ├── page.tsx          # Daftar lowongan + filter
│   │   └── [id]/page.tsx     # Detail lowongan
│   ├── auth/
│   │   ├── login/page.tsx    # Halaman login
│   │   └── register/page.tsx # Halaman register
│   ├── admin/
│   │   └── dashboard/page.tsx # Admin panel
│   ├── sitemap.ts            # Sitemap otomatis
│   └── robots.ts             # Robots.txt
├── components/
│   ├── Navbar.tsx            # Navigasi responsif
│   ├── Footer.tsx            # Footer lengkap
│   ├── SearchBar.tsx         # Search dengan filter
│   └── JobCard.tsx           # Card lowongan
├── lib/
│   ├── supabase.ts           # Client-side Supabase
│   └── supabase-server.ts    # Server-side Supabase
├── types/
│   └── index.ts              # TypeScript types
└── supabase-schema.sql       # Schema lengkap + seed data
```

## 🎨 Design System

- **Primary**: Gold `#f5c842` — aksi utama, aksen premium
- **Background**: Navy `#040d18` — elegant dark mode
- **Typography**: DM Serif Display (judul) + DM Sans (body)
- **Border Radius**: 8px cards, 12px buttons
- **Animasi**: fade-up, fade-in CSS animations

## 🔒 Role & Permissions

| Aksi | User | Admin |
|------|------|-------|
| Lihat lowongan | ✅ | ✅ |
| Daftar/Login | ✅ | ✅ |
| Input lowongan | ❌ | ✅ |
| Edit/Hapus lowongan | ❌ | ✅ |
| Akses admin dashboard | ❌ | ✅ |

---

Dibuat dengan ❤️ untuk komunitas karir keuangan Indonesia.
