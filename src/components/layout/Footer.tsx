import Link from 'next/link'

const LINKS = {
  Platform: [
    { label: 'Book a Session', href: '/book' },
    { label: 'Game Modes', href: '/#game-modes' },
    { label: 'Arenas', href: '/arenas' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'My Account', href: '/account' },
  ],
  Company: [
    { label: 'About Us', href: '/#about' },
    { label: 'Franchise Info', href: '/#franchise' },
    { label: 'Technology', href: '/#technology' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Support: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-[#050505] border-t border-slate-200 dark:border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group w-fit">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center
                              group-hover:bg-green-400 transition-colors">
                <span className="text-black text-lg font-black">CA</span>
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">Cricket Arena</span>
            </Link>
            <p className="text-slate-500 dark:text-gray-500 text-sm leading-relaxed max-w-xs">
              Pakistan&apos;s first automated cricket arena franchise. Powered by ROBOWLER technology.
              Play solo, challenge a friend, or compete in gully cricket.
            </p>
            <div className="flex gap-4 mt-6">
              <SocialIcon label="Instagram" href="#">
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              </SocialIcon>
              <SocialIcon label="Facebook" href="#">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </SocialIcon>
              <SocialIcon label="Twitter" href="#">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </SocialIcon>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-slate-900 dark:text-white font-semibold text-sm mb-4 uppercase tracking-widest">
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-slate-500 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200 dark:border-[#1a1a1a] mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 dark:text-gray-600 text-sm">
            © {new Date().getFullYear()} Robowler Private Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-slate-400 dark:text-gray-600 text-sm">All arenas operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ href, label, children }: {
  href: string; label: string; children: React.ReactNode
}) {
  return (
    <a href={href} aria-label={label}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group
                 bg-slate-100 border border-slate-200 hover:border-green-500/50 hover:bg-green-500/10
                 dark:bg-[#111] dark:border-[#1f1f1f] dark:hover:border-green-500/50 dark:hover:bg-green-500/10">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-slate-500 dark:text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
        {children}
      </svg>
    </a>
  )
}
