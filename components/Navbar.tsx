'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { TrendingUp, Menu, X, ChevronDown, Bell, User, LogOut, LayoutDashboard } from 'lucide-react'
import type { Profile } from '@/types'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<Profile | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setUser(data)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setUser(data)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/jobs', label: 'Lowongan' },
    { href: '/jobs?category=Finance+%26+Accounting', label: 'Finance' },
    { href: '/jobs?category=Investment+Banking', label: 'Investment' },
    { href: '/jobs?category=Fintech+%26+Digital', label: 'Fintech' },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-900/95 backdrop-blur-md border-b border-navy-700 shadow-xl shadow-navy-900/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gold-400 rounded-lg flex items-center justify-center group-hover:bg-gold-500 transition-colors">
              <TrendingUp className="w-4 h-4 text-navy-900" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl text-white">
              Fin<span className="text-gold-400">Work</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link px-4 py-2 rounded-lg hover:bg-navy-700 ${
                  pathname === link.href ? 'text-gold-400' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-navy-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-navy-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="text-sm text-slate-300 max-w-[120px] truncate">
                    {user.full_name || user.email}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-navy-800 border border-navy-600 rounded-xl shadow-xl overflow-hidden">
                    {user.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-navy-700 hover:text-white transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-navy-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost text-sm">
                  Masuk
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm py-2 px-5">
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-navy-700 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-navy-700 mt-2 pt-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block nav-link px-4 py-2 rounded-lg hover:bg-navy-700"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-navy-700 flex gap-2">
              {user ? (
                <button onClick={handleSignOut} className="btn-ghost text-sm flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-ghost text-sm flex-1 text-center">Masuk</Link>
                  <Link href="/auth/register" className="btn-primary text-sm flex-1 text-center">Daftar</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
