import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shared Roll',
  description: "I'm rolling for anime girls holding programming books.",
  alternates: {
    canonical: '/share/',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
