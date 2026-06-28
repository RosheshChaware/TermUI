import type { MetadataRoute } from 'next'
import rawRegistry from '@/data/registry.json'
import { getAllSlugs } from '@/lib/source'

const SITE_URL = 'https://termui.io'

interface RegistryEntry { slug: string }

/**
 * Full sitemap: home, catalog, every component page, and every docs page.
 * The static public/sitemap.xml listed only 30 URLs and missed the 230
 * component pages and most docs. This route lists them all.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()
    const registry = rawRegistry as RegistryEntry[]

    const staticPages: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${SITE_URL}/components`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${SITE_URL}/compare/ink`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${SITE_URL}/compare/tui-frameworks`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    ]

    const componentPages: MetadataRoute.Sitemap = registry.map((c) => ({
        url: `${SITE_URL}/components/${c.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
    }))

    const docPages: MetadataRoute.Sitemap = getAllSlugs().map(({ slug }) => ({
        url: `${SITE_URL}/docs/${slug.join('/')}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: slug[0] === 'getting-started' ? 0.9 : 0.8,
    }))

    return [...staticPages, ...componentPages, ...docPages]
}
