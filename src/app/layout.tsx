import './globals.css'

export const metadata = {
  title: 'Calm Me, Lord',
  description: 'Soothe my heart by the word from God',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
