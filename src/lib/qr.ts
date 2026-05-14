import QRCode from 'qrcode'

export async function generateQRCode(bookingId: string): Promise<string> {
  const dataUrl = await QRCode.toDataURL(bookingId, {
    width: 240,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  })
  return dataUrl
}
