import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const arenaId = searchParams.get('arena_id')
  const date = searchParams.get('date')

  if (!arenaId || !date) {
    return NextResponse.json({ error: 'Missing arena_id or date' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('slot_time, duration')
    .eq('arena_id', arenaId)
    .eq('date', date)
    .neq('booking_status', 'cancelled')

  if (error) {
    console.error('Slot query error:', error)
    return NextResponse.json({ booked: [] })
  }

  // Build all 30-min blocks and expand each booking's occupied blocks
  const booked30: string[] = []

  // Generate all 30-min labels
  const all30Labels: string[] = []
  for (let t = 9 * 60; t + 30 <= 23 * 60; t += 30) {
    const h24 = Math.floor(t / 60)
    const min = t % 60
    const ampm = h24 >= 12 ? 'PM' : 'AM'
    const h12 = h24 > 12 ? h24 - 12 : h24 === 0 ? 12 : h24
    all30Labels.push(`${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${ampm}`)
  }

  // For each booking, mark all 30-min blocks it occupies as booked
  for (const b of (bookings ?? [])) {
    const [hh, mm] = (b.slot_time as string).split(':').map(Number)
    const startMin = hh * 60 + mm
    const dur = (b.duration as number) ?? 60
    const blocks = dur / 30

    for (let i = 0; i < blocks; i++) {
      const t = startMin + i * 30
      const idx = (t - 9 * 60) / 30
      if (idx >= 0 && idx < all30Labels.length) {
        booked30.push(all30Labels[idx])
      }
    }
  }

  return NextResponse.json({ booked: booked30 })
}
