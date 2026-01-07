import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'To-Do List Challenge',
  description: 'Aplicação de To-Do List com arquitetura API-first',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
