import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { PLACES } from '../src/data/places.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const toArray = (...candidates) => {
  for (const value of candidates) {
    if (Array.isArray(value) && value.length > 0) {
      return value.filter((item) => typeof item === 'string' && item.length > 0)
    }
    if (typeof value === 'string' && value.length > 0) {
      return [value]
    }
  }
  return []
}

const flattenPlace = (place) => {
  if (!place?.slug) {
    throw new Error('Place is missing slug')
  }
  if (!place?.name) {
    throw new Error(`Place ${place.slug} is missing name`)
  }

  return {
    slug: place.slug,
    name: place.name,
    location_label: place.location_label ?? place.locationLabel ?? null,
    country: place.country ?? null,
    region: place.region ?? null,
    era_primary: place.era_primary ?? place.primaryEra ?? null,
    era_range: place.era_range ?? place.eraRange ?? null,
    types: toArray(place.types, place.siteType),
    summary_gen: place.summaries?.gen ?? null,
    echo_title: place.echo?.title ?? null,
    echo_text: place.echo?.text ?? null,
    map_google_embed: place.map?.google_embed ?? place.map?.googleEmbed ?? null,
    link_wikipedia: place.links?.wikipedia ?? null,
    link_official_site: place.links?.official_site ?? place.links?.officialSite ?? null,
    latitude: place.latitude ?? null,
    longitude: place.longitude ?? null,
    timeline_start: place.timeline_start ?? null,
    timeline_end: place.timeline_end ?? null,
    hero_image: place.hero_image ?? place.heroImage ?? null,
    echo_image: place.echo_image ?? place.echoImage ?? null,
  }
}

const run = async () => {
  const flattened = PLACES.map(flattenPlace)
  const outputPath = resolve(__dirname, '../places_seed.json')
  await writeFile(outputPath, `${JSON.stringify(flattened, null, 2)}\n`, 'utf8')
  console.log(`Exported ${flattened.length} places to ${outputPath}`)
}

run().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
