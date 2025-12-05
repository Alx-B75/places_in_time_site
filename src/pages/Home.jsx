import { Link } from 'react-router-dom'
import FeaturedPlacesCard from '../components/FeaturedPlacesCard'
import FigureCard from '../components/FigureCard'
import EchoSnippet from '../components/EchoSnippet'
import ChatPreviewBlock from '../components/ChatPreviewBlock'

const valueProps = [
  {
    title: 'Era-aware storytelling',
    description: 'Guided narratives follow the political, cultural, and personal arcs of each location.',
  },
  {
    title: 'People & places intertwined',
    description: 'Trace how monarchs, rebels, scientists, and builders shaped the ground beneath your feet.',
  },
  {
    title: 'Conversational research',
    description: 'Talk to an archivist-trained chatbot that cites sources and keeps the lore grounded.',
  },
]

const featuredPlaces = [
  {
    title: 'Bosworth Battlefield',
    era: 'Late Medieval',
    accent: 'medieval',
    location: 'Leicestershire, England',
    summary: 'Stand at the turning point that crowned the Tudors and silenced a dynasty.',
    highlight: 'Field notes, interactive alignments, rebel rosters',
  },
  {
    title: 'Stonehenge',
    era: 'Neolithic',
    accent: 'neolithic',
    location: 'Salisbury Plain',
    summary: 'Track solstice rituals, engineering feats, and global pilgrimages across millennia.',
    highlight: 'Solar overlays, timeline scrollytelling',
  },
  {
    title: 'Hadrian’s Wall',
    era: 'Roman Britain',
    accent: 'roman',
    location: 'Northumberland coast-to-coast',
    summary: 'Follow soldiers, traders, and families living on the Empire’s ragged edge.',
    highlight: 'Unit rosters, fort reconstructions, trail planning',
  },
]

const figurePreviews = [
  {
    name: 'Eleanor of Aquitaine',
    era: 'High Medieval',
    title: 'Queen & Strategist',
    summary: 'Power broker across courts from Poitiers to Westminster, weaving alliances and culture.',
    image: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Ignatius Sancho',
    era: 'Georgian Britain',
    title: 'Composer & Abolitionist',
    summary: 'His letters and music sketch Black British life amid salons, slavery debates, and theatre.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Mary Anning',
    era: 'Regency to Early Victorian',
    title: 'Fossil Hunter',
    summary: 'From Lyme Regis cliffs to scientific circles, she rewrote natural history with each find.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60',
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

const echoSnippets = [
  {
    text: '“We saw bonfires blaze all along Hadrian’s old frontier as if Rome breathed again.”',
    source: 'Border Reeve, 1542',
  },
  {
    text: '“Stonehenge made us measure the sun before we could spell it.”',
    source: 'Early Antiquarian Letter, 1723',
  },
  {
    text: '“In York, every cellar is a rumor with mortar.”',
    source: 'Minster Archivist, 1911',
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
              Navigate castles, islands, markets, and moors through layered stories that weave place, people, and purpose. Our design system keeps every era legible—from Neolithic engineering to industrial skylines.
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
                <strong>48</strong>
                <p>Curated locations ready for launch</p>
              </div>
              <div className="hero-stat">
                <strong>120+</strong>
                <p>Figures paired with site timelines</p>
              </div>
            </div>
          </div>
          <div className="home-hero-visual" aria-hidden="true">
            <div className="hero-overlay one" />
            <div className="hero-overlay two" />
            <p>“Maps remember more than borders—they remember intent.”</p>
            <span className="era-chip renaissance">Echo Archive</span>
            <p>
              Layer gradient overlays, stroke arcs, and safe zones to house photography, satellite traces, or AI-generated reconstructions.
            </p>
          </div>
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
            Each card carries an era chip, overlay gradient, and quick readouts for summaries, logistics, or interactive layers. Swap in real imagery when the CMS sync lands.
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
