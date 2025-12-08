import type { ContentItem } from '../api/apiClient'
import { resolveMediaUrl } from './media'

export type NewsCardItem = {
  id: string
  title: string
  summary?: string
  category?: string
  dateLabel?: string
  link?: string
  to?: string
  ctaLabel?: string
  image?: string
}

const newsDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const getStringField = (item: ContentItem, keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = item[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value
    }
  }
  return undefined
}

export const formatContentDate = (iso?: string | null): string | undefined => {
  if (!iso) return undefined
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }
  return newsDateFormatter.format(date)
}

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

export const toNewsCardItem = (item: ContentItem, fallbackRoute = '/news'): NewsCardItem => {
  const summary = item.summary ?? item.excerpt ?? ''
  const ctaUrl = getStringField(item, ['cta_url', 'ctaUrl', 'external_url', 'externalUrl', 'link_url', 'linkUrl'])
  const ctaLabel = getStringField(item, ['cta_label', 'ctaLabel']) ?? (ctaUrl ? 'Read update' : undefined)

  const heroImage = getStringField(item, [
    'hero_image',
    'heroImage',
    'featured_image',
    'featuredImage',
    'thumbnail_image',
    'thumbnailImage',
    'promo_image',
    'promoImage',
  ])

  const resolvedImage = resolveMediaUrl(heroImage) ?? heroImage

  return {
    id: String(item.id ?? item.slug ?? generateId()),
    title: item.title ?? 'Update pending',
    summary: summary || 'More details arriving soon.',
    category: item.category ?? item.type ?? item.tags?.[0] ?? 'Update',
    dateLabel: formatContentDate(item.published_at ?? item.updated_at),
    link: ctaUrl,
    to: ctaUrl ? undefined : fallbackRoute,
    ctaLabel,
    image: resolvedImage,
  }
}

export const getContentHeroImage = (item: ContentItem): string | undefined => {
  const heroImage = getStringField(item, [
    'hero_image',
    'heroImage',
    'featured_image',
    'featuredImage',
    'promo_image',
    'promoImage',
    'thumbnail_image',
    'thumbnailImage',
  ])

  return resolveMediaUrl(heroImage) ?? heroImage
}

export const collectContentTags = (items: ContentItem[]): string[] => {
  const tags = new Set<string>()
  items.forEach((item) => {
    item.tags?.forEach((tag) => {
      if (tag) {
        tags.add(tag)
      }
    })
  })
  return Array.from(tags).sort((a, b) => a.localeCompare(b))
}
