import type { NewsCardItem } from '../utils/content'

export const NEWS_FALLBACK_ITEMS: NewsCardItem[] = [
  {
    id: 'n1',
    title: 'Dispatches from active excavations',
    dateLabel: '05 Dec 2025',
    category: 'Field report',
    summary: 'Weekly correspondents surface context from digs, court records, and museum releases.',
    to: '/news',
  },
  {
    id: 'n2',
    title: 'Policy shifts that reshape heritage',
    dateLabel: '02 Dec 2025',
    category: 'Briefing',
    summary: 'Track how funding rounds, stewardship debates, and access pilots change visiting rights.',
    to: '/news',
  },
  {
    id: 'n3',
    title: 'Voices from local historians',
    dateLabel: '29 Nov 2025',
    category: 'Perspective',
    summary: 'Hear regional researchers explain why certain archives, trails, or rituals matter now.',
    to: '/news',
  },
]
