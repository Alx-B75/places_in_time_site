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

const accentFromEra = (primaryEra) => {
  if (!primaryEra) return 'modern'
  if (primaryEra.includes('neolithic')) return 'neolithic'
  if (primaryEra.includes('roman')) return 'roman'
  if (primaryEra.includes('medieval')) return 'medieval'
  if (primaryEra.includes('renaissance') || primaryEra.includes('tudor')) return 'renaissance'
  return 'modern'
}

const featuredPlaces = PLACES.slice(0, 3).map((place) => ({
  title: place.name,
  era: place.era_primary,
  accent: accentFromEra(place.primaryEra ?? ''),
  summary: place.teaser ?? place.summaries?.gen,
  location: place.location_label,
  highlight: place.echo?.title ?? place.types?.join(', '),
}))

const figurePreviews = FIGURES.slice(0, 4).map((figure) => ({
  name: figure.name,
  era: figure.primaryEra?.replace('-', ' ') ?? 'Era upcoming',
  title: figure.slug === 'aethelflaed' ? 'Lady of the Mercians' : figure.slug === 'saint-aidan' ? 'Missionary Bishop' : 'Key Figure',
  summary: figure.teaser,
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
  const totalPlaces = PLACES.length
  const totalFigures = FIGURES.length

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
            <div className="hero-stat-grid">
              <div className="hero-stat">
                <strong>{totalPlaces}</strong>
                <p>Curated locations ready for launch</p>
              </div>
              <div className="hero-stat">
                <strong>{totalFigures}+</strong>
                <p>Figures paired with site timelines</p>
              </div>
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
