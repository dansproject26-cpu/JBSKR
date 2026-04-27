'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { TrendingUp, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: 'user' },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-400/20 border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="font-display text-2xl text-white mb-3">Pendaftaran Berhasil!</h2>
          <p className="text-slate-400 mb-6">
            Kami telah mengirimkan email konfirmasi ke <strong className="text-white">{email}</strong>. 
            Silakan cek inbox Anda untuk mengaktifkan akun.
          </p>
          <Link href="/auth/login" className="btn-primary inline-flex">
            Ke Halaman Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <div className="w-9 h-9 bg-gold-400 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl text-white">
            Fin<span className="text-gold-400">Work</span>
          </span>
        </Link>

        <div className="card border-navy-600">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl text-white">Buat Akun Baru</h1>
            <p className="text-slate-400 text-sm mt-2">Gratis selamanya — mulai karir keuangan Anda</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-400/10 border border-red-400/30 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="label">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  required
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Gunakan minimal 6 karakter dengan kombinasi huruf dan angka
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
              ) : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            Dengan mendaftar, Anda menyetujui{' '}
            <a href="#" className="text-gold-400 hover:underline">Syarat & Ketentuan</a>{' '}
            dan{' '}
            <a href="#" className="text-gold-400 hover:underline">Kebijakan Privasi</a> kami.
          </p>

          <p className="text-center text-sm text-slate-400 mt-5">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-gold-400 hover:underline font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
