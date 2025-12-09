import { getSanityClient } from './sanityClient'

export interface HomepageContent {
  heroTitle: string
  heroSubtitle: string
  heroCtaPrimaryLabel: string
  heroCtaSecondaryLabel: string
  placesTitle: string
  placesBody: string
  peopleTitle: string
  peopleBody: string
  quothaTitle: string
  quothaBody: string
  quothaCtaLabel: string
  newsTitle: string
  newsBody: string
  newsCtaLabel: string
  shopTitle: string
  shopBody: string
  shopCtaLabel: string
}

export const fallbackHomepageContent: HomepageContent = {
  heroTitle: 'Explore historic Britain — and speak with the voices who shaped it.',
  heroSubtitle:
    'From ancient stones to royal towers, explore iconic places — and meet the people whose decisions, victories, and failures still echo today.',
  heroCtaPrimaryLabel: 'Start Exploring',
  heroCtaSecondaryLabel: 'Talk to History',
  placesTitle: 'Discover the places that made history',
  placesBody:
    'Journey through castles, battlefields, monasteries, and cities that shaped Britain.\nEach location includes fast facts, engaging stories, and “Echoes from the Past” — short glimpses into moments that changed everything.',
  peopleTitle: 'History is made by people — now meet them',
  peopleBody:
    'Behind every landmark is a life lived boldly.\nExplore rulers, rebels, warriors, writers, kings, queens, monks, engineers, and visionaries — all brought to life through clear, accessible storytelling.',
  quothaTitle: 'Talk to History — with Quotha, the Scholarly Raven',
  quothaBody:
    'Ask questions, explore turning points, and dive deeper into the past.\nQuotha guides your conversations with the voices of historical figures, drawing on curated sources and expert-checked context.\n\nA thoughtful, intelligent way to explore the past — one question at a time.',
  quothaCtaLabel: 'Ask Quotha',
  newsTitle: 'History in the headlines',
  newsBody:
    'Discover fresh stories, new discoveries, anniversaries, and surprising connections between today’s world and Britain’s past.',
  newsCtaLabel: 'See Latest News',
  shopTitle: 'Shop the Collection',
  shopBody:
    'Original artwork, historically grounded designs, and PiT-exclusive merchandise — created to celebrate the places and people that shaped our history.',
  shopCtaLabel: 'Shop Now',
}

export async function fetchHomepageContent(): Promise<HomepageContent> {
  const client = getSanityClient()
  if (!client) {
    return fallbackHomepageContent
  }

  const query = `*[_type == "homepage"][0]{
    heroTitle,
    heroSubtitle,
    heroCtaPrimaryLabel,
    heroCtaSecondaryLabel,
    placesTitle,
    placesBody,
    peopleTitle,
    peopleBody,
    quothaTitle,
    quothaBody,
    quothaCtaLabel,
    newsTitle,
    newsBody,
    newsCtaLabel,
    shopTitle,
    shopBody,
    shopCtaLabel
  }`

  try {
    const data = await client.fetch<Partial<HomepageContent> | null>(query)

    if (!data) {
      return fallbackHomepageContent
    }

    return {
      ...fallbackHomepageContent,
      ...data,
    }
  } catch {
    return fallbackHomepageContent
  }
}
