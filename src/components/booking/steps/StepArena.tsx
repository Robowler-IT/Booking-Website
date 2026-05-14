'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BookingDraft } from '../BookingFlow'

interface ArenaData {
  id: string
  name: string
  city: string
  area: string
  address: string
  lat: number
  lng: number
  status: string
  hours: string
  rating: number
  reviews: number
  priceFrom: number
  pricePerHour: number
  features: string[]
  badge: string | null
  image: string
  phone: string
}

function mapArena(a: Record<string, unknown>): ArenaData {
  const facilities = (a.facilities as string[]) ?? []
  return {
    id: a.id as string,
    name: a.name as string,
    city: a.city as string,
    area: a.city as string,
    address: a.address as string,
    lat: a.lat as number,
    lng: a.lng as number,
    status: (a.is_active as boolean) ? 'Open' : 'Closed',
    hours: '9 AM – 11 PM',
    rating: 4.8,
    reviews: 0,
    priceFrom: 1200,
    pricePerHour: (a.hourly_rate as number) ?? 2200,
    features: facilities.slice(0, 4),
    badge: null,
    image: '🏟️',
    phone: '',
  }
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/* ─── 3-D tilt card ─── */
function Card3D({ arena, selected, onSelect }: {
  arena: ArenaData & { distKm?: number }
  selected: boolean
  onSelect: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -18
    el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`
  }
  const handleMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      style={{ transition: 'transform 0.25s ease', transformStyle: 'preserve-3d' }}
      className={`cursor-pointer rounded-2xl border overflow-hidden
        ${selected
          ? 'border-green-500 ring-2 ring-green-500/30'
          : 'border-slate-200 dark:border-[#1f1f1f] hover:border-green-500/40'}`}
    >
      {/* Image area */}
      <div className="relative h-44 bg-gradient-to-br from-green-950/60 via-slate-900 to-black
                      dark:from-green-950/80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
        <span className="text-7xl drop-shadow-lg">{arena.image}</span>
        {arena.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider
                           bg-green-500 text-black px-2 py-1 rounded-full">
            {arena.badge}
          </span>
        )}
        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full
          ${arena.status === 'Open'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {arena.status === 'Open' ? '🟢 Open' : '🔴 Closed'}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 bg-white dark:bg-[#111]">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-sm leading-tight">{arena.name}</h3>
            <p className="text-slate-500 dark:text-gray-500 text-xs mt-0.5">{arena.area}, {arena.city}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-yellow-500 text-xs font-bold">★ {arena.rating}</div>
            <div className="text-slate-400 dark:text-gray-600 text-[10px]">{arena.reviews} reviews</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {arena.features.slice(0, 3).map(f => (
            <span key={f} className="text-[9px] text-slate-500 dark:text-gray-500
                                      bg-slate-100 dark:bg-[#1a1a1a] px-1.5 py-0.5 rounded">
              {f}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-green-600 dark:text-green-400 font-black text-base">
              PKR {arena.pricePerHour.toLocaleString()}
            </span>
            <span className="text-slate-400 dark:text-gray-600 text-[10px]"> /hr</span>
          </div>
          <div className="text-slate-400 dark:text-gray-600 text-xs">{arena.hours}</div>
        </div>

        {arena.distKm !== undefined && (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#1f1f1f] text-xs text-slate-400 dark:text-gray-600">
            📍 {arena.distKm < 1 ? `${Math.round(arena.distKm * 1000)} m` : `${arena.distKm.toFixed(1)} km`} away
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Simple pin map ─── */
function ArenaMap({ selectedId, onSelect }: {
  arenas?: (ArenaData & { distKm?: number })[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1f1f1f]" style={{ height: 280 }}>
      <iframe
        title="Arena Locations"
        src="https://www.openstreetmap.org/export/embed.html?bbox=74.28%2C31.44%2C74.45%2C31.55&layer=mapnik"
        className="w-full h-full"
        style={{ filter: 'saturate(0.7) contrast(0.9)' }}
      />
      {/* Overlay pins */}
      <div className="absolute inset-0 pointer-events-none">
        {/* DHA pin — approx position in this bbox */}
        <ArenaPin label="DHA" x="72%" y="62%" selected={selectedId === 'arena-dha-lahore'}
          onClick={() => onSelect('arena-dha-lahore')} />
        <ArenaPin label="Gulberg" x="38%" y="30%" selected={selectedId === 'arena-gulberg-lahore'}
          onClick={() => onSelect('arena-gulberg-lahore')} />
      </div>
      <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/80 text-[9px]
                      text-slate-500 dark:text-gray-500 px-2 py-1 rounded-md backdrop-blur-sm">
        © OpenStreetMap contributors
      </div>
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm
                      rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-gray-300">
        📍 Arenas near you
      </div>
    </div>
  )
}

function ArenaPin({ label, x, y, selected, onClick }: {
  label: string; x: string; y: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="pointer-events-auto absolute -translate-x-1/2 -translate-y-full flex flex-col items-center"
      style={{ left: x, top: y }}
    >
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 whitespace-nowrap shadow-md
        ${selected ? 'bg-green-500 text-black' : 'bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-[#2a2a2a]'}`}>
        {label}
      </div>
      <div className={`w-3 h-3 rounded-full shadow-md border-2 border-white
        ${selected ? 'bg-green-500' : 'bg-slate-500'}`} />
    </button>
  )
}

/* ─── Main step ─── */
interface Props {
  draft: BookingDraft
  onChange: (patch: Partial<BookingDraft>) => void
  onNext: () => void
}

export default function StepArena({ draft, onChange, onNext }: Props) {
  const supabase = createClient()
  const [gpsLoading, setGpsLoading] = useState(true)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [sortedArenas, setSortedArenas] = useState<(ArenaData & { distKm?: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('arenas')
      .select('id, name, city, address, lat, lng, hourly_rate, is_active, image_url, facilities, description')
      .eq('is_active', true)
      .order('name')
      .then(({ data, error }) => {
        if (!error && data) setSortedArenas(data.map(mapArena))
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!navigator.geolocation || sortedArenas.length === 0) {
      setGpsLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        setUserCoords({ lat, lng })
        setSortedArenas(prev => prev.map(a => ({
          ...a,
          distKm: parseFloat(distanceKm(lat, lng, a.lat, a.lng).toFixed(1)),
        })).sort((a, b) => (a.distKm ?? 999) - (b.distKm ?? 999)))
        setGpsLoading(false)
      },
      () => setGpsLoading(false),
      { timeout: 5000 }
    )
  }, [sortedArenas.length])

  const nearest = sortedArenas[0]
  const others = sortedArenas.slice(1)

  const select = (arena: ArenaData) =>
    onChange({ arenaId: arena.id, arenaName: arena.name })

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Choose Your Arena</h2>
       <p className="text-slate-500 dark:text-gray-500 text-sm mb-6">
        {loading ? '🏟️ Loading arenas…' : gpsLoading ? '📍 Detecting your location…' : userCoords ? '📍 Sorted by distance from your location' : 'Select a Cricket Arena to book your session'}
      </p>

      {/* ── Nearest / Featured 3D card ── */}
      {nearest && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-widest">
              Nearest Arena {userCoords ? `· ${nearest.distKm} km away` : ''}
            </p>
            <Link href={`/arenas/${nearest.id}`}
              className="ml-auto text-xs text-slate-400 dark:text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-colors">
              View details →
            </Link>
          </div>
          <Card3D
            arena={nearest}
            selected={draft.arenaId === nearest.id}
            onSelect={() => select(nearest)}
          />
        </div>
      )}

      {/* ── Other arenas — horizontal scroll ── */}
      {others.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-slate-500 dark:text-gray-600 uppercase tracking-widest mb-3">Other Arenas</p>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {others.map(arena => (
              <div key={arena.id} className="shrink-0 w-72 relative">
                <Card3D
                  arena={arena}
                  selected={draft.arenaId === arena.id}
                  onSelect={() => select(arena)}
                />
                <Link href={`/arenas/${arena.id}`}
                  className="absolute top-3 right-3 text-[10px] bg-black/40 text-white
                             hover:bg-green-500 transition-colors px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Map ── */}
      <div className="mb-8">
        <p className="text-xs text-slate-500 dark:text-gray-600 uppercase tracking-widest mb-3">Arena Locations</p>
        <ArenaMap
          arenas={sortedArenas}
          selectedId={draft.arenaId}
          onSelect={id => {
            const a = sortedArenas.find(x => x.id === id)
            if (a) select(a)
          }}
        />
      </div>

      <button
        onClick={onNext}
        disabled={!draft.arenaId}
        className="btn-primary w-full justify-center py-4 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue — Choose Date & Slot
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
