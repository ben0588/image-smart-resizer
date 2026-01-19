import { MetadataRoute } from 'next'

const baseUrl = 'https://image-smart-resizer.vercel.app'
const languages = ['en', 'zh-TW', 'zh-CN', 'ja', 'ko']

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = languages.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }))

  return [
    {
      url: baseUrl, // 首頁
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...routes,
  ]
}