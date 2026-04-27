import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'https://anime-girls-holding-programming-books.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    template: '%s | Anime Girls Holding Programming Books',
    default: 'Anime Girls Holding Programming Books',
  },
  description: 'null undefined',
}
