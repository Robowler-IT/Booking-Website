import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendBookingConfirmation } from '@/lib/email'
import { generateQRCode } from '@/lib/qr'

function generateOTP(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      arena_id, arena_name, date, slot_time, duration, game_mode,
      player_name, user_id, user_email, payment_method, amount,
    } = body

    if (!arena_id || !date || !slot_time || !duration || !game_mode || !player_name || !user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createServiceClient()
    const otp = generateOTP()
    const qrDataUrl = await generateQRCode(otp)

    // Ensure user exists in public.users (synced from auth.users)
    await supabase
      .from('users')
      .upsert({ id: user_id, name: player_name, email: `${user_id}@arena.user`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: 'id', ignoreDuplicates: true })

    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .insert({
        arena_id,
        user_id,
        date,
        slot_time,
        duration,
        game_mode,
        player_name,
        otp_code: otp,
        payment_status: 'pending',
        booking_status: 'confirmed',
        is_walkin: false,
      })
      .select('id')
      .single()

    if (bookingErr) {
      console.error('Booking insert failed:', bookingErr)
      return NextResponse.json({ error: bookingErr.message }, { status: 500 })
    }

    if (payment_method && amount) {
      const { error: paymentErr } = await supabase
        .from('payments')
        .insert({
          booking_id: booking.id,
          amount,
          method: payment_method,
          status: 'pending',
        })

      if (paymentErr) {
        console.error('Payment insert failed:', paymentErr)
      }
    }

    // Send confirmation email with QR + OTP (fire-and-forget)
    if (user_email && arena_name) {
      sendBookingConfirmation(user_email, booking.id, {
        arena: arena_name,
        date,
        slot: slot_time,
        duration: `${duration} min`,
        mode: game_mode,
        player: player_name,
        price: `PKR ${amount?.toLocaleString?.() ?? amount}`,
        otp,
        qrDataUrl,
      }).catch(err => console.error('Email send failed:', err))
    }

    return NextResponse.json({ booking_id: booking.id })
  } catch (err) {
    console.error('Create booking error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
