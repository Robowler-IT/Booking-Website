const STEPS = [
  {
    num: '01',
    title: 'Apply Online',
    desc: 'Submit your franchise application with location details, investment capacity, and your vision for the arena.',
  },
  {
    num: '02',
    title: 'Feasibility & Approval',
    desc: 'Our team conducts a location feasibility study. Approved applicants receive a Letter of Intent within 14 days.',
  },
  {
    num: '03',
    title: 'Setup & Training',
    desc: 'Robowler Private Limited installs ROBOWLER hardware, software, and provides full staff + operations training.',
  },
  {
    num: '04',
    title: 'Launch & Operate',
    desc: 'Go live with full platform support. We handle software updates, stat tracking, and national leaderboard integration.',
  },
]

const INCLUDES = [
  { icon: '🤖', label: 'ROBOWLER Unit', desc: 'Automated bowling machine with ESP32 firmware — fully calibrated and tested before delivery.' },
  { icon: '💻', label: 'Arena Software Suite', desc: 'Desktop App, Projector Display, Tablet App, Operator Dashboard — all licensed to your franchise.' },
  { icon: '📡', label: 'Network Setup Guide', desc: 'Dedicated 2.4 GHz arena Wi-Fi specification, router requirements, and cabling plan.' },
  { icon: '📊', label: 'Franchise Dashboard', desc: 'Real-time revenue, session counts, player stats, and arena performance analytics.' },
  { icon: '🎯', label: 'National Brand', desc: 'Your arena appears on the Cricket Arena booking website and leaderboards from day one.' },
  { icon: '🛠️', label: 'Ongoing Support', desc: 'Remote diagnostics, firmware OTA updates, and a dedicated franchise support channel.' },
]

export default function FranchiseSection() {
  return (
    <section id="franchise" className="py-28 bg-white dark:bg-black relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="section-label mb-4">Franchise Model</p>
          <h2 className="section-title mb-6">
            Own a Cricket Arena.{' '}
            <span className="gradient-text">Build a business.</span>
          </h2>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Cricket Arena is a franchise-based network. Robowler Private Limited owns the technology,
            brand, and platform. You own and operate the physical arena — backed by the full
            power of our automated system.
          </p>
        </div>

        {/* What's included */}
        <div className="mb-20">
          <p className="text-xs text-slate-400 dark:text-gray-600 uppercase tracking-widest text-center mb-10">
            What Your Franchise Includes
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INCLUDES.map(item => (
              <div key={item.label}
                className="card-dark rounded-2xl p-5 hover:border-green-500/30 hover:bg-green-500/5 transition-all group">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-slate-900 dark:text-white font-semibold mb-2">{item.label}</h4>
                <p className="text-slate-500 dark:text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to apply */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Steps */}
          <div>
            <p className="text-xs text-slate-400 dark:text-gray-600 uppercase tracking-widest mb-8">How to Apply</p>
            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <div key={step.num} className="flex gap-5">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20
                                    flex items-center justify-center">
                      <span className="text-green-500 dark:text-green-400 font-black text-sm">{step.num}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-px h-8 bg-green-500/10 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-slate-900 dark:text-white font-semibold mb-1">{step.title}</h4>
                    <p className="text-slate-500 dark:text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div className="card-dark rounded-3xl p-8 border-green-500/20 sticky top-24">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20
                            rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-500 dark:text-green-400 text-xs font-medium">Franchise applications open</span>
            </div>

            <h3 className="text-slate-900 dark:text-white text-2xl font-bold mb-3">
              Ready to bring Cricket Arena to your city?
            </h3>
            <p className="text-slate-500 dark:text-gray-500 text-sm leading-relaxed mb-8">
              We are expanding across Pakistan. If you have a commercial space of 2,000–4,000 sq ft
              and the drive to build a cricket business, we want to hear from you.
            </p>

            <div className="space-y-3 mb-8">
              {[
                'Investment: Starting from PKR 35 Lakh',
                'Space required: 2,000 – 4,000 sq ft',
                'Revenue share: 15% to Robowler Private Limited',
                'Break-even: Typically 12–18 months',
                'Setup timeline: 6–10 weeks after approval',
              ].map(item => (
                <div key={item} className="flex gap-3 items-start">
                  <span className="text-green-500 text-sm mt-0.5">✓</span>
                  <span className="text-slate-600 dark:text-gray-400 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <a href="mailto:franchise@cricketarena.pk"
              className="btn-primary w-full justify-center text-base py-4">
              Apply for a Franchise
            </a>
            <p className="text-center text-slate-400 dark:text-gray-600 text-xs mt-4">
              Or email us at franchise@cricketarena.pk
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
