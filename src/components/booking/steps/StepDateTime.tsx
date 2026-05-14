'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { BookingDraft } from '../BookingFlow'

/* ── Pricing ── */
const PRICE_PER_SLOT = 1500

/* ── Generate all 30-min slots from 9:00 to 22:30 ── */
function generateSlots() {
  const result: { label: string; h: number; m: number; totalMin: number }[] = []
  for (let t = 9 * 60; t + 30 <= 23 * 60; t += 30) {
    const h24 = Math.floor(t / 60)
    const min = t % 60
    const ampm = h24 >= 12 ? 'PM' : 'AM'
    const h12 = h24 > 12 ? h24 - 12 : h24 === 0 ? 12 : h24
    result.push({
      label:    `${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${ampm}`,
      h:        h24,
      m:        min,
      totalMin: t,
    })
  }
  return result
}

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

interface Props {
  draft: BookingDraft
  onChange: (patch: Partial<BookingDraft>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepDateTime({ draft, onChange, onNext, onBack }: Props) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d }, [])

  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [bookedSlots, setBookedSlots] = useState<string[]>([])

  const fetchBookedSlots = useCallback(async (arenaId: string, date: string) => {
    if (!arenaId || !date) return
    try {
      const res = await fetch(`/api/bookings/slots?arena_id=${arenaId}&date=${date}`)
      const data = await res.json()
      setBookedSlots(data.booked ?? [])
    } catch {
      setBookedSlots([])
    }
  }, [])

  /* ── Dynamic slot list based on chosen duration ── */
  const allSlots = useMemo(() => generateSlots(), [])

  /* ── Calendar grid ── */
  const calendarDays = useMemo(() => {
    const firstDay    = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const cells: (number | null)[] = Array(firstDay).fill(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewYear, viewMonth])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  /* ── Select a calendar day ── */
  const selectDay = (day: number | null) => {
    if (!day) return
    const d = new Date(viewYear, viewMonth, day)
    if (d < today) return
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange({ date: iso, slots: [] })   // reset multi-selected slots when date changes
  }

  /* ── Enriched slot list (available / past / booked) ── */
  const now = new Date()
  const selectedDate: Date | null = draft.date ? new Date(draft.date + 'T00:00:00') : null

  useEffect(() => {
    fetchBookedSlots(draft.arenaId, draft.date)
  }, [draft.date, draft.arenaId, fetchBookedSlots])

  const enrichedSlots = useMemo(() => {
    if (!selectedDate) return []
    const isToday = selectedDate.getTime() === today.getTime()
    const blocksNeeded = 1

    return allSlots.map((s, i) => {
      const isPast = isToday && (s.h < now.getHours() || (s.h === now.getHours() && s.m <= now.getMinutes()))

      // Check if this slot + next (blocksNeeded-1) slots all fit within hours and are not booked
      let hasFullBlock = true
      for (let j = 0; j < blocksNeeded; j++) {
        const slot = allSlots[i + j]
        if (!slot) { hasFullBlock = false; break }  // runs past end of day
        if (bookedSlots.includes(slot.label)) { hasFullBlock = false; break }
      }

      const isBooked = bookedSlots.includes(s.label)
      const available = !isPast && hasFullBlock
      return { ...s, available, isPast, isBooked }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.date, selectedDate])

  /* ── Toggle a slot in the multi-select array ── */
  const toggleSlot = (label: string) => {
    const current = draft.slots ?? []
    const next = current.includes(label)
      ? current.filter(s => s !== label)
      : [...current, label]
    onChange({ slots: next })
  }

  /* ── Calendar helpers ── */
  const isPastDay = (day: number) => new Date(viewYear, viewMonth, day) < today

  const isSelectedDay = (day: number) =>
    selectedDate?.getFullYear() === viewYear &&
    selectedDate?.getMonth()    === viewMonth &&
    selectedDate?.getDate()     === day

  const isTodayCell = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth()    === viewMonth &&
    today.getDate()     === day

  /* ── Price summary ── */
  const slotCount  = (draft.slots ?? []).length
  const totalPrice = slotCount * PRICE_PER_SLOT
  const totalMins  = slotCount * 30

  const canContinue = selectedDate !== null && slotCount > 0

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pick a Date &amp; Slot</h2>
      <p className="text-slate-500 dark:text-gray-500 text-sm mb-8">
        Booking for <span className="text-slate-900 dark:text-white font-medium">{draft.arenaName}</span>
      </p>

      {/* ── Calendar ── */}
      <div className="mb-8">
        <p className="text-xs text-slate-500 dark:text-gray-600 uppercase tracking-widest mb-3">Select Date</p>
        <div className="card-dark rounded-2xl p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg
                         hover:bg-slate-100 dark:hover:bg-[#1a1a1a] text-slate-600 dark:text-gray-400 transition-colors">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="text-slate-900 dark:text-white font-semibold">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg
                         hover:bg-slate-100 dark:hover:bg-[#1a1a1a] text-slate-600 dark:text-gray-400 transition-colors">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-slate-400 dark:text-gray-600 uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (!day) return <div key={i} />
              const past = isPastDay(day)
              const sel  = isSelectedDay(day)
              const tod  = isTodayCell(day)
              return (
                <button key={i} onClick={() => selectDay(day)} disabled={past}
                  className={`h-9 w-full rounded-lg text-sm font-medium transition-all
                    ${sel  ? 'bg-green-500 text-black font-bold'
                    : tod  ? 'border border-green-500 text-green-600 dark:text-green-400 hover:bg-green-500/10'
                    : past ? 'text-slate-300 dark:text-gray-700 cursor-not-allowed'
                    :        'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#1a1a1a]'}`}>
                  {day}
                </button>
              )
            })}
          </div>

          {selectedDate && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#1f1f1f] text-center
                            text-sm text-green-600 dark:text-green-400 font-medium">
              {selectedDate.toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          )}
        </div>
      </div>

      {/* ── Time slots (shown after date is chosen) ── */}
      {selectedDate && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <p className="text-xs text-slate-500 dark:text-gray-600 uppercase tracking-widest">
                Available Slots — 30 min each
              </p>
              {slotCount > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-0.5">
                  {slotCount} slot{slotCount > 1 ? 's' : ''} selected · {totalMins} min total
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-gray-600">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-green-500/20 border border-green-500" /> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-green-500 border border-green-500" /> Selected
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-[#1a1a1a]" /> Unavailable
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {enrichedSlots.map(slot => {
              const isSelected = (draft.slots ?? []).includes(slot.label)
              return (
                <button key={slot.label}
                  disabled={!slot.available}
                  onClick={() => toggleSlot(slot.label)}
                  className={`rounded-lg border px-2 py-2.5 text-xs font-medium transition-all relative
                    ${!slot.available
                      ? 'border-slate-100 dark:border-[#1a1a1a] bg-slate-50 dark:bg-[#0a0a0a] text-slate-300 dark:text-gray-700 cursor-not-allowed line-through'
                      : isSelected
                      ? 'border-green-500 bg-green-500 text-black font-bold shadow-md'
                      : 'border-slate-200 dark:border-[#1f1f1f] bg-white dark:bg-[#111] text-slate-600 dark:text-gray-400 hover:border-green-500/50 hover:text-slate-900 dark:hover:text-white'}`}>
                  {slot.label}
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-600 rounded-full
                                     flex items-center justify-center text-[8px] text-white font-black">
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {enrichedSlots.every(s => !s.available) && (
            <p className="text-center text-slate-500 dark:text-gray-500 text-sm mt-4">
              No slots available for this date. Please pick another day.
            </p>
          )}
        </div>
      )}

      {/* ── Price summary bar ── */}
      {slotCount > 0 && (
        <div className="card-dark rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-widest">Booking Total</p>
            <p className="text-slate-600 dark:text-gray-400 text-xs mt-0.5">
              {slotCount} × 30 min @ PKR {PRICE_PER_SLOT.toLocaleString()} each
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-green-600 dark:text-green-400 font-black text-2xl">
              PKR {totalPrice.toLocaleString()}
            </div>
            <div className="text-slate-400 dark:text-gray-600 text-xs">{totalMins} min total</div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary px-6 py-3">Back</button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="btn-primary flex-1 justify-center py-3 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue — Game Mode
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
