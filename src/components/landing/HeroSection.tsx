'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animated particle field for background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34,197,94,${p.alpha})`
        ctx.fill()
      }
      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(34,197,94,${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-green-950/30 via-black/80 to-black" />

      {/* Cricket pitch lines (decorative) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[60%] border-l border-r border-green-900/20 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-12 border border-green-900/20 rounded-t-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20
                        rounded-full px-4 py-2 mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-medium">
            Pakistan&apos;s First Automated Cricket Arena
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-6 animate-fade-up">
          <span className="block text-white">Step into the</span>
          <span className="block gradient-text mt-2">Cricket Future</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
          style={{ animationDelay: '0.1s' }}>
          Face ROBOWLER — our intelligent automated bowling machine. Choose your delivery.
          Track your stats. Compete against the best. <span className="text-white font-medium">Book your session in 60 seconds.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
          style={{ animationDelay: '0.2s' }}>
          <Link href="/book" className="btn-primary text-lg px-8 py-4 glow-green">
            <span>🏏</span>
            Book a Session
          </Link>
          <a href="#game-modes" className="btn-secondary text-lg px-8 py-4">
            Explore Game Modes
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-up"
          style={{ animationDelay: '0.3s' }}>
          {[
            { value: '3+', label: 'Arenas Nationwide' },
            { value: '4', label: 'Game Modes' },
            { value: '145', label: 'km/h Max Speed' },
            { value: '24/7', label: 'Stat Tracking' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-green-400">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
        <span className="text-gray-600 text-xs uppercase tracking-widest">Scroll</span>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          className="text-gray-600">
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}
