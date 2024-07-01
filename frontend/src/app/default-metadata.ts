import { cloneDeep } from 'lodash-es'
import { Metadata } from 'next'

const defaultMetadataObj: Metadata = {
  title: {
    template: '%s | Anime Girls Holding Programming Books',
    default: 'Anime Girls Holding Programming Books',
  },
  description: 'null undefined',
  openGraph: {
    images: ['public/og-image.png'],
  },
}

export function defaultMetadata() {
  return cloneDeep(defaultMetadataObj)
}
