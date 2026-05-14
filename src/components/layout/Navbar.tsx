'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled
        ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none'
        : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center
                            group-hover:bg-green-400 transition-colors">
              <span className="text-black text-lg font-black">CA</span>
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Cricket Arena</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/#game-modes">Game Modes</NavLink>
            <NavLink href="/#technology">Technology</NavLink>
            <NavLink href="/#franchise">Franchise</NavLink>
            <NavLink href="/arenas">Arenas</NavLink>
          </div>

          {/* CTA + Theme toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/account"
              className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">
              My Account
            </Link>
            <Link href="/book" className="btn-primary text-sm px-5 py-2.5">
              Book Now
            </Link>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex flex-col justify-center items-center gap-1.5"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-black/95 border-t border-slate-200 dark:border-white/5 px-4 py-6 flex flex-col gap-4">
          <MobileLink href="/#game-modes" onClick={() => setMenuOpen(false)}>Game Modes</MobileLink>
          <MobileLink href="/#technology" onClick={() => setMenuOpen(false)}>Technology</MobileLink>
          <MobileLink href="/#franchise" onClick={() => setMenuOpen(false)}>Franchise</MobileLink>
          <MobileLink href="/arenas" onClick={() => setMenuOpen(false)}>Arenas</MobileLink>
          <MobileLink href="/account" onClick={() => setMenuOpen(false)}>My Account</MobileLink>
          <Link href="/book" onClick={() => setMenuOpen(false)}
            className="btn-primary justify-center mt-2">
            Book Now
          </Link>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}
      className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-green-500 group-hover:w-full transition-all duration-300" />
    </Link>
  )
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick}
      className="text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white text-base font-medium transition-colors py-1">
      {children}
    </Link>
  )
}
