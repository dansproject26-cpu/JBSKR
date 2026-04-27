import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  MapPin, Clock, Briefcase, DollarSign, Users, Calendar,
  CheckCircle2, Gift, Code2, ArrowLeft, Share2, Bookmark, ExternalLink
} from 'lucide-react'
import type { Job } from '@/types'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { data: job } = await supabase
    .from('jobs')
    .select('title, company_name, description')
    .eq('id', params.id)
    .single()

  if (!job) return { title: 'Lowongan Tidak Ditemukan' }

  return {
    title: `${job.title} di ${job.company_name}`,
    description: job.description.slice(0, 160),
    openGraph: {
      title: `${job.title} – ${job.company_name} | FinWork`,
      description: job.description.slice(0, 160),
    },
  }
}

function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (!min && !max) return 'Negotiable'
  const fmt = (n: number) =>
    currency === 'IDR'
      ? `Rp ${n.toLocaleString('id-ID')}`
      : `$${n.toLocaleString()}`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `mulai ${fmt(min)}`
  return `s.d ${fmt(max!)}`
}

export default async function JobDetailPage({ params }: Props) {
  const supabase = createServerSupabaseClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (!job) notFound()

  // Increment views
  await supabase.rpc('increment_job_views', { job_id: params.id })

  const { data: relatedJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .eq('category', job.category)
    .neq('id', params.id)
    .limit(3)

  const initials = job.company_name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  const deadlineDate = job.deadline ? new Date(job.deadline) : null
  const daysLeft = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - Date.now()) / 86400000)
    : null

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-gold-400 transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-gold-400 transition-colors">Lowongan</Link>
          <span>/</span>
          <span className="text-slate-300">{job.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-navy-700 rounded-xl flex items-center justify-center text-xl font-bold text-gold-400 border border-navy-600 flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="font-display text-2xl md:text-3xl text-white leading-tight">
                    {job.title}
                  </h1>
                  <p className="text-gold-400 font-medium mt-1">{job.company_name}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="flex items-center gap-1.5 text-sm text-slate-400">
                      <MapPin className="w-4 h-4 text-slate-500" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-400">
                      <Briefcase className="w-4 h-4 text-slate-500" /> {job.type}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-400">
                      <Users className="w-4 h-4 text-slate-500" /> {job.level} Level
                    </span>
                  </div>
                </div>
              </div>

              {/* Salary & Deadline */}
              <div className="grid sm:grid-cols-2 gap-4 mt-6 p-4 bg-navy-700 rounded-xl">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Gaji</p>
                  <p className="font-semibold text-gold-400">
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                    {job.salary_currency === 'IDR' && <span className="text-slate-400 text-xs font-normal"> / bulan</span>}
                  </p>
                </div>
                {daysLeft !== null && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Deadline</p>
                    <p className={`font-semibold ${daysLeft <= 7 ? 'text-red-400' : 'text-white'}`}>
                      {daysLeft <= 0
                        ? 'Sudah berakhir'
                        : `${daysLeft} hari lagi`
                      }
                      <span className="text-slate-400 text-xs font-normal ml-1">
                        ({deadlineDate?.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })})
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Skills */}
              {job.skills.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs text-slate-500 mb-2">Skills yang Dibutuhkan</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill: string) => (
                      <span key={skill} className="badge bg-navy-700 text-slate-300 border border-navy-600 text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card">
              <h2 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gold-400 rounded-full block" />
                Deskripsi Pekerjaan
              </h2>
              <div className="text-slate-300 leading-relaxed space-y-3 text-sm">
                {job.description.split('\n').map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="card">
                <h2 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-400 rounded-full block" />
                  Persyaratan
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits.length > 0 && (
              <div className="card">
                <h2 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-green-400 rounded-full block" />
                  Benefit & Fasilitas
                </h2>
                <ul className="space-y-3">
                  {job.benefits.map((benefit: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <Gift className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Apply CTA */}
            <div className="card border-gold-400/20 bg-gradient-to-b from-navy-700 to-navy-800 sticky top-24">
              <div className="text-center mb-5">
                <p className="text-slate-400 text-sm mb-1">
                  {job.views} orang sudah melihat lowongan ini
                </p>
                <p className="text-xs text-slate-500">
                  Bergabunglah sebelum deadline!
                </p>
              </div>
              <Link href="/auth/register" className="btn-primary w-full text-center block py-3.5 text-base">
                Lamar Sekarang
              </Link>
              <p className="text-center text-xs text-slate-500 mt-3">
                Sudah punya akun?{' '}
                <Link href="/auth/login" className="text-gold-400 hover:underline">Masuk</Link>
              </p>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2 py-2.5">
                  <Bookmark className="w-4 h-4" /> Simpan
                </button>
                <button className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2 py-2.5">
                  <Share2 className="w-4 h-4" /> Bagikan
                </button>
              </div>
            </div>

            {/* Job Info */}
            <div className="card space-y-4">
              <h3 className="font-semibold text-white text-sm">Info Lowongan</h3>
              {[
                { icon: Briefcase, label: 'Tipe', value: job.type },
                { icon: Users, label: 'Level', value: job.level },
                { icon: MapPin, label: 'Lokasi', value: job.location },
                { icon: Code2, label: 'Kategori', value: job.category },
                { icon: Clock, label: 'Diposting', value: new Date(job.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Related Jobs */}
            {relatedJobs && relatedJobs.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-white text-sm mb-4">Lowongan Serupa</h3>
                <div className="space-y-3">
                  {relatedJobs.map((related: Job) => (
                    <Link
                      key={related.id}
                      href={`/jobs/${related.id}`}
                      className="block p-3 bg-navy-700 rounded-xl hover:bg-navy-600 transition-colors group"
                    >
                      <p className="text-sm font-medium text-white group-hover:text-gold-400 transition-colors line-clamp-1">
                        {related.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{related.company_name}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {related.location}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
