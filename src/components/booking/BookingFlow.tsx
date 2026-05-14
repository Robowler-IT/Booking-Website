'use client'

import { useState, useEffect } from 'react'
import BookingProgress from './BookingProgress'
import StepArena from './steps/StepArena'
import StepDateTime from './steps/StepDateTime'
import StepGameMode from './steps/StepGameMode'
import StepPlayers from './steps/StepPlayers'
import StepReview from './steps/StepReview'
import StepAuth from './steps/StepAuth'
import StepPayment from './steps/StepPayment'

export interface BookingDraft {
  arenaId: string
  arenaName: string
  date: string
  slots: string[]
  format: string
  gameMode: string
  players: string[]
  teamA: string[]
  teamB: string[]
  userId: string
  userEmail: string
}

const INITIAL: BookingDraft = {
  arenaId: '',
  arenaName: '',
  date: '',
  slots: [],
  format: 'solo',
  gameMode: '',
  players: [''],
  teamA: [''],
  teamB: [''],
  userId: '',
  userEmail: '',
}

export default function BookingFlow() {
  const [initialized, setInitialized] = useState(false)
  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<BookingDraft>(INITIAL)

  // Restore draft from sessionStorage after Google OAuth redirect
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('booking-draft')
      if (saved) {
        const parsed = JSON.parse(saved)
        setDraft(parsed)
        setStep(6) // Jump to auth step — will auto-detect signed-in user
      }
    } catch {}
    setInitialized(true)
  }, [])

  // Persist draft to sessionStorage on every change while on step 6
  useEffect(() => {
    if (step === 6 && draft.arenaId) {
      sessionStorage.setItem('booking-draft', JSON.stringify(draft))
    }
  }, [draft, step])

  if (!initialized) return null

  const patch = (p: Partial<BookingDraft>) => setDraft(d => ({ ...d, ...p }))
  const next = () => setStep(s => Math.min(s + 1, 7))
  const back = () => setStep(s => Math.max(s - 1, 1))

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text)' }}>Book a Session</h1>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>Step into the Cricket Arena in 60 seconds.</p>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <BookingProgress currentStep={step} />
        </div>

        {/* Step content */}
        <div className="animate-fade-in">
          {step === 1 && <StepArena draft={draft} onChange={patch} onNext={next} />}
          {step === 2 && <StepDateTime draft={draft} onChange={patch} onNext={next} onBack={back} />}
          {step === 3 && <StepGameMode draft={draft} onChange={patch} onNext={next} onBack={back} />}
          {step === 4 && <StepPlayers draft={draft} onChange={patch} onNext={next} onBack={back} />}
          {step === 5 && <StepReview draft={draft} onNext={next} onBack={back} />}
          {step === 6 && <StepAuth draft={draft} onNext={(userId?: string, userEmail?: string) => { if (userId) patch({ userId, userEmail: userEmail ?? '' }); next() }} onBack={back} />}
          {step === 7 && <StepPayment draft={draft} onBack={back} />}
        </div>
      </div>
    </div>
  )
}
