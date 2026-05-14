'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/client'

type Tab = 'bookings' | 'stats' | 'profile'

const MODE_LABELS: Record<string, string> = {
  solo_target: 'Target Chase',
  solo_speed: 'Speed Challenge',
  solo_accuracy: 'Nets Practice',
  solo_survival: 'Survival Mode',
  '1v1_over_battle': 'Full Innings',
  '1v1_powerplay_duel': 'Target Chase',
  '1v1_last_man_standing': 'Sudden Death',
  gully_match: 'Batting Carnival',
  gully_street_league: 'Elimination',
  gully_tournament: 'Powerplay Slog',
}

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>('bookings')
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<{ id: string; arena: string; date: string; slot: string; duration: number; mode: string; status: string; score: number | null }[]>([])
  const [stats, setStats] = useState<{ totalRuns: number; totalBalls: number; strikeRate: number; fours: number; sixes: number; highScore: number; totalSessions: number } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email ?? '' })
        fetchBookings(data.user.id)
        fetchStats(data.user.id)
      }
      setLoading(false)
    })
  }, [])

  async function fetchBookings(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('bookings')
      .select('id, arena_id, date, slot_time, duration, game_mode, player_name, booking_status')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(20)

    if (error || !data) return

    const arenaIds = [...new Set(data.map(b => b.arena_id))]
    const { data: arenas } = await supabase
      .from('arenas')
      .select('id, name')
      .in('id', arenaIds)
    const arenaMap = new Map((arenas ?? []).map(a => [a.id, a.name]))

    setBookings(data.map(b => ({
      id: b.id,
      arena: arenaMap.get(b.arena_id) ?? 'Unknown Arena',
      date: b.date,
      slot: b.slot_time,
      duration: b.duration,
      mode: MODE_LABELS[b.game_mode] ?? b.game_mode,
      status: b.booking_status,
      score: null,
    })))
  }

  async function fetchStats(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('player_stats')
      .select('runs, balls_faced, strike_rate, fours, sixes')
      .eq('user_id', userId)

    if (error || !data) return

    const totalRuns = data.reduce((s, r) => s + (r.runs ?? 0), 0)
    const totalBalls = data.reduce((s, r) => s + (r.balls_faced ?? 0), 0)
    const totalFours = data.reduce((s, r) => s + (r.fours ?? 0), 0)
    const totalSixes = data.reduce((s, r) => s + (r.sixes ?? 0), 0)
    const highScore = data.length > 0 ? Math.max(...data.map(r => r.runs ?? 0)) : 0
    const avgStrikeRate = data.length > 0 ? data.reduce((s, r) => s + (r.strike_rate ?? 0), 0) / data.length : 0

    setStats({
      totalRuns,
      totalBalls,
      strikeRate: Math.round(avgStrikeRate * 10) / 10,
      fours: totalFours,
      sixes: totalSixes,
      highScore,
      totalSessions: data.length,
    })
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white dark:bg-black pt-24 pb-20 flex items-center justify-center">
          <p className="text-slate-500 dark:text-gray-500">Loading...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white dark:bg-black pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">🔐</p>
            <h1 className="text-slate-900 dark:text-white text-2xl font-bold mb-2">Sign In Required</h1>
            <p className="text-slate-500 dark:text-gray-400 mb-6">Sign in to view your bookings and stats.</p>
            <a href="/book" className="btn-primary px-6 py-3">Book a Session →</a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const points = stats ? stats.totalRuns + stats.fours * 2 + stats.sixes * 3 : 0

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-black pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Profile header */}
          <div className="card-dark rounded-3xl p-6 mb-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20
                            flex items-center justify-center text-3xl shrink-0">
              🏏
            </div>
            <div className="flex-1">
              <h1 className="text-slate-900 dark:text-white text-xl font-bold">{user.email}</h1>
              <p className="text-slate-500 dark:text-gray-500 text-sm">Player account</p>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="text-center">
                  <div className="text-green-600 dark:text-green-400 font-black text-lg">{points.toLocaleString()}</div>
                  <div className="text-slate-400 dark:text-gray-600 text-[10px] uppercase tracking-widest">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-900 dark:text-white font-black text-lg">{stats?.totalSessions ?? 0}</div>
                  <div className="text-slate-400 dark:text-gray-600 text-[10px] uppercase tracking-widest">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-900 dark:text-white font-black text-lg">{stats?.highScore ?? 0}</div>
                  <div className="text-slate-400 dark:text-gray-600 text-[10px] uppercase tracking-widest">High Score</div>
                </div>
              </div>
            </div>
            <a href="/book" className="btn-primary text-sm px-5 py-2.5 shrink-0">Book a Session</a>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#1a1a1a] rounded-xl p-1 mb-8 overflow-x-auto">
            {([
              { id: 'bookings', label: '🗓️ Bookings' },
              { id: 'stats', label: '📊 My Stats' },
              { id: 'profile', label: '⚙️ Profile' },
            ] as { id: Tab; label: string }[]).map(t => (
              <button key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 text-sm font-medium py-2 px-4 rounded-lg whitespace-nowrap transition-all
                  ${tab === t.id
                    ? 'bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-gray-300'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab: Bookings */}
          {tab === 'bookings' && (
            <div className="space-y-4">
              {bookings.length === 0 && (
                <p className="text-center text-slate-500 dark:text-gray-500 py-12">No bookings yet. <a href="/book" className="text-green-500">Book your first session →</a></p>
              )}
              {bookings.map(b => (
                <div key={b.id} className="card-dark rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-slate-900 dark:text-white font-semibold">{b.arena}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                          ${b.status === 'confirmed'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                            : 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-500 dark:text-gray-500'}`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-gray-500 text-sm">
                        {new Date(b.date + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · {b.slot} · {b.duration} min
                      </p>
                      <p className="text-slate-400 dark:text-gray-600 text-xs mt-1">{b.mode}</p>
                    </div>
                    <div className="text-right">
                      {b.status === 'confirmed' && (
                        <div className="text-green-600 dark:text-green-400 text-sm font-medium">Confirmed ✓</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Stats */}
          {tab === 'stats' && (
            <div>
              {stats ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Runs', value: stats.totalRuns.toLocaleString(), icon: '🏏' },
                    { label: 'Strike Rate', value: stats.strikeRate.toString(), icon: '📈' },
                    { label: 'Boundaries', value: stats.fours.toString(), icon: '4️⃣' },
                    { label: 'Sixes', value: stats.sixes.toString(), icon: '6️⃣' },
                    { label: 'High Score', value: stats.highScore.toString(), icon: '🏆' },
                    { label: 'Total Balls', value: stats.totalBalls.toLocaleString(), icon: '⚾' },
                    { label: 'Sessions', value: stats.totalSessions.toString(), icon: '📋' },
                  ].map(s => (
                    <div key={s.label} className="card-dark rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">{s.icon}</div>
                      <div className="text-slate-900 dark:text-white font-black text-xl">{s.value}</div>
                      <div className="text-slate-400 dark:text-gray-600 text-xs mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 dark:text-gray-500 py-12">No stats yet. Play a session to earn stats!</p>
              )}
            </div>
          )}

          {/* Tab: Profile */}
          {tab === 'profile' && (
            <div className="max-w-xl space-y-5">
              <div className="card-dark rounded-2xl p-6">
                <h3 className="text-slate-900 dark:text-white font-semibold mb-5">Account</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-gray-600 uppercase tracking-widest mb-1.5">Email</label>
                    <input type="email" defaultValue={user.email} className="input-dark" disabled />
                  </div>
                  <a href="/book" className="btn-primary px-6 py-3 inline-block">Book a Session</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
