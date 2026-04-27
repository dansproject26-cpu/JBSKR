import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import JobCard from '@/components/JobCard'
import {
  TrendingUp, Shield, Zap, Users, ArrowRight,
  Building2, BarChart3, CreditCard, LineChart
} from 'lucide-react'
import type { Job } from '@/types'

export const metadata: Metadata = {
  title: 'FinWork – Lowongan Kerja Finance & Keuangan Terbaik Indonesia',
  description: 'Temukan lowongan kerja finance, perbankan, investasi, dan fintech terbaik di Indonesia. Ratusan posisi dari perusahaan terkemuka.',
}

const STATS = [
  { value: '2,400+', label: 'Lowongan Aktif' },
  { value: '850+', label: 'Perusahaan' },
  { value: '45,000+', label: 'Pencari Kerja' },
  { value: '89%', label: 'Tingkat Keberhasilan' },
]

const CATEGORIES = [
  { icon: BarChart3, name: 'Finance & Accounting', count: 380, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { icon: LineChart, name: 'Investment Banking', count: 215, color: 'text-gold-400', bg: 'bg-gold-400/10' },
  { icon: Zap, name: 'Fintech & Digital', count: 420, color: 'text-green-400', bg: 'bg-green-400/10' },
  { icon: Shield, name: 'Risk & Compliance', count: 180, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { icon: CreditCard, name: 'Tax & Audit', count: 290, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { icon: Building2, name: 'Corporate Finance', count: 155, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
]

const COMPANIES = [
  'Bank Central Asia', 'Mandiri Sekuritas', 'OJK', 'Gojek Financial',
  'PwC Indonesia', 'Deloitte', 'CIMB Niaga', 'Dana Indonesia'
]

export default async function HomePage() {
  const supabase = createServerSupabaseClient()
  const { data: featuredJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: latestJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative hero-gradient pt-32 pb-24 overflow-hidden noise-overlay">
        {/* Decorative orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/30 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
              <TrendingUp className="w-4 h-4 text-gold-400" />
              <span className="text-sm text-gold-400 font-medium">Platform Karir Finance #1 Indonesia</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-tight animate-fade-up">
              Karir Keuangan
              <br />
              <span className="gradient-text">Impian Anda</span>
              <br />
              Ada di Sini
            </h1>

            <p className="text-slate-400 text-lg md:text-xl mt-6 max-w-2xl mx-auto animate-fade-up animate-delay-100">
              Ribuan lowongan dari bank, fintech, sekuritas, dan konsultan keuangan
              terkemuka di Indonesia, diperbarui setiap hari.
            </p>

            <div className="mt-10 animate-fade-up animate-delay-200">
              <SearchBar />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 animate-fade-up animate-delay-300">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="font-display text-3xl text-gold-400">{value}</div>
                  <div className="text-slate-400 text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Temukan Berdasarkan Bidang</h2>
            <p className="section-subtitle mx-auto">
              Dari perbankan tradisional hingga fintech mutakhir — semua ada di FinWork.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map(({ icon: Icon, name, count, color, bg }) => (
              <Link
                key={name}
                href={`/jobs?category=${encodeURIComponent(name)}`}
                className="group card-hover flex items-center gap-4"
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm group-hover:text-gold-400 transition-colors">{name}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{count} lowongan</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED JOBS ─── */}
      {featuredJobs && featuredJobs.length > 0 && (
        <section className="py-20 bg-navy-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="section-title">Lowongan Unggulan</h2>
                <p className="text-slate-400 mt-2">Dipilih secara khusus untuk Anda</p>
              </div>
              <Link href="/jobs?featured=true" className="btn-secondary hidden md:flex items-center gap-2 text-sm">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {(featuredJobs as Job[]).map((job) => (
                <JobCard key={job.id} job={job} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── LATEST JOBS ─── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Lowongan Terbaru</h2>
              <p className="text-slate-400 mt-2">Update setiap hari dari perusahaan terpercaya</p>
            </div>
            <Link href="/jobs" className="btn-secondary hidden md:flex items-center gap-2 text-sm">
              Semua Lowongan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {(latestJobs as Job[] || []).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href="/jobs" className="btn-secondary inline-flex items-center gap-2">
              Lihat Semua Lowongan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── COMPANIES ─── */}
      <section className="py-16 bg-navy-800/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-sm font-medium uppercase tracking-wider mb-8">
            Dipercaya oleh perusahaan terkemuka
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {COMPANIES.map((company) => (
              <div
                key={company}
                className="bg-navy-700 border border-navy-600 rounded-xl px-5 py-3 text-slate-400 text-sm font-medium hover:border-gold-400/30 hover:text-gold-400 transition-all cursor-default"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-navy-700 to-navy-600 rounded-3xl p-10 md:p-16 overflow-hidden text-center border border-navy-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-gold-400/15 border border-gold-400/30 rounded-full px-4 py-1.5 mb-6">
                <Users className="w-4 h-4 text-gold-400" />
                <span className="text-sm text-gold-400 font-medium">Untuk Perusahaan</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
                Cari Talenta Finance Terbaik
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
                Pasang lowongan dan temukan kandidat keuangan berkualitas yang tepat untuk perusahaan Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/admin/dashboard" className="btn-primary px-8 py-3.5 text-base">
                  Pasang Lowongan Sekarang
                </Link>
                <Link href="/jobs" className="btn-secondary px-8 py-3.5 text-base">
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
