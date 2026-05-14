import { createClient } from '@/lib/supabase/server'

export async function getAvailableSlots(
  arenaId: string,
  date: string,
  durationMins: number
): Promise<{ free: string[]; booked: string[] }> {
  const supabase = await createClient()

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('slot_time, duration')
    .eq('arena_id', arenaId)
    .eq('date', date)
    .neq('booking_status', 'cancelled')

  if (error) {
    console.error('getAvailableSlots error:', error)
    return { free: [], booked: [] }
  }

  const openHour = 9
  const closeHour = 23
  const allSlots: string[] = []
  for (let h = openHour; h < closeHour; h++) {
    for (let m = 0; m < 60; m += durationMins) {
      if (h === closeHour - 1 && m + durationMins > 0) break
      const hour = h > 11 ? h - 12 || 12 : h
      const ampm = h >= 12 ? 'PM' : 'AM'
      allSlots.push(`${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`)
    }
  }

  const bookedSet = new Set((bookings ?? []).map((b) => {
    const [hStr, minStr] = (b.slot_time as string).split(':')
    const h = parseInt(hStr, 10)
    const min = parseInt(minStr, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')} ${ampm}`
  }))

  return {
    free: allSlots.filter((s) => !bookedSet.has(s)),
    booked: Array.from(bookedSet),
  }
}

export async function createBooking(booking: {
  arena_id: string
  user_id: string
  date: string
  slot_time: string
  duration: number
  game_mode: string
  player_name: string
}): Promise<{ booking_id: string } | { error: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      arena_id: booking.arena_id,
      user_id: booking.user_id,
      date: booking.date,
      slot_time: booking.slot_time,
      duration: booking.duration,
      game_mode: booking.game_mode,
      player_name: booking.player_name,
      payment_status: 'pending',
      booking_status: 'confirmed',
      is_walkin: false,
    })
    .select('id')
    .single()

  if (error) {
    console.error('createBooking error:', error)
    return { error: error.message }
  }

  return { booking_id: (data as { id: string }).id }
}
