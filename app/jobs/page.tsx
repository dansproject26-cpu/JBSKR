import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import JobCard from '@/components/JobCard'
import { SlidersHorizontal, Briefcase } from 'lucide-react'
import type { Job } from '@/types'

interface Props {
  searchParams: {
    q?: string
    category?: string
    location?: string
    type?: string
    level?: string
    featured?: string
  }
}

export const metadata: Metadata = {
  title: 'Lowongan Kerja Finance – Semua Posisi',
  description: 'Browse ratusan lowongan kerja finance, perbankan, investasi, dan fintech terbaik di Indonesia.',
}

const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
const LEVELS = ['Entry', 'Mid', 'Senior', 'Executive']
const CATEGORIES = [
  'Finance & Accounting',
  'Investment Banking',
  'Fintech & Digital',
  'Risk & Compliance',
  'Tax & Audit',
  'Corporate Finance',
]

export default async function JobsPage({ searchParams }: Props) {
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (searchParams.q) {
    query = query.or(
      `title.ilike.%${searchParams.q}%,company_name.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`
    )
  }
  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }
  if (searchParams.location) {
    query = query.ilike('location', `%${searchParams.location}%`)
  }
  if (searchParams.type) {
    query = query.eq('type', searchParams.type)
  }
  if (searchParams.level) {
    query = query.eq('level', searchParams.level)
  }
  if (searchParams.featured === 'true') {
    query = query.eq('is_featured', true)
  }

  const { data: jobs, count } = await query.limit(50)

  const buildFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams as Record<string, string>)
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    return `/jobs?${params.toString()}`
  }

  const hasFilters = !!(searchParams.q || searchParams.category || searchParams.location || searchParams.type || searchParams.level)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="bg-navy-800/50 border-b border-navy-700 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl text-white mb-6">
            {searchParams.q ? `Hasil untuk "${searchParams.q}"` :
             searchParams.category ? searchParams.category :
             'Semua Lowongan Finance'}
          </h1>
          <SearchBar
            initialQuery={searchParams.q || ''}
            initialCategory={searchParams.category || ''}
            initialLocation={searchParams.location || ''}
            compact
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gold-400" />
                  Filter
                </h3>
                {hasFilters && (
                  <a href="/jobs" className="text-xs text-gold-400 hover:underline">Reset</a>
                )}
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Kategori</h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <a
                      key={cat}
                      href={buildFilterUrl('category', cat)}
                      className={`block text-sm px-3 py-2 rounded-lg transition-all ${
                        searchParams.category === cat
                          ? 'bg-gold-400/15 text-gold-400 border border-gold-400/30'
                          : 'text-slate-400 hover:text-white hover:bg-navy-700'
                      }`}
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tipe</h4>
                <div className="space-y-1">
                  {TYPES.map((type) => (
                    <a
                      key={type}
                      href={buildFilterUrl('type', type)}
                      className={`block text-sm px-3 py-2 rounded-lg transition-all ${
                        searchParams.type === type
                          ? 'bg-gold-400/15 text-gold-400 border border-gold-400/30'
                          : 'text-slate-400 hover:text-white hover:bg-navy-700'
                      }`}
                    >
                      {type}
                    </a>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Level</h4>
                <div className="space-y-1">
                  {LEVELS.map((level) => (
                    <a
                      key={level}
                      href={buildFilterUrl('level', level)}
                      className={`block text-sm px-3 py-2 rounded-lg transition-all ${
                        searchParams.level === level
                          ? 'bg-gold-400/15 text-gold-400 border border-gold-400/30'
                          : 'text-slate-400 hover:text-white hover:bg-navy-700'
                      }`}
                    >
                      {level}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Job List */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-slate-400 text-sm">
                <span className="text-white font-semibold">{count || 0}</span> lowongan ditemukan
              </p>
            </div>

            {jobs && jobs.length > 0 ? (
              <div className="space-y-4">
                {(jobs as Job[]).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 card">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Tidak ada lowongan ditemukan</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Coba ubah kata kunci atau filter pencarian Anda.
                </p>
                <a href="/jobs" className="btn-primary inline-flex">
                  Lihat Semua Lowongan
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
