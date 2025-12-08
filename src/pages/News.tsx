import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import NewsCard from '../components/NewsCard'
import { api } from '../api'
import type { ContentItem } from '../api/apiClient'
import {
  collectContentTags,
  getContentHeroImage,
  toNewsCardItem,
  type NewsCardItem,
} from '../utils/content'
import { NEWS_FALLBACK_ITEMS } from '../data/newsFallback'

const fallbackFeatureImage = '/images/home/history-news-hero.jpg'

type LoadingState = 'idle' | 'loading' | 'ready' | 'error'

const News = () => {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [activeTag, setActiveTag] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoadingState('loading')

    api
      .listNews({ limit: 40, status: 'published', sort: 'published_at', order: 'desc' })
      .then((data) => {
        if (cancelled) return
        setItems(data)
        setLoadingState('ready')
      })
      .catch(() => {
        if (!cancelled) {
          setLoadingState('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const normalizedSearch = search.trim().toLowerCase()

  const filteredItems = useMemo(() => {
    if (items.length === 0) {
      return []
    }

    return items.filter((item) => {
      const matchesTag = activeTag === 'all' || item.tags?.includes(activeTag)
      if (!matchesTag) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const haystack = `${item.title ?? ''} ${item.summary ?? ''} ${item.excerpt ?? ''}`.toLowerCase()
      return haystack.includes(normalizedSearch)
    })
  }, [items, activeTag, normalizedSearch])

  const tags = useMemo(() => collectContentTags(items), [items])

  const useFallbackData = items.length === 0
  const featureSource = useFallbackData ? null : filteredItems[0] ?? items[0] ?? null
  const featureCard: NewsCardItem = useFallbackData
    ? NEWS_FALLBACK_ITEMS[0]
    : featureSource
      ? toNewsCardItem(featureSource, `/news?highlight=${featureSource.slug}`)
      : NEWS_FALLBACK_ITEMS[0]

  const featureImage = featureSource
    ? getContentHeroImage(featureSource) ?? fallbackFeatureImage
    : fallbackFeatureImage

  const remainderItems = useFallbackData
    ? []
    : featureSource
      ? filteredItems.slice(1)
      : filteredItems

  const newsCards: NewsCardItem[] = useFallbackData
    ? NEWS_FALLBACK_ITEMS.slice(1)
    : remainderItems.map((item) => toNewsCardItem(item, `/news?highlight=${item.slug}`))

  const noMatches =
    !useFallbackData &&
    items.length > 0 &&
    filteredItems.length === 0 &&
    (activeTag !== 'all' || normalizedSearch.length > 0)

  const featureCtaLabel = featureCard.ctaLabel ?? (featureCard.link ? 'Read update' : 'View story')
  const renderFeatureCta = () => {
    if (featureCard.link) {
      return (
        <a className="button primary" href={featureCard.link} target="_blank" rel="noopener noreferrer">
          {featureCtaLabel}
        </a>
      )
    }

    if (featureCard.to) {
      return (
        <Link className="button primary" to={featureCard.to}>
          {featureCtaLabel}
        </Link>
      )
    }

    return null
  }

  return (
    <section className="news-page" aria-live="polite">
      <header className="page-header news-page-header">
        <p className="eyebrow">History News</p>
        <h1>Unified dispatches from the ContentItem feed</h1>
        <p>
          Track release notes, policy shifts, and partnership briefs sourced directly from the new backend endpoint. Filter by
          editorial tags or search by keyword to surface specific updates.
        </p>
      </header>

      <div className="news-controls">
        <div className="news-tags" aria-label="Filter by tag">
          <button
            type="button"
            className={activeTag === 'all' ? 'tag-filter is-active' : 'tag-filter'}
            onClick={() => setActiveTag('all')}
            aria-pressed={activeTag === 'all'}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={activeTag === tag ? 'tag-filter is-active' : 'tag-filter'}
              onClick={() => setActiveTag(tag)}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="news-search">
          <label htmlFor="news-search-input">Search updates</label>
          <input
            id="news-search-input"
            type="search"
            placeholder="Search announcements"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <article className="news-feature">
        {featureImage && (
          <div className="news-feature-media">
            <img src={featureImage} alt="Featured news visual" loading="lazy" />
          </div>
        )}
        <div className="news-feature-body">
          <span className="news-meta">
            <strong>{featureCard.dateLabel ?? 'Coming soon'}</strong>
            <span>{featureCard.category ?? 'Update'}</span>
          </span>
          <h2>{featureCard.title}</h2>
          <p>{featureCard.summary}</p>
          <div className="button-row">
            {renderFeatureCta()}
            <Link className="button" to="/chat">
              Talk to history
            </Link>
          </div>
        </div>
      </article>

      {loadingState === 'loading' && (
        <p className="news-status">Loading live feed…</p>
      )}
      {loadingState === 'error' && (
        <p className="news-status news-status-error">Live feed unavailable. Showing static newsroom highlights.</p>
      )}

      {noMatches ? (
        <p className="news-status">No news matches those filters. Reset above to see the full feed.</p>
      ) : (
        <div className="news-grid">
          {newsCards.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}

export default News
