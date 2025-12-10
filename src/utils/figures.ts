import type { HistoricalFigure } from '../api/apiClient'

type RelatedPlacesValue = HistoricalFigure['related_places'] | string[] | string | null | undefined

const normalizeEntries = (entries: unknown[]): string[] =>
	entries
		.map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
		.filter((entry): entry is string => entry.length > 0)

export const parseRelatedPlaces = (value: RelatedPlacesValue): string[] => {
	if (!value) {
		return []
	}

	if (Array.isArray(value)) {
		return normalizeEntries(value)
	}

	if (typeof value === 'string') {
		const trimmed = value.trim()
		if (!trimmed) {
			return []
		}

		if (trimmed.startsWith('[')) {
			try {
				const parsed = JSON.parse(trimmed)
				if (Array.isArray(parsed)) {
					return normalizeEntries(parsed)
				}
			} catch {
				// fall through to comma-handling below
			}
		}

		if (trimmed.includes(',')) {
			return normalizeEntries(trimmed.split(','))
		}

		return [trimmed]
	}

	return []
}

export const getRelatedPlaceSlugs = (figure: HistoricalFigure): string[] =>
	parseRelatedPlaces(figure.related_places ?? null)