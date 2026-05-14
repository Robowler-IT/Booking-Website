export default function AboutSection() {
  return (
    <section id="about" className="py-28 bg-white dark:bg-black relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-hero-grid opacity-30 dark:opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            <p className="section-label mb-4">About the Company</p>
            <h2 className="section-title mb-6">
              The franchise model that is{' '}
              <span className="gradient-text">changing cricket</span>
            </h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-6">
              Cricket Arena is a franchise-based platform — similar in structure to global
              franchise models like McDonald&apos;s or AFC — where the parent company owns the
              technology, brand, and game systems, and franchise owners purchase the right
              to operate Cricket Arenas under that brand.
            </p>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-8">
              Every arena is powered by{' '}
              <span className="text-slate-900 dark:text-white font-semibold">ROBOWLER</span>,
              our automated bowling machine fully controlled by software. A tablet app, desktop
              application, and projector screen work together in real time to deliver an
              unmatched player experience — whether you&apos;re batting solo or competing in a team.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🏏', title: 'Fully Automated', desc: 'Software-controlled bowling machine. No human bowler needed.' },
                { icon: '📊', title: 'Stat Tracking', desc: 'Every ball, every run tracked and saved to your profile.' },
                { icon: '🌍', title: 'Multi-City', desc: 'Scaling from one city to the entire country.' },
                { icon: '🎯', title: 'All Skill Levels', desc: 'Easy 60 km/h to Extreme 145 km/h — choose your challenge.' },
              ].map(item => (
                <div key={item.title} className="card-dark p-4 rounded-xl">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-slate-900 dark:text-white font-semibold text-sm">{item.title}</div>
                  <div className="text-slate-500 dark:text-gray-500 text-xs mt-1 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-green-500/5 rounded-3xl blur-3xl pointer-events-none" />
            <div className="card-dark rounded-3xl p-8 relative">
              <div className="border-l-2 border-green-500 pl-5 mb-8">
                <p className="text-slate-900 dark:text-white text-xl font-semibold leading-relaxed italic">
                  &ldquo;We believe every cricket fan deserves access to world-class batting practice —
                  not just the elite.&rdquo;
                </p>
                <p className="text-slate-500 dark:text-gray-500 text-sm mt-3">— Cricket Arena Mission</p>
              </div>

              <div className="space-y-3">
                <p className="text-slate-500 dark:text-gray-400 text-sm uppercase tracking-widest mb-4">How the model works</p>
                {[
                  { step: '01', title: 'Parent Company', desc: 'Owns technology, ROBOWLER machines, brand, and software platform' },
                  { step: '02', title: 'Franchise Owner', desc: 'Purchases franchise license, sets up physical arena, hires staff' },
                  { step: '03', title: 'Players', desc: 'Book sessions online, walk in, and experience automated cricket' },
                ].map(item => (
                  <div key={item.step}
                    className="flex gap-4 items-start p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <span className="text-green-500 font-black text-sm shrink-0 mt-0.5">{item.step}</span>
                    <div>
                      <div className="text-slate-900 dark:text-white font-semibold text-sm">{item.title}</div>
                      <div className="text-slate-500 dark:text-gray-500 text-xs mt-0.5">{item.desc}</div>
                    </div>
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
