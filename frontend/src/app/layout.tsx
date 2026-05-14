import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@mantine/core/styles.layer.css'

import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { defaultMetadata } from '~/app/default-metadata'
import '~/app/global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = defaultMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="BMzqne3UdXMN1j77cizKuuNIMmSalRQ5X0QsTYrlx-E"
        />
        <ColorSchemeScript forceColorScheme="light" />
      </head>

      <body>
        <div
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          <h1>Anime Girls Holding Programming Books</h1>
          <p>
            A searchable web viewer for the Anime Girls Holding Programming Books image collection.
            Browse, search, and gacha a random waifu holding a programming book. Sourced from the
            cat-milk/Anime-Girls-Holding-Programming-Books GitHub repository.
          </p>
        </div>
        <MantineProvider
          forceColorScheme="light"
          theme={{
            fontFamily: `${inter.style.fontFamily}, sans-serif`,
            spacing: {
              xxxs: '0.25rem',
              xxs: '0.5rem',
            },
          }}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}
