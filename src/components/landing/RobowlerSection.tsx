export default function RobowlerSection() {
  return (
    <section id="technology" className="py-28 bg-white dark:bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — machine visual */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 rounded-full border border-green-500/10 animate-spin-slow" />
              <div className="absolute w-64 h-64 rounded-full border border-green-500/5 animate-spin-slow"
                style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
            </div>

            <div className="relative z-10 card-dark rounded-3xl p-8 max-w-sm mx-auto glow-green">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-widest">ROBOWLER v4.0.1</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-500 dark:text-green-400 text-xs font-medium">Online</span>
                </div>
              </div>

              <div className="text-center py-8">
                <div className="text-8xl mb-4 animate-bounce-slow">🤖</div>
                <div className="text-slate-900 dark:text-white font-black text-2xl tracking-wider">ROBOWLER</div>
                <div className="text-slate-500 dark:text-gray-500 text-sm mt-1">ESP32 · TCP Port 8888</div>
              </div>

              <div className="space-y-3 mt-4">
                {[
                  { label: 'Max Speed', value: '145 km/h', color: 'text-red-500' },
                  { label: 'Delivery Types', value: '10 modes', color: 'text-green-500' },
                  { label: 'Pitch Accuracy', value: '±2 cm', color: 'text-blue-500' },
                  { label: 'Release Latency', value: '<5 ms', color: 'text-yellow-500' },
                ].map(spec => (
                  <div key={spec.label}
                    className="flex justify-between items-center rounded-lg px-3 py-2.5
                               bg-slate-50 dark:bg-[#0a0a0a]">
                    <span className="text-slate-500 dark:text-gray-500 text-xs">{spec.label}</span>
                    <span className={`font-bold text-sm ${spec.color}`}>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — text */}
          <div className="order-1 lg:order-2">
            <p className="section-label mb-4">The Technology</p>
            <h2 className="section-title mb-6">
              Meet <span className="gradient-text">ROBOWLER</span> —
              the machine that never tires
            </h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-8">
              ROBOWLER is our ESP32-powered automated bowling machine, controlled entirely
              by software. It receives commands over the arena Wi-Fi, repositions with stepper
              motor precision, and releases the ball at the exact millisecond — synced with
              a 3D animated bowler on the projector screen above.
            </p>

            <div className="space-y-5 mb-8">
              {[
                {
                  icon: '⚡',
                  title: 'Zero-Latency Release',
                  desc: 'The R command fires the ball in under 5ms. A timestamp is returned and used to sync the projector animation frame-perfectly with the physical release.',
                },
                {
                  icon: '🎯',
                  title: '10 Delivery Types',
                  desc: 'Straight, Bouncer, Yorker, Full Toss, Inswinger, Outswinger, Off Break, Leg Break, Wide, and Short Pitch — each with precise pitch point targeting.',
                },
                {
                  icon: '📡',
                  title: 'Arena Wi-Fi Control',
                  desc: 'ROBOWLER connects to the arena router via 2.4 GHz Wi-Fi. The Desktop App holds the single persistent TCP connection — no internet required for in-session control.',
                },
                {
                  icon: '🔄',
                  title: 'Auto-Repositioning',
                  desc: 'The stepper motor repositions the machine to the exact pitch point before each delivery. The system waits for confirmation before releasing — always precise.',
                },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-xl shrink-0">
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
        </div>
      </div>
    </section>
  )
}
