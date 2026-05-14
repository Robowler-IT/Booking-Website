import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from '@/components/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'Cricket Arena — Book Your Session',
  description: 'Experience the future of cricket with ROBOWLER — Pakistan\'s first automated bowling machine arena. Book your session online.',
  keywords: 'cricket arena, bowling machine, ROBOWLER, cricket booking, Pakistan cricket',
  openGraph: {
    title: 'Cricket Arena — Book Your Session',
    description: 'Automated cricket arena powered by ROBOWLER. Solo, 1v1, and Gully Cricket modes.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ca-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
