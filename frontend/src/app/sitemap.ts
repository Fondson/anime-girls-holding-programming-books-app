import type { MetadataRoute } from 'next'

const BASE_URL = process.env.BASE_URL || 'https://anime-girls-holding-programming-books.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
