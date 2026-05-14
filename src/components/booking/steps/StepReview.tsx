'use client'

import { BookingDraft } from '../BookingFlow'

const MODE_LABELS: Record<string, string> = {
  solo_target: 'Target Chase', solo_speed: 'Speed Challenge', solo_accuracy: 'Nets Practice', solo_survival: 'Survival Mode',
  '1v1_over_battle': 'Full Innings', '1v1_powerplay_duel': 'Target Chase', '1v1_last_man_standing': 'Sudden Death',
  gully_match: 'Batting Carnival', gully_street_league: 'Elimination', gully_tournament: 'Powerplay Slog',
}

const PRICE_PER_SLOT = 1500

function calcTotal(draft: BookingDraft) {
  return (draft.slots?.length ?? 0) * PRICE_PER_SLOT
}

function playersDisplay(draft: BookingDraft): string {
  if (draft.format === 'gully') {
    const a = (draft.teamA ?? []).filter(Boolean)
    const b = (draft.teamB ?? []).filter(Boolean)
    if (!a.length && !b.length) return '—'
    return `Team A: ${a.join(', ') || '—'} | Team B: ${b.join(', ') || '—'}`
  }
  return (draft.players ?? []).filter(Boolean).join(', ') || '—'
}

interface Props {
  draft: BookingDraft
  onNext: () => void
  onBack: () => void
}

export default function StepReview({ draft, onNext, onBack }: Props) {
  const slotCount  = draft.slots?.length ?? 0
  const totalMins  = slotCount * 30
  const totalPrice = calcTotal(draft)

  const startSlot  = draft.slots?.[0] ?? '—'
  const endSlot    = draft.slots?.[draft.slots.length - 1] ?? null

  const slotsDisplay = slotCount === 0
    ? '—'
    : slotCount === 1
    ? startSlot
    : `${startSlot} → ${endSlot} (${slotCount} slots)`

  const formatLabel = draft.format === '1v1' ? '1v1 Battle'
    : draft.format === 'gully' ? 'Gully Cricket' : 'Solo'

  const rows = [
    { label: 'Arena',     value: draft.arenaName || '—' },
    { label: 'Date',      value: draft.date ? new Date(draft.date + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
    { label: 'Slots',     value: slotsDisplay },
    { label: 'Duration',  value: totalMins ? `${totalMins} minutes total (${slotCount} × 30 min)` : '—' },
    { label: 'Format',    value: formatLabel },
    { label: 'Game Mode', value: draft.gameMode ? (MODE_LABELS[draft.gameMode] ?? draft.gameMode) : '—' },
    { label: 'Difficulty',value: 'Set at arena by Operator' },
    { label: 'Players',   value: playersDisplay(draft) },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Review Your Booking</h2>
      <p className="text-slate-500 dark:text-gray-500 text-sm mb-8">Confirm everything before signing in and paying.</p>

      <div className="card-dark rounded-2xl overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-[#1f1f1f]">
          <p className="text-xs text-slate-500 dark:text-gray-600 uppercase tracking-widest">Booking Summary</p>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-[#1a1a1a]">
          {rows.map(row => (
            <div key={row.label} className="flex justify-between items-start px-5 py-3.5 gap-4">
              <span className="text-slate-500 dark:text-gray-500 text-sm shrink-0">{row.label}</span>
              <span className="text-slate-900 dark:text-white text-sm font-medium text-right">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing breakdown */}
      <div className="card-dark rounded-2xl p-5 mb-8">
        <p className="text-xs text-slate-500 dark:text-gray-600 uppercase tracking-widest mb-4">Price Breakdown</p>

        {(draft.slots ?? []).map((slot, i) => (
          <div key={i} className="flex justify-between items-center mb-2.5 text-sm">
            <span className="text-slate-500 dark:text-gray-500">
              Slot {i + 1} — {slot} (30 min)
            </span>
            <span className="text-slate-900 dark:text-white">PKR {PRICE_PER_SLOT.toLocaleString()}</span>
          </div>
        ))}

        <div className="flex justify-between items-center mb-2.5 text-sm">
          <span className="text-slate-500 dark:text-gray-500">Platform Fee</span>
          <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
        </div>

        <div className="border-t border-slate-100 dark:border-[#1f1f1f] pt-3 flex justify-between items-center">
          <div>
            <span className="text-slate-900 dark:text-white font-semibold">Total</span>
            <span className="text-slate-400 dark:text-gray-600 text-xs ml-2">
              {slotCount} slot{slotCount !== 1 ? 's' : ''} · {totalMins} min
            </span>
          </div>
          <span className="text-green-600 dark:text-green-400 font-black text-2xl">
            PKR {totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary px-6 py-3">Back</button>
        <button onClick={onNext} className="btn-primary flex-1 justify-center py-3 glow-green">
          Confirm &amp; Sign In
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
