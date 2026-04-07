import { cloneDeep } from 'lodash-es'
import { Metadata } from 'next'

const defaultMetadataObj: Metadata = {
  metadataBase: new URL(process.env.BASE_URL || ''),
  alternates: {
    canonical: 'https://anime-girls-holding-programming-books.com/',
  },
  title: {
    template: '%s | Anime Girls Holding Programming Books',
    default: 'Anime Girls Holding Programming Books',
  },
  description: 'null undefined',
}

export function defaultMetadata() {
  return cloneDeep(defaultMetadataObj)
}
