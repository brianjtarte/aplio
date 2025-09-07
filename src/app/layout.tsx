// import './globals.css'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Aplio',
//   description: 'AI-powered job application automation',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   )
// }

import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'Aplio - AI-Powered Job Application Automation',
  description: 'Let AI apply to 100+ jobs per month while you focus on interviews.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}