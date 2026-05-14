import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
})

export async function sendBookingConfirmation(to: string, _bookingId: string, details: {
  arena: string
  date: string
  slot: string
  duration: string
  mode: string
  player: string
  price: string
  otp?: string
  qrDataUrl?: string
}) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#fff">
  <div style="text-align:center;margin-bottom:24px">
    <h1 style="color:#16a34a;margin:0;font-size:28px">🏏 Booking Confirmed</h1>
    <p style="color:#666;font-size:14px;margin-top:4px">Your session at <strong>${details.arena}</strong> is confirmed.</p>
  </div>

  <table style="width:100%;border-collapse:collapse;margin:0 0 20px;font-size:14px">
    <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888;width:100px">Arena</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600">${details.arena}</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888">Date</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${details.date}</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888">Slot</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${details.slot} (${details.duration})</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888">Mode</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${details.mode}</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#888">Player</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${details.player}</td></tr>
    <tr><td style="padding:8px 12px;color:#888">Total</td><td style="padding:8px 12px;font-weight:700;color:#16a34a;font-size:16px">${details.price}</td></tr>
  </table>

  ${details.qrDataUrl ? `
  <div style="text-align:center;margin:24px 0;padding:20px;background:#f9fafb;border-radius:12px">
    <p style="color:#666;font-size:14px;margin:0 0 8px">Scan this QR at the arena tablet</p>
    <img src="${details.qrDataUrl}" alt="QR Code" style="width:180px;height:180px;margin:8px auto;display:block;border:2px solid #e5e7eb;border-radius:8px" />
    <p style="color:#999;font-size:11px;margin:4px 0 0">You can save this image for offline use</p>
  </div>
  ` : ''}

  ${details.otp ? `
  <div style="text-align:center;margin:24px 0;padding:20px;background:#f0fdf4;border-radius:12px;border:2px dashed #86efac">
    <p style="color:#666;font-size:13px;margin:0 0 4px">Or enter this code on the tablet:</p>
    <div style="font-size:32px;font-weight:800;letter-spacing:8px;color:#15803d;font-family:monospace;padding:8px">${details.otp}</div>
  </div>
  ` : ''}

  <p style="color:#999;font-size:13px;text-align:center;margin-top:24px">See you at the crease! 🎯</p>
  <p style="color:#aaa;font-size:11px;text-align:center">Cricket Arena — ${details.arena}</p>
</body>
</html>`

  try {
    await transporter.sendMail({
      from: `"Cricket Arena" <${process.env.SMTP_USER}>`,
      to,
      subject: `🏏 Booking Confirmed — ${details.arena} on ${details.date}`,
      html,
    })
    return { sent: true }
  } catch (err) {
    console.error('Email send failed:', err)
    return { sent: false }
  }
}
