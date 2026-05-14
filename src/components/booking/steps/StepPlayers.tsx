'use client'

import { BookingDraft } from '../BookingFlow'

interface Props {
  draft: BookingDraft
  onChange: (patch: Partial<BookingDraft>) => void
  onNext: () => void
  onBack: () => void
}

/* ── Reusable single player input row ── */
function PlayerInput({
  label, value, placeholder, onChange, onRemove, showRemove,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (v: string) => void
  onRemove?: () => void
  showRemove?: boolean
}) {
  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <label className="block text-[10px] text-slate-500 dark:text-gray-600 uppercase tracking-widest mb-1.5">
          {label}
        </label>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={30}
          className="input-dark"
        />
      </div>
      {showRemove && onRemove && (
        <button
          onClick={onRemove}
          className="mb-0.5 w-9 h-9 flex items-center justify-center rounded-lg border
                     border-slate-200 dark:border-[#2a2a2a] text-slate-400 dark:text-gray-600
                     hover:border-red-400/50 hover:text-red-400 transition-colors shrink-0"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}


/* ──────────────────────────────────────────────────────
   SOLO layout: single centred player field
────────────────────────────────────────────────────── */
function SoloPlayers({ draft, onChange }: { draft: BookingDraft; onChange: (p: Partial<BookingDraft>) => void }) {
  const name = draft.players[0] ?? ''
  return (
    <div className="max-w-sm mx-auto">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🧍</div>
        <p className="text-slate-500 dark:text-gray-500 text-sm leading-relaxed">
          Your name will appear on the live scoreboard and in your session stats.
        </p>
      </div>
      <PlayerInput
        label="Your Name"
        value={name}
        placeholder="e.g. Ghulam Mustafa"
        onChange={v => onChange({ players: [v] })}
        showRemove={false}
      />
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   1v1 layout: two players side-by-side with VS divider
────────────────────────────────────────────────────── */
function OneVOnePlayers({ draft, onChange }: { draft: BookingDraft; onChange: (p: Partial<BookingDraft>) => void }) {
  const p = draft.players.length >= 2 ? draft.players : ['', '']

  const update = (idx: number, val: string) => {
    const next = [...p]
    next[idx] = val
    onChange({ players: next })
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">⚔️</div>
        <p className="text-slate-500 dark:text-gray-500 text-sm leading-relaxed">
          Head-to-head. Both players will take turns facing ROBOWLER.
          Names appear on the scoreboard and leaderboard.
        </p>
      </div>

      {/* Two columns side by side */}
      <div className="grid grid-cols-2 gap-4 items-start">
        {/* Player 1 */}
        <div className="card-dark rounded-2xl p-4 border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30
                            flex items-center justify-center text-sm font-black text-blue-600 dark:text-blue-400">
              1
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Batter</span>
          </div>
          <label className="block text-[10px] text-slate-500 dark:text-gray-600 uppercase tracking-widest mb-1.5">
            Player 1 Name
          </label>
          <input
            type="text"
            value={p[0]}
            onChange={e => update(0, e.target.value)}
            placeholder="Name…"
            maxLength={30}
            className="input-dark text-sm"
          />
        </div>

        {/* Player 2 */}
        <div className="card-dark rounded-2xl p-4 border-orange-500/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-orange-500/10 border border-orange-500/30
                            flex items-center justify-center text-sm font-black text-orange-600 dark:text-orange-400">
              2
            </div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Challenger</span>
          </div>
          <label className="block text-[10px] text-slate-500 dark:text-gray-600 uppercase tracking-widest mb-1.5">
            Player 2 Name
          </label>
          <input
            type="text"
            value={p[1]}
            onChange={e => update(1, e.target.value)}
            placeholder="Name…"
            maxLength={30}
            className="input-dark text-sm"
          />
        </div>
      </div>

      {/* VS divider label */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 border-t border-slate-100 dark:border-[#1f1f1f]" />
        <span className="text-slate-400 dark:text-gray-600 text-xs font-bold tracking-widest">VS</span>
        <div className="flex-1 border-t border-slate-100 dark:border-[#1f1f1f]" />
      </div>

      <p className="text-center text-slate-400 dark:text-gray-600 text-xs">
        Both players take equal turns — whoever scores more wins.
      </p>
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   Gully Cricket layout: Team A vs Team B — 2 columns
   Each team: flexible player count, add/remove per team
────────────────────────────────────────────────────── */
function GullyPlayers({ draft, onChange }: { draft: BookingDraft; onChange: (p: Partial<BookingDraft>) => void }) {
  const teamA = draft.teamA?.length ? draft.teamA : ['']
  const teamB = draft.teamB?.length ? draft.teamB : ['']

  const updateTeamA = (idx: number, val: string) => {
    const next = [...teamA]; next[idx] = val; onChange({ teamA: next })
  }
  const updateTeamB = (idx: number, val: string) => {
    const next = [...teamB]; next[idx] = val; onChange({ teamB: next })
  }
  const addToTeamA = () => onChange({ teamA: [...teamA, ''] })
  const addToTeamB = () => onChange({ teamB: [...teamB, ''] })
  const removeFromTeamA = (idx: number) => onChange({ teamA: teamA.filter((_, i) => i !== idx) })
  const removeFromTeamB = (idx: number) => onChange({ teamB: teamB.filter((_, i) => i !== idx) })

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🏘️</div>
        <p className="text-slate-500 dark:text-gray-500 text-sm leading-relaxed">
          Build your two teams. Players from each team take turns on the crease.
          Add as many as you like — teams don&apos;t need to be equal size.
        </p>
      </div>

      {/* Two columns: Team A | Team B */}
      <div className="grid grid-cols-2 gap-4">

        {/* ── Team A ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-green-500/10 border border-green-500/30
                            flex items-center justify-center text-xs font-black text-green-600 dark:text-green-400">
              A
            </div>
            <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">
              Team A
            </span>
            <span className="ml-auto text-[10px] text-slate-400 dark:text-gray-600">
              {teamA.filter(Boolean).length} player{teamA.filter(Boolean).length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-2">
            {teamA.map((name, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={name}
                  onChange={e => updateTeamA(idx, e.target.value)}
                  placeholder={`Player ${idx + 1}`}
                  maxLength={25}
                  className="input-dark text-sm flex-1"
                />
                {teamA.length > 1 && (
                  <button onClick={() => removeFromTeamA(idx)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border
                               border-slate-200 dark:border-[#2a2a2a] text-slate-400 dark:text-gray-600
                               hover:border-red-400/50 hover:text-red-400 transition-colors shrink-0">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addToTeamA}
            className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-medium
                       text-slate-500 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400
                       border border-dashed border-slate-200 dark:border-[#2a2a2a] rounded-lg py-2
                       hover:border-green-500/40 transition-colors">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Add to Team A
          </button>
        </div>

        {/* ── Team B ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/30
                            flex items-center justify-center text-xs font-black text-orange-600 dark:text-orange-400">
              B
            </div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
              Team B
            </span>
            <span className="ml-auto text-[10px] text-slate-400 dark:text-gray-600">
              {teamB.filter(Boolean).length} player{teamB.filter(Boolean).length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-2">
            {teamB.map((name, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={name}
                  onChange={e => updateTeamB(idx, e.target.value)}
                  placeholder={`Player ${idx + 1}`}
                  maxLength={25}
                  className="input-dark text-sm flex-1"
                />
                {teamB.length > 1 && (
                  <button onClick={() => removeFromTeamB(idx)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border
                               border-slate-200 dark:border-[#2a2a2a] text-slate-400 dark:text-gray-600
                               hover:border-red-400/50 hover:text-red-400 transition-colors shrink-0">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addToTeamB}
            className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-medium
                       text-slate-500 dark:text-gray-500 hover:text-orange-500 dark:hover:text-orange-400
                       border border-dashed border-slate-200 dark:border-[#2a2a2a] rounded-lg py-2
                       hover:border-orange-500/40 transition-colors">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Add to Team B
          </button>
        </div>
      </div>

      {/* Team totals strip */}
      <div className="mt-4 card-dark rounded-xl px-4 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-green-600 dark:text-green-400 font-bold">Team A:</span>
          <span className="text-slate-700 dark:text-gray-300">{teamA.filter(Boolean).length} players</span>
        </div>
        <span className="text-slate-300 dark:text-gray-700">vs</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-700 dark:text-gray-300">{teamB.filter(Boolean).length} players</span>
          <span className="text-orange-500 dark:text-orange-400 font-bold">Team B</span>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   Main StepPlayers component
────────────────────────────────────────────────────── */
export default function StepPlayers({ draft, onChange, onNext, onBack }: Props) {
  const isSolo  = draft.format === 'solo'
  const is1v1   = draft.format === '1v1'
  const isGully = draft.format === 'gully'

  /* ── Validation ── */
  let canContinue = false
  if (isSolo) {
    canContinue = (draft.players[0] ?? '').trim().length >= 2
  } else if (is1v1) {
    const p = draft.players
    canContinue = (p[0] ?? '').trim().length >= 2 && (p[1] ?? '').trim().length >= 2
  } else if (isGully) {
    const aFilled = (draft.teamA ?? []).some(n => n.trim().length >= 2)
    const bFilled = (draft.teamB ?? []).some(n => n.trim().length >= 2)
    canContinue = aFilled && bFilled
  }

  const titles: Record<string, string> = {
    solo:  'Your Name',
    '1v1': 'Player Names',
    gully: 'Build Your Teams',
  }
  const subtitles: Record<string, string> = {
    solo:  'Your name will appear on the live scoreboard.',
    '1v1': 'Enter both names — each will appear on the scoreboard and leaderboard.',
    gully: 'Enter player names for each team. At least one player per team is required.',
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {titles[draft.format] ?? 'Players'}
      </h2>
      <p className="text-slate-500 dark:text-gray-500 text-sm mb-8">
        {subtitles[draft.format] ?? ''}
      </p>

      {/* ── Format-specific layouts ── */}
      {isSolo  && <SoloPlayers  draft={draft} onChange={onChange} />}
      {is1v1   && <OneVOnePlayers draft={draft} onChange={onChange} />}
      {isGully && <GullyPlayers draft={draft} onChange={onChange} />}

      {/* ── Info callout ── */}
      <div className="card-dark rounded-xl p-4 my-8 flex gap-3 items-start">
        <span className="text-lg shrink-0">ℹ️</span>
        <p className="text-slate-500 dark:text-gray-500 text-sm leading-relaxed">
          Names are used for the scoreboard and your performance history.
          You can also add or adjust players at the arena — just let the Operator know.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary px-6 py-3">Back</button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="btn-primary flex-1 justify-center py-3 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue — Review Booking
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
