import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@mantine/core/styles.layer.css'

import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { defaultMetadata } from '~/app/default-metadata'
import '~/app/global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = defaultMetadata()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript forceColorScheme="light" />
      </head>

      <body>
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
