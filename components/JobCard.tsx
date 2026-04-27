import Link from 'next/link'
import { MapPin, Clock, Briefcase, DollarSign, Star, ArrowRight } from 'lucide-react'
import type { Job } from '@/types'

interface JobCardProps {
  job: Job
  featured?: boolean
}

const typeColors: Record<string, string> = {
  'Full-time': 'badge-blue',
  'Part-time': 'badge-green',
  'Contract': 'badge bg-purple-400/15 text-purple-400 border border-purple-400/30',
  'Internship': 'badge bg-orange-400/15 text-orange-400 border border-orange-400/30',
  'Remote': 'badge-green',
}

const levelColors: Record<string, string> = {
  Entry: 'badge bg-cyan-400/15 text-cyan-400 border border-cyan-400/30',
  Mid: 'badge-blue',
  Senior: 'badge bg-violet-400/15 text-violet-400 border border-violet-400/30',
  Executive: 'badge-gold',
}

function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (!min && !max) return 'Negotiable'
  const fmt = (n: number) =>
    currency === 'IDR'
      ? `${(n / 1_000_000).toFixed(0)}jt`
      : `$${(n / 1000).toFixed(0)}k`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `ab ${fmt(min)}`
  return `sd ${fmt(max!)}`
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Hari ini'
  if (days === 1) return 'Kemarin'
  if (days < 7) return `${days} hari lalu`
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`
  return `${Math.floor(days / 30)} bulan lalu`
}

export default function JobCard({ job, featured = false }: JobCardProps) {
  const initials = job.company_name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <article
        className={`relative bg-navy-800 border rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-navy-900/60 ${
          job.is_featured
            ? 'border-gold-400/30 hover:border-gold-400/50 bg-gradient-to-br from-navy-800 to-navy-700'
            : 'border-navy-600 hover:border-navy-500'
        }`}
      >
        {job.is_featured && (
          <div className="absolute top-4 right-4">
            <span className="flex items-center gap-1 text-xs font-semibold text-gold-400 bg-gold-400/10 border border-gold-400/30 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-gold-400" /> Featured
            </span>
          </div>
        )}

        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0 w-12 h-12 bg-navy-600 rounded-xl flex items-center justify-center text-sm font-bold text-gold-400 border border-navy-500">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-1 pr-16">
              {job.title}
            </h3>
            <p className="text-slate-400 text-sm mt-0.5">{job.company_name}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className={typeColors[job.type] || 'badge'}>
                <Briefcase className="w-3 h-3" />
                {job.type}
              </span>
              <span className={levelColors[job.level] || 'badge'}>
                {job.level}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-slate-500" />
                {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {timeAgo(job.created_at)}
              </span>
            </div>

            {job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-navy-700 text-slate-300 px-2 py-0.5 rounded border border-navy-600"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="text-xs text-slate-500">+{job.skills.length - 4}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-navy-700">
          <span className="text-xs text-slate-500">{job.category}</span>
          <span className="flex items-center gap-1 text-xs font-medium text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Lihat Detail <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </article>
    </Link>
  )
}
