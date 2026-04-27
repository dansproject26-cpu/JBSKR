'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Briefcase } from 'lucide-react'

const CATEGORIES = [
  'Finance & Accounting',
  'Investment Banking',
  'Fintech & Digital',
  'Risk & Compliance',
  'Tax & Audit',
]

const LOCATIONS = [
  'Jakarta',
  'Surabaya',
  'Bandung',
  'Bali',
  'Remote',
]

interface SearchBarProps {
  initialQuery?: string
  initialLocation?: string
  initialCategory?: string
  compact?: boolean
}

export default function SearchBar({
  initialQuery = '',
  initialLocation = '',
  initialCategory = '',
  compact = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)
  const [category, setCategory] = useState(initialCategory)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (location) params.set('location', location)
    if (category) params.set('category', category)
    router.push(`/jobs?${params.toString()}`)
  }

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari posisi, perusahaan..."
            className="input-field pl-10 text-sm"
          />
        </div>
        <button type="submit" className="btn-primary text-sm py-2.5 px-5 whitespace-nowrap">
          Cari
        </button>
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-navy-800/80 backdrop-blur border border-navy-600 rounded-2xl p-4 shadow-2xl shadow-navy-900/50"
    >
      <div className="flex flex-col md:flex-row gap-3">
        {/* Query */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Posisi, perusahaan, atau skill..."
            className="w-full bg-navy-700 border border-navy-600 text-white placeholder-slate-400 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all"
          />
        </div>

        {/* Category */}
        <div className="relative md:w-52">
          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none bg-navy-700 border border-navy-600 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="relative md:w-44">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full appearance-none bg-navy-700 border border-navy-600 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-all cursor-pointer"
          >
            <option value="">Semua Kota</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary md:px-8 whitespace-nowrap">
          <Search className="w-4 h-4 inline mr-2 md:hidden" />
          Cari Lowongan
        </button>
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-navy-700">
        <span className="text-xs text-slate-500">Populer:</span>
        {['Financial Analyst', 'Investment Banking', 'Risk Manager', 'Fintech PM', 'Tax Consultant'].map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => {
              setQuery(term)
              const params = new URLSearchParams({ q: term })
              router.push(`/jobs?${params.toString()}`)
            }}
            className="text-xs text-slate-400 hover:text-gold-400 hover:bg-navy-700 px-2.5 py-1 rounded-full border border-navy-600 hover:border-gold-400/40 transition-all"
          >
            {term}
          </button>
        ))}
      </div>
    </form>
  )
}
