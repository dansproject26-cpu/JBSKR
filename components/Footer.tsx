import Link from 'next/link'
import { TrendingUp, Mail, Linkedin, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-navy-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold-400 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-navy-900" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl text-white">
                Fin<span className="text-gold-400">Work</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Portal karir khusus bidang keuangan, perbankan, dan investasi terpercaya di Indonesia.
            </p>
            <div className="flex gap-3 mt-6">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-navy-700 rounded-lg flex items-center justify-center hover:bg-navy-600 hover:border-gold-400/30 border border-navy-600 transition-all"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="font-semibold text-white mb-4">Kategori Karir</h4>
            <ul className="space-y-2">
              {[
                ['Finance & Accounting', '/jobs?category=Finance+%26+Accounting'],
                ['Investment Banking', '/jobs?category=Investment+Banking'],
                ['Fintech & Digital', '/jobs?category=Fintech+%26+Digital'],
                ['Risk & Compliance', '/jobs?category=Risk+%26+Compliance'],
                ['Tax & Audit', '/jobs?category=Tax+%26+Audit'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-slate-400 hover:text-gold-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="font-semibold text-white mb-4">Untuk Perusahaan</h4>
            <ul className="space-y-2">
              {[
                ['Pasang Lowongan', '/admin/dashboard'],
                ['Cari Kandidat', '#'],
                ['Paket Premium', '#'],
                ['Employer Branding', '#'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-slate-400 hover:text-gold-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Notifikasi Lowongan</h4>
            <p className="text-slate-400 text-sm mb-4">
              Dapatkan info lowongan finance terbaru langsung di inbox Anda.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="email@anda.com"
                className="flex-1 bg-navy-700 border border-navy-600 text-white placeholder-slate-500 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-gold-400"
              />
              <button className="bg-gold-400 text-navy-900 p-2 rounded-lg hover:bg-gold-500 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2024 FinWork. Hak cipta dilindungi.
          </p>
          <div className="flex gap-6">
            {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Hubungi Kami'].map((item) => (
              <a key={item} href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
