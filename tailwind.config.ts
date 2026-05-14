import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        arena: {
          // Dark theme surface scale — warm-dark, not pure black
          bg:      '#0d0d0f',
          surface: '#141416',
          card:    '#1a1a1d',
          raised:  '#202024',
          border:  '#2a2a30',
          muted:   '#52525b',
          // Light theme
          'light-bg':     '#f7f8fa',
          'light-surface':'#ffffff',
          'light-card':   '#ffffff',
          'light-border': '#e4e4e7',
          'light-muted':  '#71717a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card-light': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-dark':  '0 1px 2px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
        'btn-green':  '0 4px 14px rgba(34,197,94,0.35)',
        'btn-green-hover': '0 6px 20px rgba(34,197,94,0.45)',
        'glow-sm':    '0 0 16px rgba(34,197,94,0.2)',
        'glow-md':    '0 0 32px rgba(34,197,94,0.25)',
        'glow-lg':    '0 0 60px rgba(34,197,94,0.2)',
      },
      animation: {
        'fade-up':      'fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':      'fadeIn 0.4s ease-out forwards',
        'slide-right':  'slideRight 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up':     'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in':     'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
        'bounce-slow':  'bounceSoft 2.4s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'float':        'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-grid': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.035'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}

export default config
