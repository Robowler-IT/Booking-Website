const BADGES = [
  { icon: '⚡', name: 'Speed Demon', desc: 'Avg shot speed > 120 km/h', rarity: 'Rare' },
  { icon: '🎯', name: 'Sniper', desc: '90%+ shot accuracy in a session', rarity: 'Epic' },
  { icon: '💥', name: 'Six Machine', desc: '10 sixes in a single session', rarity: 'Rare' },
  { icon: '🛡️', name: 'Wall', desc: 'Survive 50 balls without getting out', rarity: 'Common' },
  { icon: '👑', name: 'Arena King', desc: 'Top score at any arena', rarity: 'Legendary' },
  { icon: '🔥', name: 'Streak', desc: '5 sessions in 5 consecutive days', rarity: 'Epic' },
]

const RARITY_COLOR: Record<string, string> = {
  Common: 'text-gray-500 bg-gray-400/10 border-gray-400/20',
  Rare: 'text-blue-500 bg-blue-400/10 border-blue-400/20',
  Epic: 'text-purple-500 bg-purple-400/10 border-purple-400/20',
  Legendary: 'text-yellow-500 bg-yellow-400/10 border-yellow-400/20',
}

export default function GamificationSection() {
  return (
    <section id="gamification" className="py-28 bg-slate-50 dark:bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            <p className="section-label mb-4">Gamification</p>
            <h2 className="section-title mb-6">
              Every session counts.{' '}
              <span className="gradient-text">Every ball matters.</span>
            </h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-8">
              Cricket Arena tracks everything — every delivery you face, every run you score,
              every boundary you hit. Your stats build a performance profile that follows you
              across every session, every arena, and every challenge.
            </p>

            <div className="space-y-5">
              {[
                { icon: '📊', title: 'Live Stats Dashboard', desc: 'Strike rate, boundaries, shot speed, and accuracy — all tracked in real time on the projector screen and your player account.' },
                { icon: '🏆', title: 'City & National Leaderboards', desc: 'Compete for the top spot at your local arena, your city, and the entire Cricket Arena network.' },
                { icon: '🎖️', title: 'Achievement Badges', desc: 'Earn badges for exceptional performances. Each badge has a rarity tier — Common, Rare, Epic, or Legendary.' },
                { icon: '🎯', title: 'Challenges', desc: 'Weekly and seasonal challenges push you to try new game modes, hit new targets, and improve specific skills.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0 text-xl">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-slate-500 dark:text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — badge showcase */}
          <div>
            <p className="text-xs text-slate-400 dark:text-gray-600 uppercase tracking-widest mb-5 text-center">
              Earnable Badges
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {BADGES.map(badge => (
                <div key={badge.name}
                  className="card-dark rounded-2xl p-4 text-center hover:border-green-500/30
                             hover:bg-green-500/5 transition-all group cursor-default">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    {badge.icon}
                  </div>
                  <div className="text-slate-900 dark:text-white font-semibold text-sm">{badge.name}</div>
                  <div className="text-slate-500 dark:text-gray-600 text-xs mt-1 mb-3 leading-relaxed">{badge.desc}</div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider
                                  border rounded-full px-2 py-0.5 ${RARITY_COLOR[badge.rarity]}`}>
                    {badge.rarity}
                  </span>
                </div>
              ))}
            </div>

            {/* Points system teaser */}
            <div className="card-dark rounded-2xl p-5 mt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Points System</span>
                <span className="text-xs text-green-500 dark:text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  Coming with every session
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { act: 'Per Run', pts: '+1 pt' },
                  { act: 'Per Four', pts: '+5 pts' },
                  { act: 'Per Six', pts: '+10 pts' },
                  { act: 'Accuracy Bonus', pts: '+25 pts' },
                  { act: 'Badge Earned', pts: '+50 pts' },
                  { act: 'Daily Visit', pts: '+15 pts' },
                ].map(p => (
                  <div key={p.act} className="bg-slate-100 dark:bg-[#0a0a0a] rounded-lg p-2">
                    <div className="text-green-500 dark:text-green-400 font-bold text-sm">{p.pts}</div>
                    <div className="text-slate-400 dark:text-gray-600 text-[10px] mt-0.5">{p.act}</div>
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
