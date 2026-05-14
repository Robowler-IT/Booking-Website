import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function ArenaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: arena } = await supabase
    .from('arenas')
    .select('*')
    .eq('id', id)
    .single()

  if (!arena) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">🏟️</p>
            <h1 className="text-slate-900 dark:text-white text-2xl font-bold mb-2">Arena Not Found</h1>
            <Link href="/arenas" className="text-green-600 dark:text-green-400 hover:text-green-500">← Back to Arenas</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-black pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-600 mb-8">
            <Link href="/arenas" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Arenas</Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-gray-400">{arena.name}</span>
          </div>

          {/* Hero */}
          <div className="rounded-3xl bg-gradient-to-br from-green-950/30 via-slate-900 to-black
                          border border-green-500/10 p-8 mb-10 relative overflow-hidden">
            <div className="absolute top-6 right-6 text-7xl opacity-10">🏟️</div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  🟢 Open Now
                </span>
                <span className="text-gray-400 text-xs">{arena.timings_open} – {arena.timings_close}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{arena.name}</h1>
              <p className="text-gray-300 mb-1">{arena.address}, {arena.city}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {/* About */}
              <div className="card-dark rounded-2xl p-6">
                <h2 className="text-slate-900 dark:text-white font-bold text-lg mb-3">About This Arena</h2>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{arena.description ?? 'A premium Cricket Arena experience.'}</p>
              </div>

              {/* Facilities */}
              <div className="card-dark rounded-2xl p-6">
                <h2 className="text-slate-900 dark:text-white font-bold text-lg mb-4">Facilities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(arena.facilities as string[] ?? []).map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <span className="text-green-600 dark:text-green-400">✓</span>
                      <span className="text-slate-600 dark:text-gray-400 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Pricing */}
              <div className="card-dark rounded-2xl p-5">
                <h3 className="text-slate-900 dark:text-white font-bold mb-4">Session Pricing</h3>
                <div className="space-y-3">
                  {[
                    { label: '30 Minutes (~50 balls)', price: Math.round(arena.hourly_rate * 0.55) },
                    { label: '60 Minutes (~100 balls)', price: arena.hourly_rate },
                    { label: '120 Minutes (~200 balls)', price: Math.round(arena.hourly_rate * 1.8) },
                  ].map(p => (
                    <div key={p.label}
                      className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-[#1a1a1a] last:border-0">
                      <span className="text-slate-600 dark:text-gray-400 text-sm">{p.label}</span>
                      <span className="text-slate-900 dark:text-white font-bold text-sm">
                        PKR {p.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book CTA */}
              <div className="card-dark rounded-2xl p-5 border-green-500/20">
                <p className="text-slate-600 dark:text-gray-400 text-sm mb-4">Ready to play?</p>
                <Link href="/book"
                  className="btn-primary w-full justify-center py-4 text-base glow-green mb-3">
                  🏏 Book a Session
                </Link>
                <p className="text-center text-slate-400 dark:text-gray-600 text-xs">
                  Booking takes less than 60 seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
