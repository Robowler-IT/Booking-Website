'use client'

import { useState } from 'react'
import { BookingDraft } from '../BookingFlow'

const FORMATS = {
  solo: {
    label: 'Solo',
    icon: '🧍',
    desc: 'Train alone against ROBOWLER. Perfect for focused skill development.',
    modes: [
      { id: 'solo_target', name: 'Target Chase', desc: 'Score a set target in a fixed number of balls.', icon: '🏹' },
      { id: 'solo_speed', name: 'Speed Challenge', desc: 'Progressive difficulty — speed and swing increase every over.', icon: '⚡' },
      { id: 'solo_accuracy', name: 'Nets Practice', desc: 'Free practice — any delivery type, any speed. No scoring.', icon: '🎯' },
      { id: 'solo_survival', name: 'Survival Mode', desc: 'Survive as many balls as possible without getting out.', icon: '🛡️' },
    ],
    idealFor: 'Individual players · coaching sessions · skill training',
  },
  '1v1': {
    label: '1v1',
    icon: '⚔️',
    desc: 'Head-to-head battle. Two players take turns facing ROBOWLER.',
    modes: [
      { id: '1v1_over_battle', name: 'Full Innings', desc: 'Each player bats a full innings. Highest score wins.', icon: '🏏' },
      { id: '1v1_powerplay_duel', name: 'Target Chase', desc: 'Player 1 sets a target; Player 2 chases it.', icon: '🎯' },
      { id: '1v1_last_man_standing', name: 'Sudden Death', desc: 'Alternate balls — first to get out loses.', icon: '💀' },
    ],
    idealFor: 'Two players · competitive sessions · head-to-head rivals',
  },
  gully: {
    label: 'Gully Cricket',
    icon: '🏘️',
    desc: 'Up to 6 players. Informal, fun, and fast-paced — just like street cricket.',
    modes: [
      { id: 'gully_match', name: 'Batting Carnival', desc: 'All players bat in rotation; team total wins the match.', icon: '🎪' },
      { id: 'gully_street_league', name: 'Elimination', desc: 'Get out and you are eliminated. Last man standing wins.', icon: '🔥' },
      { id: 'gully_tournament', name: 'Powerplay Slog', desc: 'Pure slog contest — max sixes in 6 balls each.', icon: '💥' },
    ],
    idealFor: '4–8 players · friend groups · corporate events · team fun',
  },
}

type FormatKey = keyof typeof FORMATS

interface Props {
  draft: BookingDraft
  onChange: (patch: Partial<BookingDraft>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepGameMode({ draft, onChange, onNext, onBack }: Props) {
  const [format, setFormat] = useState<FormatKey>((draft.format as FormatKey) || 'solo')
  const currentFormat = FORMATS[format]

  const handleFormat = (f: FormatKey) => {
    setFormat(f)
    // reset player data whenever format changes
    onChange({ format: f, gameMode: '', players: [''], teamA: [''], teamB: [''] })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Choose Your Game Mode</h2>
      <p className="text-slate-500 dark:text-gray-500 text-sm mb-8">
        Select your format and mode. Difficulty is set at the arena on the tablet.
      </p>

      {/* Format tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {(Object.keys(FORMATS) as FormatKey[]).map(f => (
          <button key={f}
            onClick={() => handleFormat(f)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold
                        whitespace-nowrap transition-all shrink-0
              ${format === f
                ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400'
                : 'border-slate-200 dark:border-[#1f1f1f] bg-white dark:bg-[#111] text-slate-600 dark:text-gray-400 hover:border-slate-300 dark:hover:border-[#333]'}`}>
            <span className="text-lg">{FORMATS[f].icon}</span>
            {FORMATS[f].label}
          </button>
        ))}
      </div>

      {/* Format description */}
      <div className="card-dark rounded-xl p-4 mb-6 flex gap-3 items-start">
        <span className="text-2xl">{currentFormat.icon}</span>
        <div>
          <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed">{currentFormat.desc}</p>
          <p className="text-slate-400 dark:text-gray-600 text-xs mt-1">
            <span className="font-medium">Ideal for:</span> {currentFormat.idealFor}
          </p>
        </div>
      </div>

      {/* Mode cards */}
      <p className="text-xs text-slate-500 dark:text-gray-600 uppercase tracking-widest mb-4">Select Mode</p>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {currentFormat.modes.map(mode => {
          const selected = draft.gameMode === mode.id
          return (
            <button key={mode.id}
              onClick={() => onChange({ gameMode: mode.id, format })}
              className={`text-left rounded-xl border p-4 transition-all
                ${selected
                  ? 'border-green-500 bg-green-500/5 ring-1 ring-green-500/20'
                  : 'border-slate-200 dark:border-[#1f1f1f] bg-white dark:bg-[#111] hover:border-green-500/30 hover:bg-green-500/5'}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{mode.icon}</span>
                <div>
                  <div className={`font-semibold text-sm mb-1 ${selected ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>
                    {mode.name}
                  </div>
                  <div className="text-slate-500 dark:text-gray-500 text-xs leading-relaxed">{mode.desc}</div>
                </div>
              </div>
              {selected && (
                <div className="mt-3 pt-3 border-t border-green-500/20 flex items-center gap-1.5">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                    className="text-green-500">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-green-600 dark:text-green-400 text-xs font-medium">Selected</span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Difficulty note */}
      <div className="card-dark rounded-xl p-4 mb-8 flex gap-3 items-start border-amber-500/20">
        <span className="text-xl">ℹ️</span>
        <div>
          <p className="text-slate-700 dark:text-gray-300 text-sm font-medium mb-0.5">Difficulty is set at the arena</p>
          <p className="text-slate-500 dark:text-gray-500 text-xs leading-relaxed">
            When you arrive, the Operator will set your speed on the arena tablet — Easy (60 km/h) to Extreme (145 km/h). You can change it mid-session too.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary px-6 py-3">Back</button>
        <button
          onClick={onNext}
          disabled={!draft.gameMode}
          className="btn-primary flex-1 justify-center py-3 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue — Player Info
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
