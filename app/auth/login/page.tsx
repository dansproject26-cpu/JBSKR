'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { TrendingUp, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email atau password salah. Silakan coba lagi.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
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
            <h1 className="font-display text-2xl text-white">Selamat Datang</h1>
            <p className="text-slate-400 text-sm mt-2">Masuk ke akun FinWork Anda</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-400/10 border border-red-400/30 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="flex justify-between items-center mb-2">
                <label className="label mb-0">Password</label>
                <a href="#" className="text-xs text-gold-400 hover:underline">Lupa password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
              ) : (
                <>Masuk <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-navy-600" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-navy-800 px-3 text-slate-500">atau</span>
            </div>
          </div>

          {/* Demo credentials hint */}
          <div className="bg-navy-700/50 border border-navy-600 rounded-xl p-4 mb-6 text-center">
            <p className="text-xs text-slate-400">
              <strong className="text-white">Demo Admin:</strong> admin@finwork.id / admin123
            </p>
            <p className="text-xs text-slate-500 mt-1">atau daftar akun baru untuk mulai menjelajah</p>
          </div>

          <p className="text-center text-sm text-slate-400">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-gold-400 hover:underline font-medium">
              Daftar Gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
