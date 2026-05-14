import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Cricket Arenas — Find Your Nearest Arena',
  description: 'Find Cricket Arena locations across Pakistan. Book a session at your nearest automated cricket arena.',
}

export default async function ArenasPage() {
  const supabase = await createClient()
  const { data: arenas } = await supabase
    .from('arenas')
    .select('id, name, city, address, hourly_rate, is_active, facilities, image_url')
    .eq('is_active', true)
    .order('name')

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-black pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-12">
            <p className="section-label mb-3">Locations</p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Find Your <span className="gradient-text">Nearest Arena</span>
            </h1>
            <p className="text-slate-600 dark:text-gray-400 max-w-xl leading-relaxed">
              Cricket Arena is expanding across Pakistan. Book at any location and your stats
              follow you everywhere.
            </p>
          </div>

          {/* Arena cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {(arenas ?? []).map((arena) => {
              const facs = (arena.facilities as string[]) ?? []
              return (
              <div key={arena.id}
                className="card-dark rounded-2xl overflow-hidden hover:border-green-500/40
                           dark:hover:border-green-500/30 transition-all group flex flex-col">

                {/* Card header image area */}
                <div className="relative bg-gradient-to-br from-green-950/60 via-slate-900 to-black
                                flex items-center justify-center h-40 overflow-hidden">
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
                  <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300">🏟️</span>
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full z-10
                    bg-green-500/20 text-green-300 border border-green-500/30">
                    🟢 Open
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-slate-900 dark:text-white font-bold text-lg mb-0.5
                                 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {arena.name}
                  </h2>
                  <p className="text-slate-500 dark:text-gray-500 text-sm mb-1">{arena.city}</p>
                  <p className="text-slate-400 dark:text-gray-600 text-xs mb-4 leading-relaxed">{arena.address}</p>

                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {facs.map((f: string) => (
                      <span key={f}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md
                                   bg-slate-100 text-slate-600 dark:bg-[#1a1a1a] dark:text-gray-400">
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-3 text-center mb-4">
                    <div className="rounded-lg py-2.5 bg-slate-50 dark:bg-[#0d0d0d]">
                      <div className="text-sm font-bold text-green-600 dark:text-green-400">
                        🟢 Open
                      </div>
                      <div className="text-slate-500 dark:text-gray-600 text-[10px] mt-0.5">9 AM – 11 PM</div>
                    </div>
                    <div className="rounded-lg py-2.5 bg-slate-50 dark:bg-[#0d0d0d]">
                      <div className="text-sm font-bold text-yellow-500">★ New</div>
                      <div className="text-slate-500 dark:text-gray-600 text-[10px] mt-0.5">Join now</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-slate-500 dark:text-gray-500 text-xs">From</span>
                    <span className="text-slate-900 dark:text-white font-black text-lg">
                      PKR {(arena.hourly_rate as number)?.toLocaleString() ?? '1,200'}
                    </span>
                    <span className="text-slate-400 dark:text-gray-600 text-xs">/ 60 min</span>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Link href={`/arenas/${arena.id}`} className="btn-secondary text-sm py-2.5 justify-center">
                      View Details
                    </Link>
                    <Link href="/book" className="btn-primary text-sm py-2.5 justify-center">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            )})}

            {/* Coming soon card */}
            <div className="card-dark rounded-2xl p-6 flex flex-col items-center justify-center
                            text-center border-dashed min-h-[300px]">
              <div className="w-12 h-12 bg-slate-100 dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-2">Coming to Your City</h3>
              <p className="text-slate-500 dark:text-gray-600 text-sm leading-relaxed mb-4">
                We are expanding to Karachi, Peshawar, and Quetta.
              </p>
              <a href="/#franchise"
                className="text-green-600 dark:text-green-400 text-sm font-medium hover:text-green-500 dark:hover:text-green-300 transition-colors">
                Apply for a Franchise →
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
