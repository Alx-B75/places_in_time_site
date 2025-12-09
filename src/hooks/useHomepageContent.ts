import { useEffect, useState } from 'react'
import {
  type HomepageContent,
  fallbackHomepageContent,
  fetchHomepageContent,
} from '../cms/homepage'

export function useHomepageContent(): HomepageContent {
  const [content, setContent] = useState<HomepageContent>(fallbackHomepageContent)

  useEffect(() => {
    let cancelled = false

    fetchHomepageContent()
      .then((data) => {
        if (!cancelled) {
          setContent(data)
        }
      })
      .catch(() => {
        // fallback already applied via initial state
      })

    return () => {
      cancelled = true
    }
  }, [])

  return content
}
