'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BookingDraft } from '../BookingFlow'

interface Props {
  draft: BookingDraft
  onNext: (userId?: string, userEmail?: string) => void
  onBack: () => void
}

export default function StepAuth({ draft, onNext, onBack }: Props) {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email ?? '' })
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '' })
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  if (user) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Signed In</h2>
        <p className="text-slate-500 dark:text-gray-400 mb-2">{user.email}</p>
        <button
          onClick={() => { sessionStorage.removeItem('booking-draft'); onNext(user.id, user.email) }}
          className="btn-primary w-full justify-center py-4 mt-6"
        >
          Continue to Payment
        </button>
        <button onClick={onBack} className="btn-secondary w-full justify-center py-3 mt-3">
          Back
        </button>
      </div>
    )
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    sessionStorage.setItem('booking-draft', JSON.stringify(draft))
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleEmail = async () => {
    if (!email || !password) { setError('Email and password required'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      const { error: signUpErr } = await supabase.auth.signUp({ email, password })
      if (signUpErr) setError(signUpErr.message)
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sign In to Continue</h2>
      <p className="text-slate-500 dark:text-gray-500 text-sm mb-10">
        Create or sign into your Cricket Arena account to save your booking,
        track your stats, and appear on leaderboards.
      </p>

      {/* Booking recap pill */}
      <div className="card-dark rounded-xl px-4 py-3 mb-8 flex items-center gap-3">
        <span className="text-2xl">🏏</span>
        <div>
          <p className="text-slate-900 dark:text-white text-sm font-semibold">{draft.arenaName}</p>
          <p className="text-slate-500 dark:text-gray-500 text-xs">{draft.slots?.[0] ?? '—'} · {(draft.slots?.length ?? 0) * 30} min · {(draft.players || []).filter(Boolean).join(', ')}</p>
        </div>
        <div className="ml-auto text-green-600 dark:text-green-400 font-bold text-sm">
          PKR {((draft.slots?.length ?? 0) * 1500).toLocaleString()}
        </div>
      </div>

      {/* Google sign in */}
      <button onClick={handleGoogle} disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50
                   dark:bg-white dark:hover:bg-gray-100
                   text-slate-900 font-semibold py-4 rounded-xl transition-all mb-4
                   border border-slate-200 dark:border-transparent shadow-sm disabled:opacity-50">
        {loading ? (
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {loading ? 'Redirecting...' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-slate-200 dark:bg-[#1f1f1f]" />
        <span className="text-slate-400 dark:text-gray-600 text-xs">or</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-[#1f1f1f]" />
      </div>

      {/* Email sign in */}
      <div className="space-y-3 mb-8">
        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-dark" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-dark" />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button onClick={handleEmail} disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-50">
          {loading ? 'Please wait...' : 'Sign In'}
        </button>
        <p className="text-center text-slate-400 dark:text-gray-600 text-xs">
          New user? Enter email & password and we&apos;ll create your account.
        </p>
      </div>

      <button onClick={onBack} className="btn-secondary w-full justify-center py-3">
        Back to Review
      </button>
    </div>
  )
}
