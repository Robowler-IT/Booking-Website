'use client'
import { useState } from 'react'
import Link from 'next/link'

const FORMATS = [
  {
    key: 'solo',
    label: 'Solo',
    icon: '🎯',
    tagline: 'You vs the Machine',
    description: 'Take on ROBOWLER yourself. You control every delivery — choose the pitch, the pace, and the difficulty. Push your batting skills to the limit.',
    color: 'from-green-500 to-emerald-600',
    modes: [
      { name: 'Target Practice', desc: 'Hit a target score before your time runs out.', icon: '🏆' },
      { name: 'Speed Challenge', desc: 'Maximize your average shot speed across all deliveries.', icon: '⚡' },
      { name: 'Accuracy Drill', desc: 'Hit the zone markers for maximum accuracy points.', icon: '🎯' },
      { name: 'Survival Mode', desc: 'Survive as many deliveries as possible without getting out.', icon: '🛡️' },
    ],
    ideal: 'Individual players, coaching sessions, skill training',
  },
  {
    key: '1v1',
    label: '1v1',
    icon: '⚔️',
    tagline: 'Head-to-Head Battle',
    description: 'Challenge a friend to a head-to-head cricket battle. The bowling side controls the tablet — choosing deliveries strategically to dismiss the batter.',
    color: 'from-blue-500 to-indigo-600',
    modes: [
      { name: 'Over Battle', desc: 'One over each. Highest score wins. Simple, intense.', icon: '🏏' },
      { name: 'Powerplay Duel', desc: 'Powerplay rules only. All fielders up. Pure aggression.', icon: '💥' },
      { name: 'Last Man Standing', desc: 'Three lives each. Last batter standing takes the win.', icon: '👑' },
    ],
    ideal: 'Two players, competitive sessions, head-to-head rivals',
  },
  {
    key: 'gully',
    label: 'Gully Cricket',
    icon: '🏘️',
    tagline: 'Team vs Team',
    description: 'The classic street cricket experience, elevated. Bowling team controls the tablet together — planning field placements and deliveries as a unit.',
    color: 'from-orange-500 to-red-600',
    modes: [
      { name: 'Gully Match', desc: 'Full gully cricket match with team scoring and field strategy.', icon: '🏟️' },
      { name: 'Street League', desc: 'Street cricket league format — round-robin team competition.', icon: '🏆' },
      { name: 'Tournament Mode', desc: 'Multi-team bracket tournament with elimination rounds.', icon: '🎖️' },
    ],
    ideal: '4–8 players, friend groups, corporate events, team fun',
  },
]

export default function GameModesSection() {
  const [active, setActive] = useState('solo')
  const format = FORMATS.find(f => f.key === active)!

  return (
    <section id="game-modes" className="py-28 bg-slate-50 dark:bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">Game Modes</p>
          <h2 className="section-title mb-4">
            Play your <span className="gradient-text">way</span>
          </h2>
          <p className="text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
            Three formats. Twelve game modes. One machine that adapts to every style of play.
          </p>
        </div>

        {/* Format tabs */}
        <div className="flex justify-center gap-3 mb-12">
          {FORMATS.map(f => (
            <button key={f.key} onClick={() => setActive(f.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                ${active === f.key
                  ? 'bg-green-500 text-black'
                  : 'bg-white dark:bg-[#111] border border-slate-200 dark:border-[#2a2a2a] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/20'
                }`}>
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Active format detail */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: description */}
          <div className="lg:col-span-2 card-dark rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${format.color}
                              text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4`}>
                <span>{format.icon}</span>
                {format.tagline}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{format.label} Mode</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{format.description}</p>
            </div>

            <div className="mt-8">
              <p className="text-xs text-slate-500 dark:text-gray-600 uppercase tracking-widest mb-2">Ideal for</p>
              <p className="text-slate-700 dark:text-gray-300 text-sm">{format.ideal}</p>
              <Link href="/book" className="btn-primary w-full justify-center mt-6 text-sm">
                Book {format.label} Session
              </Link>
            </div>
          </div>

          {/* Right: mode cards */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
            {format.modes.map((mode, i) => (
              <div key={mode.name}
                className="card-dark rounded-xl p-5 hover:border-green-500/30 transition-all
                           hover:bg-green-500/5 group cursor-default"
                style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="text-3xl mb-3">{mode.icon}</div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-2 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
                  {mode.name}
                </h4>
                <p className="text-slate-500 dark:text-gray-500 text-sm leading-relaxed">{mode.desc}</p>
              </div>
            ))}

            {/* Difficulty teaser */}
            <div className="sm:col-span-2 card-dark rounded-xl p-5">
              <p className="text-xs text-slate-500 dark:text-gray-600 uppercase tracking-widest mb-4">Difficulty Levels</p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'Easy', speed: '60–82 km/h', color: 'text-green-500', bar: 'w-1/4' },
                  { name: 'Medium', speed: '83–100 km/h', color: 'text-yellow-500', bar: 'w-2/4' },
                  { name: 'Hard', speed: '101–115 km/h', color: 'text-orange-500', bar: 'w-3/4' },
                  { name: 'Extreme', speed: '116–145 km/h', color: 'text-red-500', bar: 'w-full' },
                ].map(d => (
                  <div key={d.name} className="text-center">
                    <div className={`text-xs font-bold mb-1.5 ${d.color}`}>{d.name}</div>
                    <div className="h-1.5 bg-slate-200 dark:bg-[#1f1f1f] rounded-full overflow-hidden">
                      <div className={`h-full bg-current ${d.bar} ${d.color} rounded-full`} />
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-gray-600 mt-1">{d.speed}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
