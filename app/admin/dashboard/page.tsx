'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import {
  TrendingUp, Plus, Pencil, Trash2, Eye, Star, Search,
  Briefcase, Users, BarChart3, CheckCircle2, XCircle, AlertCircle, LogOut
} from 'lucide-react'
import type { Job, Profile } from '@/types'

const CATEGORIES = [
  'Finance & Accounting', 'Investment Banking', 'Fintech & Digital',
  'Risk & Compliance', 'Tax & Audit', 'Corporate Finance'
]
const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
const LEVELS = ['Entry', 'Mid', 'Senior', 'Executive']

const emptyForm = {
  title: '', company_name: '', location: '', type: 'Full-time',
  category: 'Finance & Accounting', level: 'Mid', salary_min: '',
  salary_max: '', salary_currency: 'IDR', description: '',
  requirements: '', benefits: '', skills: '', is_featured: false, deadline: '',
}

export default function AdminDashboard() {
  const [user, setUser] = useState<Profile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'jobs' | 'new'>('jobs')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/auth/login'); return }

    const { data: profile } = await supabase
      .from('profiles').select('*').eq('id', session.user.id).single()

    if (!profile || profile.role !== 'admin') {
      router.push('/')
      return
    }
    setUser(profile)
    fetchJobs()
  }

  const fetchJobs = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('jobs').select('*').order('created_at', { ascending: false })
    setJobs(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    const payload = {
      title: form.title, company_name: form.company_name, location: form.location,
      type: form.type, category: form.category, level: form.level,
      salary_min: form.salary_min ? parseInt(form.salary_min) : null,
      salary_max: form.salary_max ? parseInt(form.salary_max) : null,
      salary_currency: form.salary_currency, description: form.description,
      requirements: form.requirements.split('\n').filter(Boolean),
      benefits: form.benefits.split('\n').filter(Boolean),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      is_featured: form.is_featured, is_active: true,
      deadline: form.deadline || null,
    }

    let error
    if (editId) {
      const res = await supabase.from('jobs').update(payload).eq('id', editId)
      error = res.error
    } else {
      const res = await supabase.from('jobs').insert(payload)
      error = res.error
    }

    if (error) {
      setMessage({ type: 'error', text: 'Gagal menyimpan. Pastikan Anda adalah admin.' })
    } else {
      setMessage({ type: 'success', text: editId ? 'Lowongan berhasil diperbarui!' : 'Lowongan berhasil ditambahkan!' })
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
      setActiveTab('jobs')
      fetchJobs()
    }
    setSubmitting(false)
  }

  const handleEdit = (job: Job) => {
    setForm({
      title: job.title, company_name: job.company_name, location: job.location,
      type: job.type, category: job.category, level: job.level,
      salary_min: job.salary_min?.toString() || '', salary_max: job.salary_max?.toString() || '',
      salary_currency: job.salary_currency, description: job.description,
      requirements: job.requirements.join('\n'), benefits: job.benefits.join('\n'),
      skills: job.skills.join(', '), is_featured: job.is_featured,
      deadline: job.deadline?.split('T')[0] || '',
    })
    setEditId(job.id)
    setActiveTab('new')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus lowongan ini?')) return
    await supabase.from('jobs').delete().eq('id', id)
    fetchJobs()
    setMessage({ type: 'success', text: 'Lowongan berhasil dihapus.' })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.is_active).length,
    featured: jobs.filter(j => j.is_featured).length,
    totalViews: jobs.reduce((acc, j) => acc + j.views, 0),
  }

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-navy-800 border-r border-navy-700 z-40 hidden md:flex flex-col">
        <div className="p-5 border-b border-navy-700">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-navy-900" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg text-white">
              Fin<span className="text-gold-400">Work</span>
            </span>
          </Link>
          <div className="mt-3 px-1">
            <span className="badge-gold text-xs">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: BarChart3, label: 'Semua Lowongan', tab: 'jobs' },
            { icon: Plus, label: 'Tambah Lowongan', tab: 'new' },
          ].map(({ icon: Icon, label, tab }) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as 'jobs' | 'new'); setEditId(null); setForm(emptyForm) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gold-400/15 text-gold-400'
                  : 'text-slate-400 hover:text-white hover:bg-navy-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-navy-700">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 bg-navy-600 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-gold-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.full_name || user?.email}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-2 py-2 rounded-lg hover:bg-navy-700 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="md:ml-64 min-h-screen">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Message */}
          {message && (
            <div className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-6 text-sm border ${
              message.type === 'success'
                ? 'bg-green-400/10 border-green-400/30 text-green-400'
                : 'bg-red-400/10 border-red-400/30 text-red-400'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
              <button onClick={() => setMessage(null)} className="ml-auto">
                <XCircle className="w-4 h-4 opacity-60 hover:opacity-100" />
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Briefcase, label: 'Total Lowongan', value: stats.total, color: 'text-blue-400' },
              { icon: CheckCircle2, label: 'Aktif', value: stats.active, color: 'text-green-400' },
              { icon: Star, label: 'Featured', value: stats.featured, color: 'text-gold-400' },
              { icon: Eye, label: 'Total Views', value: stats.totalViews.toLocaleString(), color: 'text-purple-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="card">
                <Icon className={`w-5 h-5 ${color} mb-2`} />
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Jobs Table */}
          {activeTab === 'jobs' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl text-white">Manajemen Lowongan</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari lowongan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-navy-700 border border-navy-600 text-white pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-gold-400 w-48"
                    />
                  </div>
                  <button
                    onClick={() => { setActiveTab('new'); setEditId(null); setForm(emptyForm) }}
                    className="btn-primary text-sm py-2 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Tambah
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20 text-slate-400">Memuat data...</div>
              ) : (
                <div className="space-y-3">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="card flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-white text-sm truncate">{job.title}</h3>
                          {job.is_featured && (
                            <span className="badge-gold text-xs">Featured</span>
                          )}
                          {!job.is_active && (
                            <span className="badge bg-red-400/15 text-red-400 border border-red-400/30 text-xs">Nonaktif</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {job.company_name} · {job.location} · {job.type} · {job.level}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{job.category} · {job.views} views</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          href={`/jobs/${job.id}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-white hover:bg-navy-700 rounded-lg transition-all"
                          title="Lihat"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(job)}
                          className="p-2 text-slate-400 hover:text-gold-400 hover:bg-navy-700 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-navy-700 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredJobs.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      Tidak ada lowongan ditemukan.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Form */}
          {activeTab === 'new' && (
            <div>
              <h2 className="font-display text-xl text-white mb-6">
                {editId ? 'Edit Lowongan' : 'Tambah Lowongan Baru'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="card space-y-5">
                  <h3 className="font-semibold text-white text-sm border-b border-navy-700 pb-3">Informasi Dasar</h3>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Judul Posisi *</label>
                      <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="misal: Senior Financial Analyst" className="input-field" />
                    </div>
                    <div>
                      <label className="label">Nama Perusahaan *</label>
                      <input type="text" required value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} placeholder="misal: Bank Central Asia" className="input-field" />
                    </div>
                    <div>
                      <label className="label">Lokasi *</label>
                      <input type="text" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="misal: Jakarta Selatan" className="input-field" />
                    </div>
                    <div>
                      <label className="label">Kategori *</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Tipe *</label>
                      <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input-field">
                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Level *</label>
                      <select value={form.level} onChange={e => setForm({...form, level: e.target.value})} className="input-field">
                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="card space-y-5">
                  <h3 className="font-semibold text-white text-sm border-b border-navy-700 pb-3">Gaji & Deadline</h3>
                  <div className="grid md:grid-cols-3 gap-5">
                    <div>
                      <label className="label">Gaji Minimum</label>
                      <input type="number" value={form.salary_min} onChange={e => setForm({...form, salary_min: e.target.value})} placeholder="misal: 10000000" className="input-field" />
                    </div>
                    <div>
                      <label className="label">Gaji Maximum</label>
                      <input type="number" value={form.salary_max} onChange={e => setForm({...form, salary_max: e.target.value})} placeholder="misal: 20000000" className="input-field" />
                    </div>
                    <div>
                      <label className="label">Deadline</label>
                      <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="input-field" />
                    </div>
                  </div>
                </div>

                <div className="card space-y-5">
                  <h3 className="font-semibold text-white text-sm border-b border-navy-700 pb-3">Detail Lowongan</h3>

                  <div>
                    <label className="label">Deskripsi Pekerjaan *</label>
                    <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={5} placeholder="Jelaskan tanggung jawab dan deskripsi pekerjaan..." className="input-field resize-none" />
                  </div>

                  <div>
                    <label className="label">Persyaratan (satu per baris)</label>
                    <textarea value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} rows={4} placeholder="S1 Akuntansi minimal&#10;Pengalaman 3 tahun&#10;Kemampuan analisis data" className="input-field resize-none" />
                  </div>

                  <div>
                    <label className="label">Benefit (satu per baris)</label>
                    <textarea value={form.benefits} onChange={e => setForm({...form, benefits: e.target.value})} rows={3} placeholder="Asuransi kesehatan&#10;Bonus tahunan&#10;WFH 2 hari seminggu" className="input-field resize-none" />
                  </div>

                  <div>
                    <label className="label">Skills (pisahkan dengan koma)</label>
                    <input type="text" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="Excel, Power BI, SAP, Financial Modeling" className="input-field" />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm({...form, is_featured: !form.is_featured})}
                      className={`w-10 h-5 rounded-full transition-colors relative ${form.is_featured ? 'bg-gold-400' : 'bg-navy-600'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${form.is_featured ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
                    </div>
                    <span className="text-sm text-slate-300">Jadikan Featured (tampil di halaman utama)</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                    {submitting ? <div className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" /> : null}
                    {editId ? 'Simpan Perubahan' : 'Tambahkan Lowongan'}
                  </button>
                  <button type="button" onClick={() => { setActiveTab('jobs'); setEditId(null); setForm(emptyForm) }} className="btn-secondary">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
