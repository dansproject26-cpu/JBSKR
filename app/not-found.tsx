import Link from 'next/link'
import { TrendingUp, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-display text-8xl text-navy-700 mb-6">404</div>
        <div className="w-14 h-14 bg-gold-400/20 border border-gold-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Search className="w-7 h-7 text-gold-400" />
        </div>
        <h1 className="font-display text-2xl text-white mb-3">Halaman Tidak Ditemukan</h1>
        <p className="text-slate-400 mb-8">
          Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          <Link href="/jobs" className="btn-secondary">
            Lihat Semua Lowongan
          </Link>
        </div>
      </div>
    </div>
  )
}
