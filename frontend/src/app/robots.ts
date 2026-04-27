import type { MetadataRoute } from 'next'

const BASE_URL = process.env.BASE_URL || 'https://anime-girls-holding-programming-books.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/share/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
