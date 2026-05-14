import Navbar from '@/components/layout/Navbar'
import BookingFlow from '@/components/booking/BookingFlow'

export const metadata = {
  title: 'Book a Session — Cricket Arena',
  description: 'Book your Cricket Arena session in 60 seconds. Choose your arena, game mode, difficulty, and pay online.',
}

export default function BookPage() {
  return (
    <>
      <Navbar />
      <BookingFlow />
    </>
  )
}
