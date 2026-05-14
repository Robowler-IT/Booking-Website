'use client'

const STEPS = [
  { num: 1, label: 'Arena' },
  { num: 2, label: 'Date & Slot' },
  { num: 3, label: 'Game Mode' },
  { num: 4, label: 'Players' },
  { num: 5, label: 'Review' },
  { num: 6, label: 'Sign In' },
  { num: 7, label: 'Payment' },
]

interface BookingProgressProps {
  currentStep: number
}

export default function BookingProgress({ currentStep }: BookingProgressProps) {
  return (
    <div className="w-full">
      {/* Desktop: step pills */}
      <div className="hidden sm:flex items-center justify-center gap-0">
        {STEPS.map((step, i) => {
          const done = currentStep > step.num
          const active = currentStep === step.num
          return (
            <div key={step.num} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${done
                    ? 'bg-green-500 text-black'
                    : active
                    ? 'bg-green-500/20 border-2 border-green-500 text-green-500 dark:text-green-400'
                    : 'bg-slate-100 dark:bg-[#111] border border-slate-200 dark:border-[#2a2a2a] text-slate-400 dark:text-gray-600'}`}>
                  {done ? (
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : step.num}
                </div>
                <span className={`text-[10px] font-medium whitespace-nowrap transition-colors
                  ${active ? 'text-green-500 dark:text-green-400' : done ? 'text-slate-500 dark:text-gray-400' : 'text-slate-400 dark:text-gray-600'}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-12 h-px mb-5 transition-colors ${done ? 'bg-green-500' : 'bg-slate-200 dark:bg-[#2a2a2a]'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: step x of y + bar */}
      <div className="sm:hidden">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-500 dark:text-gray-400">
            Step <span className="text-slate-900 dark:text-white font-semibold">{currentStep}</span> of {STEPS.length}
          </span>
          <span className="text-sm text-green-500 dark:text-green-400 font-semibold">
            {STEPS[currentStep - 1]?.label}
          </span>
        </div>
        <div className="h-1 bg-slate-200 dark:bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
