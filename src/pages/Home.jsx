import { Link } from 'react-router-dom'
import HeroBanner from '../components/HeroBanner'
import FeaturedPlacesCard from '../components/FeaturedPlacesCard'
import FigureCard from '../components/FigureCard'
import EchoSnippet from '../components/EchoSnippet'
import ChatPreviewBlock from '../components/ChatPreviewBlock'
import NewsCard from '../components/NewsCard'
import { PLACES } from '../data/places'
import { FIGURES } from '../data/figures'

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

const figureImagery = {
  'richard-iii': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
  'henry-vii': 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=800&q=60',
  'mary-queen-of-scots': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60',
  'saint-aidan': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=60',
  aethelflaed: 'https://images.unsplash.com/photo-1437913135140-944c1ee62782?auto=format&fit=crop&w=800&q=60',
}

const shopProducts = [
  {
    id: 'shield-wall-print',
    title: 'Saxon Shield Wall Print',
    image: 'https://ih1.redbubble.net/image.5749775065.5694/raf,360x360,075,t,fafafa:ca443f4786.u4.jpg',
    link: 'https://www.redbubble.com/i/photographic-print/Saxon-shield-wall-print-by-Alex-Bunting/167965694.6Q0TX',
  },
  {
    id: 'lindisfarne-sticker',
    title: 'Lindisfarne 793 Sticker',
    image: 'https://ih1.redbubble.net/image.5865031963.3430/raf,360x360,075,t,fafafa:ca443f4786.u2.jpg',
    link: 'https://www.redbubble.com/i/sticker/Lindisfarne-793-Row-Hard-Raid-Harder-Viking-Humour-T-Shirt-by-Alex-Bunting/171693430.EJUG5',
  },
]

const placeImagery = {
  bosworth: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60',
  stonehenge: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=60',
  'hadrians-wall': 'https://images.unsplash.com/photo-1500534314209-75f4cdb5e7ae?auto=format&fit=crop&w=1200&q=60',
  'edinburgh-castle': 'https://images.unsplash.com/photo-1500534314209-91e3b4ef7de7?auto=format&fit=crop&w=1200&q=60',
  'tower-of-london': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=60',
  'battle-of-hastings': 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=60',
}

const defaultPlaceImage = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60'

const accentFromEra = (primaryEra) => {
  if (!primaryEra) return 'modern'
  const era = primaryEra.toLowerCase()
  if (era.includes('neolithic')) return 'neolithic'
  if (era.includes('roman')) return 'roman'
  if (era.includes('medieval')) return 'medieval'
  if (era.includes('renaissance') || era.includes('tudor')) return 'renaissance'
  return 'modern'
}

const truncateSummary = (text = '', max = 150) => {
  const clean = text.trim()
  if (!clean) return ''
  const snippet = clean.length > max ? clean.slice(0, max).trimEnd() : clean
  return `${snippet}…`
}

const featuredSlugOrder = ['bosworth', 'stonehenge', 'hadrians-wall', 'edinburgh-castle']
const prioritizedPlaces = featuredSlugOrder
  .map((slug) => PLACES.find((place) => place.slug === slug))
  .filter(Boolean)
const fallbackPlaces = PLACES.filter((place) => !featuredSlugOrder.includes(place.slug))

const featuredPlaces = [...prioritizedPlaces, ...fallbackPlaces].slice(0, 4).map((place) => ({
  slug: place.slug,
  title: place.name,
  era: place.era_primary,
  accent: accentFromEra(place.primaryEra ?? ''),
  summary: truncateSummary(place.summaries?.gen ?? place.teaser ?? ''),
  location: place.location_label,
  image: place.hero_image || placeImagery[place.slug] || place.echo_image || defaultPlaceImage,
  imageAlt: `Hero view of ${place.name}${place.location_label ? ` — ${place.location_label}` : ''}`,
}))

const figurePreviews = FIGURES.slice(0, 4).map((figure) => ({
  slug: figure.slug,
  name: figure.name,
  era: figure.primaryEra?.replace('-', ' ') ?? 'Era upcoming',
  summary: figure.summary ?? figure.teaser ?? '',
  image: figureImagery[figure.slug],
  accent: accentFromEra(figure.primaryEra ?? ''),
}))

const echoSnippets = PLACES.slice(0, 3).map((place) => ({
  text: place.echo?.text ?? '/* TODO: add echo */',
  source: place.echo?.title ?? place.name,
}))

const newsItems = [
  {
    id: 'n1',
    title: 'Design tokens locked for v1 launch',
    dateLabel: '05 Dec 2025',
    category: 'Design',
    summary: 'Colour, typography, and spacing tokens now drive the entire layout and component library.',
    link: '#',
  },
  {
    id: 'n2',
    title: 'Atlas hero rebuilt for 21:9 storytelling',
    dateLabel: '02 Dec 2025',
    category: 'Product',
    summary: 'Hero section now mirrors the production overlay grid so media swaps remain on-brand.',
    link: '#',
  },
  {
    id: 'n3',
    title: 'Shop integration prep underway',
    dateLabel: '29 Nov 2025',
    category: 'Operations',
    summary: 'Merchandise catalog requirements drafted; storefront stub online for stakeholder review.',
    link: '#',
  },
]

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

const Home = () => {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">Places in Time</p>
            <h1>Britain’s landscape, retold with living voices.</h1>
            <p className="lead">
              Navigate castles, islands, markets, and moors through layered stories that weave place, people, and purpose.
              The system keeps every era legible—from Neolithic engineering to industrial skylines.
            </p>
            <div className="button-row">
              <Link className="button primary" to="/places">
                Explore the atlas
              </Link>
              <Link className="button" to="/people">
                Meet the figures
              </Link>
              <Link className="button" to="/chat">
                Talk to the archives
              </Link>
            </div>
          </div>
          <HeroBanner
            quote="“Maps remember more than borders—they remember intent.”"
            chipLabel="Echo Archive"
            chipTone="renaissance"
            description="Layer gradient overlays, stroke arcs, and safe zones to showcase photography, satellite traces, or reconstructions."
            caption="Visual guidelines travel with every market rollout."
          />
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
          <h2>Anchor the journey with hero sites</h2>
          <p>
            Each card carries an era chip, overlay gradient, and quick readouts for summaries, logistics, or interactive layers.
          </p>
        </div>
        <div className="featured-places-carousel">
          {featuredPlaces.map((place) => (
            <FeaturedPlacesCard key={place.title} place={place} />
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <p className="eyebrow">Meet the Figures</p>
          <h2>People who bend the map</h2>
        </div>
        <div className="figure-grid">
          {figurePreviews.map((figure) => (
            <FigureCard key={figure.name} figure={figure} />
          ))}
        </div>
      </section>

      <section className="home-shop">
        <div className="home-shop-copy">
          <p className="eyebrow">Threads in Time</p>
          <h2>Wear the stories we map</h2>
          <p>Welcome to Threads in Time — a growing collection of historically inspired designs from Places in Time.</p>
          <p>Each piece is part of our journey through the past, with new designs added regularly.</p>
          <p>
            If there’s a place, figure, or moment you’d love to see brought to life, let us know. You are welcome to send us a message. We’re
            always open to ideas from fellow time travelers.
          </p>
        </div>
        <div className="home-shop-products">
          {shopProducts.map((product) => (
            <article key={product.id} className="shop-product-card">
              {product.image && (
                <div className="shop-product-media">
                  <img src={product.image} alt={`${product.title} preview`} loading="lazy" />
                </div>
              )}
              <h3>{product.title}</h3>
              <a className="button" href={product.link} target="_blank" rel="noreferrer">
                View on Redbubble
              </a>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="section-header">
          <p className="eyebrow">Latest News</p>
          <h2>Blueprint progress reports</h2>
          <p>
            Track design sign-offs, content drops, and release prep without leaving the homepage. Swap this stub for the CMS feed when ready.
          </p>
        </div>
        <div className="news-grid">
          {newsItems.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
        <div className="button-row">
          <Link className="button" to="/news">
            See all news
          </Link>
        </div>
      </section>

      <section className="chat-spotlight">
        <div>
          <p className="eyebrow">Conversation Spotlight</p>
          <h2>Chat with the keeper of echoes</h2>
          <p>
            The chatbot UI uses stroke arcs and layered panels to keep sources, suggestions, and safety cues visible. This mock conversation shows how prompts, responses, and itinerary boosts sit together.
          </p>
          <div className="button-row">
            <Link className="button primary" to="/chat">
              Launch the chat beta
            </Link>
            <Link className="button" to="/places">
              Attach to a place
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

      <section className="closing-cta">
        <p className="eyebrow">Ready to launch</p>
        <h2>Preview the production build or tailor it to your region.</h2>
        <p>
          Swap in your CMS data, configure backend endpoints, and keep the stroke language intact to preserve the visual rhythm across hero, cards, and chat.
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
