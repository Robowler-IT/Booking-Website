'use client'

import { useTheme } from '@/components/providers/ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all
                 bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a1a] dark:hover:bg-[#252525]
                 border border-slate-200 dark:border-[#2a2a2a]"
    >
      {theme === 'dark' ? (
        /* Sun — switch to light */
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24" className="text-yellow-400">
          <circle cx="12" cy="12" r="5" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42
            M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        /* Moon — switch to dark */
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24" className="text-slate-700">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
