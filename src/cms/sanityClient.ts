import sanityClient, { type SanityClient } from '@sanity/client'

let client: SanityClient | null = null

export function getSanityClient(): SanityClient | null {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
  const dataset = import.meta.env.VITE_SANITY_DATASET
  const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2025-01-01'

  if (!projectId || !dataset) {
    return null
  }

  if (!client) {
    client = sanityClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  }

  return client
}

console.log("Sanity env check", {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
});

