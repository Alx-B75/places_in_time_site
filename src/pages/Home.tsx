import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FeaturedPlacesCard from '../components/FeaturedPlacesCard'
import FigureCard from '../components/FigureCard'
import EchoSnippet from '../components/EchoSnippet'
import ChatPreviewBlock from '../components/ChatPreviewBlock'
import NewsCard from '../components/NewsCard'
import { api } from '../api'
import type { Place, HistoricalFigure, ContentItem } from '../api/apiClient'
import { resolveMediaUrl } from '../utils/media'
import { toNewsCardItem, type NewsCardItem } from '../utils/content'
import { PLACES } from '../data/places'
import { FIGURES } from '../data/figures'
import { NEWS_FALLBACK_ITEMS } from '../data/newsFallback'

const fallbackPlaceImage = '/images/place-fallback.svg'
const fallbackFigureImage = '/images/figure-fallback.svg'

const valueProps = [
  {
    title: 'Era-aware storytelling',
    description: 'Guided narratives follow political, cultural, and personal arcs so each site feels alive.',
  },
  {
    title: 'People & places intertwined',
    description: 'Trace monarchs, rebels, scientists, and builders directly against the ground they shaped.',
  },
  {
    title: 'Conversational research',
    description: 'Talk to an archivist-trained chatbot that cites sources and keeps the lore grounded.',
  },
]

const featuredSlugOrder = ['bosworth', 'stonehenge', 'hadrians-wall', 'edinburgh-castle']


const chatMessages = [
  { id: 'm1', role: 'user', text: 'What did the ravens really mean to warders at the Tower?' },
  {
    id: 'm2',
    role: 'guide',
    text: 'They became living sigils—a Victorian blend of superstition and branding—yet ravenmasters keep daily field notes on each bird.',
  },
  { id: 'm3', role: 'user', text: 'Could I weave them into a family visit itinerary?' },
  {
    id: 'm4',
    role: 'guide',
    text: 'Absolutely. I can pair the Crown Jewels rotation with apprentice-friendly stories and river walk timings.',
  },
]


type HistoricalFigureLike = HistoricalFigure & { primaryEra?: string; imageUrl?: string }

const accentFromEra = (primaryEra?: string): string => {
  const era = primaryEra?.toLowerCase() ?? ''
  if (era.includes('neolithic')) return 'neolithic'
  if (era.includes('roman')) return 'roman'
  if (era.includes('medieval')) return 'medieval'
  if (era.includes('renaissance') || era.includes('tudor') || era.includes('stuart')) return 'renaissance'
  return 'modern'
}

const truncateCopy = (text?: string | null, max = 150): string => {
  const clean = text?.trim()
  if (!clean) {
    return ''
  }
  const snippet = clean.length > max ? clean.slice(0, max).trimEnd() : clean
  return `${snippet}…`
}

const buildLocation = (place: Place): string => {
  if (place.location_label) return place.location_label
  if (place.locationLabel) return place.locationLabel
  if (place.region || place.country) {
    return [place.region, place.country].filter(Boolean).join(', ')
  }
  return ''
}

const buildPlaceSummary = (place: Place): string => {
  const source = place.summary_gen ?? place.summaries?.gen ?? place.summary ?? place.teaser ?? place.description ?? ''
  return truncateCopy(source)
}

const getHeroImage = (place: Place): string | null | undefined =>
  place.hero_image ?? place.heroImage ?? place.echo_image ?? place.echoImage

const getFigureEra = (figure: HistoricalFigureLike): string =>
  figure.era_primary ?? figure.primaryEra ?? ''

const getFigureSummary = (figure: HistoricalFigureLike): string =>
  figure.summary ?? figure.short_summary ?? figure.teaser ?? 'More details arriving soon.'

const getFigurePortrait = (figure: HistoricalFigureLike): string | undefined =>
  figure.image_url ?? figure.imageUrl

const Home = () => {
  const [places, setPlaces] = useState<Place[]>([])
  const [figures, setFigures] = useState<HistoricalFigure[]>([])
  const [newsFeed, setNewsFeed] = useState<ContentItem[]>([])

  useEffect(() => {
    let cancelled = false

    api
      .listPlaces()
      .then((data) => {
        if (!cancelled) {
          setPlaces(data)
        }
      })
      .catch(() => {
        // fallback to seed data handled below
      })

    api
      .listFigures()
      .then((data) => {
        if (!cancelled) {
          setFigures(data)
        }
      })
      .catch(() => {
        // fallback to seed data handled below
      })

    api
      .listNews({ limit: 3, status: 'published', sort: 'published_at', order: 'desc' })
      .then((data) => {
        if (!cancelled) {
          setNewsFeed(data)
        }
      })
      .catch(() => {
        // fallback handled via static items
      })

    return () => {
      cancelled = true
    }
  }, [])

  const activePlaces: Place[] = places.length > 0 ? places : (PLACES as Place[])
  const activeFigures: HistoricalFigureLike[] = figures.length > 0
    ? (figures as HistoricalFigureLike[])
    : (FIGURES as HistoricalFigureLike[])

  const prioritizedPlaces = featuredSlugOrder
    .map((slug) => activePlaces.find((place) => place.slug === slug))
    .filter((place): place is Place => Boolean(place))

  const fallbackPlaces = activePlaces.filter((place) => !featuredSlugOrder.includes(place.slug))

  const featuredPlaces = [...prioritizedPlaces, ...fallbackPlaces].slice(0, 4).map((place) => {
    const heroImage = getHeroImage(place)
    const image = resolveMediaUrl(heroImage) ?? fallbackPlaceImage
    const location = buildLocation(place)
    const era = place.era_primary ?? place.primaryEra ?? 'Era forthcoming'

    return {
      slug: place.slug,
      title: place.name,
      era,
      accent: accentFromEra(era),
      summary: buildPlaceSummary(place),
      location,
      image,
      imageAlt: `Hero view of ${place.name}${location ? ` — ${location}` : ''}`,
    }
  })

  const figurePreviews = activeFigures.slice(0, 4).map((figure) => {
    const era = getFigureEra(figure)
    const portrait = getFigurePortrait(figure)
    const image = resolveMediaUrl(portrait) ?? fallbackFigureImage

    return {
      slug: figure.slug,
      name: figure.name,
      era: era ? era.replace('-', ' ') : 'Era upcoming',
      summary: getFigureSummary(figure),
      image,
      accent: accentFromEra(era),
    }
  })

  const echoSnippets = activePlaces.slice(0, 3).map((place) => ({
    text: place.echo_text ?? place.echo?.text ?? 'Fresh echo arriving soon.',
    source: place.echo_title ?? place.echo?.title ?? place.name,
  }))

  const newsItems = newsFeed.length > 0 ? newsFeed.slice(0, 3).map((item) => toNewsCardItem(item)) : NEWS_FALLBACK_ITEMS

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">Places in Time</p>
            <h1>Explore historic Britain — and speak with the voices who shaped it.</h1>
            <p className="lead">
              From ancient stones to royal towers, explore iconic places — and meet the people whose decisions, victories, and failures still echo today.
            </p>
            <div className="button-row">
              <Link className="button primary" to="/places">
                Start Exploring
              </Link>
              <Link className="button" to="/chat">
                Talk to History
              </Link>
            </div>
          </div>
          <figure className="home-hero-visual">
            <img
              src="/images/home/homepagebanner.png"
              alt="Places in Time collage showcasing the atlas design system"
              loading="eager"
            />
            <figcaption className="home-hero-visual-meta">
              <span className="era-chip renaissance">Echo Archive</span>
              <blockquote>“Maps remember more than borders—they remember intent.”</blockquote>
              <p>
                Gradient overlays, tracing strokes, and caption rails keep photography, reconstructions, and satellite data within the brand grid.
              </p>
              <small>Visual guidelines travel with every market rollout.</small>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="value-prop">
        {valueProps.map((prop) => (
          <article key={prop.title} className="value-card">
            <h3>{prop.title}</h3>
            <p>{prop.description}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="section-header">
          <p className="eyebrow">Featured Places</p>
          <h2>Discover the places that made history</h2>
          <p>
            Journey through castles, battlefields, monasteries, and cities that shaped Britain. Each location includes fast facts, engaging stories, and “Echoes from the Past” — short glimpses into moments that changed everything.
          </p>
        </div>
        <div className="featured-places-carousel">
          {featuredPlaces.map((place) => (
            <FeaturedPlacesCard key={place.slug} place={place} />
          ))}
        </div>
        <div className="button-row">
          <Link className="button" to="/places">
            View All Places
          </Link>
        </div>
      </section>

      <section>
        <div className="section-header">
          <p className="eyebrow">Meet the Figures</p>
          <h2>History is made by people — now meet them</h2>
          <p>
            Behind every landmark is a life lived boldly. Explore rulers, rebels, warriors, writers, kings, queens, monks, engineers, and visionaries — all brought to life through clear, accessible storytelling.
          </p>
        </div>
        <div className="figure-grid">
          {figurePreviews.map((figure) => (
            <FigureCard key={figure.name} figure={figure} />
          ))}
        </div>
        <div className="button-row">
          <Link className="button" to="/people">
            Explore Historical Figures
          </Link>
        </div>
      </section>

      <section className="home-history-news">
        <div className="section-header">
          <p className="eyebrow">History news & context</p>
          <h2>History in the headlines</h2>
          <p>
            Discover fresh stories, new discoveries, anniversaries, and surprising connections between today’s world and Britain’s past.
          </p>
        </div>
        <div className="home-history-media">
          <img
            src="/images/home/history-news-hero.jpg"
            alt="Collage of clippings from the History News feed"
            loading="lazy"
          />
        </div>
        <div className="news-grid">
          {newsItems.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
        <div className="button-row">
          <Link className="button" to="/news">
            See Latest News
          </Link>
        </div>
      </section>

      <section className="chat-spotlight">
        <div>
          <p className="eyebrow">Talk to History</p>
          <h2>Talk to History — with Quotha, the Scholarly Raven</h2>
          <p>
            Ask questions, explore turning points, and dive deeper into the past. Quotha guides your conversations with the voices of historical figures, drawing on curated sources and expert-checked context.
          </p>
          <p>A thoughtful, intelligent way to explore the past — one question at a time.</p>
          <div className="button-row">
            <Link className="button primary" to="/chat">
              Ask Quotha
            </Link>
          </div>
        </div>
        <ChatPreviewBlock messages={chatMessages} />
      </section>

      <section>
        <div className="section-header">
          <p className="eyebrow">Echoes from the Past</p>
          <h2>Fragments that hum beneath each visit</h2>
        </div>
        <div className="echo-strip">
          {echoSnippets.map((snippet) => (
            <EchoSnippet key={snippet.source} snippet={snippet} />
          ))}
        </div>
      </section>

      <section className="home-shop">
        <div className="home-shop-media">
          <img
            src="/images/home/shop-hero.jpg"
            alt="Selection of Places in Time merchandise"
            loading="lazy"
          />
        </div>
        <div className="home-shop-copy">
          <p className="eyebrow">Places in Time Shop</p>
          <h2>Shop the Collection</h2>
          <p>
            Original artwork, historically grounded designs, and PiT-exclusive merchandise — created to celebrate the places and people that shaped our history.
          </p>
          <Link className="button primary" to="/shop">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="home-about">
        <div className="home-about-copy">
          <p className="eyebrow">About Places in Time</p>
          <h2>Our story</h2>
          <p>
            This is just the beginning. Whether you’re a student, a teacher, a curious explorer, or a time-traveling dreamer, Places in Time is here to bring history to life — one place,
            one story, one voice at a time.
          </p>
          <Link className="button" to="/about">
            Read more
          </Link>
        </div>
        <div className="home-about-media">
          <img src="/images/home/our_story.png" alt="Collage illustrating the Places in Time origin story" loading="lazy" />
        </div>
      </section>

      <section className="closing-cta">
        <p className="eyebrow">Ready to explore</p>
        <h2>Plan a visit, brief the chatbot, or share the atlas.</h2>
        <p>
          Follow a thread from a featured place to its people, then hand the conversation to Talk to History for deeper itineraries and citations.
          Every route keeps the design system intact so the story feels coherent on any device.
        </p>
        <div className="button-row" style={{ justifyContent: 'center' }}>
          <Link className="button primary" to="/places">
            Browse the atlas
          </Link>
          <Link className="button" to="/people">
            Assign figures
          </Link>
        </div>
      </section>
    </>
  )
}

export default Home
