'use client'

import { useState } from 'react'
import { BookingDraft } from '../BookingFlow'

const METHODS = [
  { id: 'jazzcash', label: 'JazzCash', icon: '📱', desc: 'Pay via JazzCash mobile account or wallet.' },
  { id: 'easypaisa', label: 'Easypaisa', icon: '💳', desc: 'Pay via Easypaisa mobile wallet.' },
  { id: 'card', label: 'Debit / Credit Card', icon: '🏦', desc: 'Visa, Mastercard — secured via 3D Secure.' },
  { id: 'cash', label: 'Pay at Venue', icon: '🏟️', desc: 'Pay cash or by card when you arrive at the arena.' },
]

interface Props {
  draft: BookingDraft
  onBack: () => void
}

export default function StepPayment({ draft, onBack }: Props) {
  const [method, setMethod] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [bookingId, setBookingId] = useState('')

  const PRICE_PER_SLOT = 1500
  const slotCount = draft.slots?.length ?? 0
  const price = slotCount * PRICE_PER_SLOT
  const totalMins = slotCount * 30

  const playersLabel = draft.format === 'gully'
    ? [
        ...(draft.teamA ?? []).filter(Boolean).map(n => `A: ${n}`),
        ...(draft.teamB ?? []).filter(Boolean).map(n => `B: ${n}`),
      ].join(', ') || '—'
    : (draft.players ?? []).filter(Boolean).join(', ') || '—'

  const handlePay = async () => {
    if (!method) return
    setProcessing(true)
    setError('')

    try {
      const playerName = draft.format === 'gully'
        ? [...(draft.teamA ?? []), ...(draft.teamB ?? [])].filter(Boolean).join(', ')
        : (draft.players ?? []).filter(Boolean).join(', ')

      const ids: string[] = []
      for (const slotTime of (draft.slots ?? [])) {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            arena_id: draft.arenaId,
            arena_name: draft.arenaName,
            date: draft.date,
            slot_time: slotTime,
            duration: 30,
            game_mode: draft.gameMode,
            player_name: playerName,
            user_id: draft.userId,
            user_email: draft.userEmail,
            payment_method: method,
            amount: PRICE_PER_SLOT,
          }),
        })
        const result = await res.json()
        if (result.error) {
          setError(result.error)
          setProcessing(false)
          return
        }
        ids.push(result.booking_id)
      }
      setBookingId(ids[0])
      setDone(true)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Booking Confirmed!</h2>
        <p className="text-slate-500 dark:text-gray-400 mb-8 leading-relaxed">
          Your session at <span className="text-slate-900 dark:text-white font-semibold">{draft.arenaName}</span> is
          confirmed. A confirmation email has been sent. See you at the crease!
        </p>

        <div className="card-dark rounded-2xl p-5 mb-8 text-left">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600 dark:text-green-400 text-xs font-semibold uppercase tracking-widest">Booking Active</span>
          </div>
          {[
            { label: 'Booking ID', value: bookingId ? `#${bookingId.slice(0, 8)}` : '—' },
            { label: 'Arena', value: draft.arenaName },
            { label: 'Date & Slots', value: `${draft.date} — ${draft.slots?.join(', ') ?? '—'}` },
            { label: 'Duration', value: `${totalMins} min (${slotCount} × 30 min)` },
            { label: 'Players', value: playersLabel },
            { label: 'Total Paid', value: `PKR ${price.toLocaleString()}` },
          ].map(r => (
            <div key={r.label} className="flex justify-between py-2.5 border-b border-slate-100 dark:border-[#1a1a1a] last:border-0">
              <span className="text-slate-500 dark:text-gray-500 text-sm">{r.label}</span>
              <span className="text-slate-900 dark:text-white text-sm font-medium">{r.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/account" className="btn-secondary px-6 py-3 justify-center">View My Bookings</a>
          <a href="/" className="btn-primary px-6 py-3 justify-center">Back to Home</a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Choose Payment Method</h2>
      <p className="text-slate-500 dark:text-gray-500 text-sm mb-8">
        Total: <span className="text-green-600 dark:text-green-400 font-bold text-base">PKR {price.toLocaleString()}</span>
      </p>

      <div className="space-y-3 mb-8">
        {METHODS.map(m => (
          <button key={m.id}
            onClick={() => setMethod(m.id)}
            className={`w-full text-left rounded-xl border p-4 flex items-center gap-4 transition-all
              ${method === m.id
                ? 'border-green-500 bg-green-500/5 ring-1 ring-green-500/20'
                : 'border-slate-200 dark:border-[#1f1f1f] bg-white dark:bg-[#111] hover:border-slate-300 dark:hover:border-[#333]'}`}>
            <span className="text-2xl">{m.icon}</span>
            <div className="flex-1">
              <div className="text-slate-900 dark:text-white font-semibold text-sm">{m.label}</div>
              <div className="text-slate-500 dark:text-gray-500 text-xs mt-0.5">{m.desc}</div>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
              ${method === m.id ? 'border-green-500 bg-green-500' : 'border-slate-300 dark:border-[#333]'}`}>
              {method === m.id && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
            </div>
          </button>
        ))}
      </div>

      {method === 'card' && (
        <div className="card-dark rounded-xl p-5 mb-6 space-y-3">
          <input type="text" placeholder="Card Number" className="input-dark" maxLength={19} />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="MM / YY" className="input-dark" />
            <input type="text" placeholder="CVV" className="input-dark" maxLength={4} />
          </div>
          <input type="text" placeholder="Name on Card" className="input-dark" />
        </div>
      )}

      {(method === 'jazzcash' || method === 'easypaisa') && (
        <div className="card-dark rounded-xl p-5 mb-6">
          <input type="tel" placeholder="03XX XXXXXXX (registered number)" className="input-dark" />
          <p className="text-slate-400 dark:text-gray-600 text-xs mt-2">You will receive a payment PIN via SMS.</p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center mb-3 bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary px-6 py-3">Back</button>
        <button
          onClick={handlePay}
          disabled={!method || processing}
          className="btn-primary flex-1 justify-center py-4 glow-green disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              {method === 'cash' ? 'Confirm Booking' : `Pay PKR ${price.toLocaleString()}`}
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </div>

      <p className="text-center text-slate-400 dark:text-gray-600 text-xs mt-4">
        🔒 All payments are secured with 256-bit SSL encryption
      </p>
    </div>
  )
}
