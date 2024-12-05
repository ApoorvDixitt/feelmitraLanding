import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://feelmitra.in',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // {
    //   url: 'https://feelmitra.in/about',
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
    // {
    //   url: 'https://feelmitra.in/contact',
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.5,
    // },
    // Add more URLs as your site grows
  ]
} 