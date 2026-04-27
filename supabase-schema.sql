-- =============================================
-- FINWORK PORTAL - Supabase Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- COMPANIES TABLE
-- =============================================
create table public.companies (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  logo_url text,
  website text,
  description text,
  industry text,
  size text,
  location text,
  created_at timestamptz default now()
);

alter table public.companies enable row level security;

create policy "Companies are viewable by everyone"
  on public.companies for select using (true);

create policy "Only admins can insert companies"
  on public.companies for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can update companies"
  on public.companies for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- =============================================
-- JOBS TABLE
-- =============================================
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  company_id uuid references public.companies(id) on delete cascade,
  company_name text not null,
  company_logo text,
  location text not null,
  type text not null check (type in ('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote')),
  category text not null,
  level text not null check (level in ('Entry', 'Mid', 'Senior', 'Executive')),
  salary_min integer,
  salary_max integer,
  salary_currency text default 'IDR',
  description text not null,
  requirements text[] default '{}',
  benefits text[] default '{}',
  skills text[] default '{}',
  is_featured boolean default false,
  is_active boolean default true,
  views integer default 0,
  deadline timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.jobs enable row level security;

create policy "Active jobs are viewable by everyone"
  on public.jobs for select using (is_active = true);

create policy "Admins can view all jobs"
  on public.jobs for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can insert jobs"
  on public.jobs for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can update jobs"
  on public.jobs for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can delete jobs"
  on public.jobs for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- =============================================
-- JOB APPLICATIONS TABLE
-- =============================================
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  job_id uuid references public.jobs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  cover_letter text,
  resume_url text,
  created_at timestamptz default now(),
  unique(job_id, user_id)
);

alter table public.applications enable row level security;

create policy "Users can view own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Users can create applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all applications"
  on public.applications for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- =============================================
-- SEED DATA - Finance Companies
-- =============================================
insert into public.companies (id, name, logo_url, industry, location, size, description) values
  ('11111111-1111-1111-1111-111111111111', 'Bank Central Asia', null, 'Banking', 'Jakarta', '50,000+', 'Bank swasta terbesar di Indonesia'),
  ('22222222-2222-2222-2222-222222222222', 'Mandiri Sekuritas', null, 'Investment Banking', 'Jakarta', '1,000-5,000', 'Perusahaan sekuritas terkemuka di Indonesia'),
  ('33333333-3333-3333-3333-333333333333', 'OJK', null, 'Financial Regulation', 'Jakarta', '5,000-10,000', 'Otoritas Jasa Keuangan Indonesia'),
  ('44444444-4444-4444-4444-444444444444', 'Gojek Financial', null, 'Fintech', 'Jakarta', '10,000+', 'Layanan keuangan digital terdepan'),
  ('55555555-5555-5555-5555-555555555555', 'PwC Indonesia', null, 'Consulting', 'Jakarta', '5,000-10,000', 'Big Four accounting dan consulting firm');

-- =============================================
-- SEED DATA - Finance Jobs
-- =============================================
insert into public.jobs (
  title, company_id, company_name, location, type, category, level,
  salary_min, salary_max, description, requirements, benefits, skills, is_featured, deadline
) values
  (
    'Senior Financial Analyst',
    '11111111-1111-1111-1111-111111111111',
    'Bank Central Asia',
    'Jakarta Selatan',
    'Full-time',
    'Finance & Accounting',
    'Senior',
    15000000, 25000000,
    'Kami mencari Senior Financial Analyst berpengalaman untuk bergabung dengan tim analisis keuangan BCA. Anda akan bertanggung jawab dalam menganalisis laporan keuangan, membangun model keuangan, dan memberikan insight strategis kepada manajemen senior.',
    ARRAY['Minimal S1 Akuntansi/Keuangan/Ekonomi dari universitas ternama', 'Pengalaman minimal 5 tahun di bidang analisis keuangan', 'Mahir menggunakan Excel lanjutan dan Power BI', 'Memiliki sertifikasi CFA atau CPA menjadi nilai tambah', 'Kemampuan komunikasi yang baik dalam Bahasa Indonesia dan Inggris'],
    ARRAY['Asuransi kesehatan premium untuk keluarga', 'Bonus kinerja tahunan', 'Program pengembangan karir', 'Fasilitas olahraga & kesehatan', 'Tunjangan transportasi dan makan'],
    ARRAY['Financial Modeling', 'DCF Analysis', 'Excel', 'Power BI', 'SAP', 'Bloomberg'],
    true,
    now() + interval '30 days'
  ),
  (
    'Investment Banking Analyst',
    '22222222-2222-2222-2222-222222222222',
    'Mandiri Sekuritas',
    'Jakarta Pusat',
    'Full-time',
    'Investment Banking',
    'Entry',
    8000000, 15000000,
    'Bergabunglah dengan tim Investment Banking Mandiri Sekuritas sebagai Analyst. Anda akan terlibat langsung dalam transaksi M&A, IPO, dan advisory services untuk klien korporat terkemuka di Indonesia.',
    ARRAY['S1/S2 dari jurusan Keuangan, Akuntansi, atau bidang terkait', 'IPK minimal 3.5 dari universitas terakreditasi A', 'Kemampuan analitis dan kuantitatif yang kuat', 'Bersedia bekerja dengan jam kerja yang fleksibel', 'Fresh graduate atau pengalaman maksimal 2 tahun'],
    ARRAY['Gaji kompetitif + bonus deal', 'Training program intensif 3 bulan', 'Mentoring dari senior banker', 'Exposure ke transaksi kelas dunia', 'Kesempatan rotasi ke cabang regional'],
    ARRAY['Financial Analysis', 'Valuation', 'Pitch Deck', 'M&A', 'Capital Markets', 'PowerPoint'],
    true,
    now() + interval '21 days'
  ),
  (
    'Risk Management Specialist',
    '33333333-3333-3333-3333-333333333333',
    'OJK',
    'Jakarta',
    'Full-time',
    'Risk & Compliance',
    'Mid',
    12000000, 20000000,
    'OJK membuka kesempatan bagi profesional risk management untuk bergabung dalam tim pengawasan risiko lembaga keuangan. Posisi ini memegang peran strategis dalam menjaga stabilitas sistem keuangan Indonesia.',
    ARRAY['S1/S2 Keuangan, Hukum, atau bidang relevan', 'Pengalaman 3-5 tahun di bidang risk management atau compliance perbankan', 'Pemahaman mendalam tentang regulasi OJK dan Bank Indonesia', 'Sertifikasi FRM atau PRM menjadi keunggulan', 'Status WNI dan bersedia ditempatkan di seluruh Indonesia'],
    ARRAY['Gaji PNS + tunjangan jabatan', 'Asuransi kesehatan komprehensif', 'Perumahan dinas', 'Pensiun dan BPJS', 'Pelatihan internasional'],
    ARRAY['Risk Assessment', 'Basel III', 'Regulatory Compliance', 'Credit Risk', 'Operational Risk'],
    false,
    now() + interval '45 days'
  ),
  (
    'Product Manager - PayLater',
    '44444444-4444-4444-4444-444444444444',
    'Gojek Financial',
    'Jakarta (Hybrid)',
    'Full-time',
    'Fintech & Digital',
    'Senior',
    20000000, 35000000,
    'Pimpin pengembangan produk PayLater di ekosistem Gojek. Anda akan bekerja sama dengan tim engineering, design, dan business untuk menciptakan pengalaman keuangan digital terbaik bagi jutaan pengguna Indonesia.',
    ARRAY['Pengalaman 4+ tahun sebagai Product Manager di fintech/startup', 'Track record meluncurkan produk keuangan dari 0 to 1', 'Kemampuan data-driven decision making', 'Pengalaman dengan Agile/Scrum methodology', 'Pemahaman tentang regulasi fintech di Indonesia'],
    ARRAY['Saham/equity program', 'Asuransi jiwa dan kesehatan kelas 1', 'Work from anywhere policy', 'Learning & development budget', 'Flexible hours'],
    ARRAY['Product Strategy', 'Agile', 'SQL', 'User Research', 'A/B Testing', 'Fintech'],
    true,
    now() + interval '14 days'
  ),
  (
    'Tax Consultant - Transfer Pricing',
    '55555555-5555-5555-5555-555555555555',
    'PwC Indonesia',
    'Jakarta Selatan',
    'Full-time',
    'Tax & Audit',
    'Mid',
    13000000, 22000000,
    'PwC Indonesia mencari Tax Consultant spesialis Transfer Pricing untuk melayani klien multinasional. Anda akan membantu perusahaan internasional dalam menyusun dokumentasi transfer pricing yang compliant dengan regulasi OECD dan DJP.',
    ARRAY['S1/S2 Akuntansi atau Perpajakan', 'Pengalaman 2-4 tahun di konsultan pajak atau Big 4', 'Pemahaman mendalam tentang peraturan transfer pricing internasional', 'Kemampuan bahasa Inggris lisan dan tulisan yang sangat baik', 'Brevet AB menjadi nilai tambah'],
    ARRAY['Kompensasi kompetitif dengan review tahunan', 'Global mobility program', 'Professional development & certification support', 'Flexible work arrangement', 'Jaringan alumni PwC global'],
    ARRAY['Transfer Pricing', 'Tax Compliance', 'OECD Guidelines', 'Tax Planning', 'Excel', 'SAP'],
    false,
    now() + interval '28 days'
  ),
  (
    'Credit Analyst - Corporate Banking',
    '11111111-1111-1111-1111-111111111111',
    'Bank Central Asia',
    'Jakarta',
    'Full-time',
    'Finance & Accounting',
    'Mid',
    10000000, 18000000,
    'Bergabunglah sebagai Credit Analyst di divisi Corporate Banking BCA. Posisi ini berperan dalam menganalisis kelayakan kredit untuk nasabah korporat skala menengah hingga besar dengan portofolio mencapai triliunan rupiah.',
    ARRAY['S1 Keuangan, Akuntansi, atau Ekonomi', 'Pengalaman 2-4 tahun di credit analysis atau corporate banking', 'Kemampuan membaca dan menganalisis laporan keuangan korporat', 'Pemahaman tentang industri dan sektor bisnis yang beragam', 'Sertifikasi BSMR level 2 diutamakan'],
    ARRAY['Gaji pokok kompetitif + insentif', 'Asuransi kesehatan keluarga', 'Pinjaman karyawan dengan bunga preferensial', 'Program pelatihan berkelanjutan', 'Jenjang karir yang jelas'],
    ARRAY['Credit Analysis', 'Financial Statement Analysis', 'Risk Rating', 'Excel', 'Corporate Finance'],
    false,
    now() + interval '35 days'
  );

-- =============================================
-- FUNCTION: Increment job views
-- =============================================
create or replace function increment_job_views(job_id uuid)
returns void as $$
begin
  update public.jobs set views = views + 1 where id = job_id;
end;
$$ language plpgsql security definer;

-- =============================================
-- INDEXES for performance
-- =============================================
create index jobs_category_idx on public.jobs(category);
create index jobs_location_idx on public.jobs(location);
create index jobs_type_idx on public.jobs(type);
create index jobs_level_idx on public.jobs(level);
create index jobs_is_active_idx on public.jobs(is_active);
create index jobs_is_featured_idx on public.jobs(is_featured);
create index jobs_created_at_idx on public.jobs(created_at desc);
