import { resolveMediaUrl } from '../utils/media'

const formatSlugToName = (slug) => {
  if (!slug) {
    return null
  }
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

const formatRoles = (roles) => {
  if (!roles) {
    return null
  }
  if (Array.isArray(roles)) {
    return roles.filter(Boolean).join(' • ')
  }
  return String(roles)
}

const formatLifeRange = (birth, death, eraRange) => {
  if (eraRange) {
    return eraRange
  }
  if (birth && death) {
    return `${birth}–${death}`
  }
  if (birth && !death) {
    return `Born ${birth}`
  }
  if (!birth && death) {
    return `Died ${death}`
  }
  return null
}

const resolveFigureField = (figure, keys) => {
  if (!figure) {
    return null
  }
  for (const key of keys) {
    const value = figure[key]
    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }
  return null
}

const FigureHeader = ({ figure, loading, error, slug }) => {
  const displayName = figure?.name ?? formatSlugToName(slug) ?? 'History Guide'
  const portraitRaw =
    resolveFigureField(figure, ['profile_image_url', 'image_url', 'hero_image', 'heroImage']) ?? null
  const portraitUrl = resolveMediaUrl(portraitRaw) ?? portraitRaw
  const headline =
    figure?.short_summary ??
    figure?.teaser ??
    formatRoles(resolveFigureField(figure, ['roles'])) ??
    figure?.persona_prompt ??
    'A living voice from history.'
  const eraLabel =
    resolveFigureField(figure, ['era', 'era_primary', 'primaryEra']) ??
    resolveFigureField(figure, ['primaryEraLabel'])
  const lifeRange = formatLifeRange(
    resolveFigureField(figure, ['birth_year', 'birthYear']),
    resolveFigureField(figure, ['death_year', 'deathYear']),
    resolveFigureField(figure, ['era_range', 'timeline_range']) ?? undefined,
  )
  const metaLine = [eraLabel, lifeRange].filter(Boolean).join(', ')

  if (loading) {
    return (
      <div className="figure-header-card figure-header-loading" aria-live="polite">
        <div className="figure-header-avatar placeholder" aria-hidden="true" />
        <div className="figure-header-details">
          <p className="figure-header-name">Loading figure...</p>
          <p className="figure-header-headline">Preparing a face-to-face conversation.</p>
        </div>
      </div>
    )
  }

  if (error || !figure) {
    return (
      <div className="figure-header-card figure-header-fallback">
        <div className="figure-header-details">
          <p className="figure-header-name">{displayName}</p>
          <p className="figure-header-headline">
            {displayName ? `You're talking to ${displayName}.` : 'Select a historical figure to begin.'}
          </p>
          {error && <p className="figure-header-meta">We can't load more details right now.</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="figure-header-card" aria-live="polite">
      <div className="figure-header-avatar" aria-hidden={!portraitUrl}>
        {portraitUrl ? (
          <img src={portraitUrl} alt={`${displayName} portrait`} />
        ) : (
          <span className="figure-header-avatar-initial">{displayName.charAt(0)}</span>
        )}
      </div>
      <div className="figure-header-details">
        <p className="figure-header-name">{displayName}</p>
        {headline && <p className="figure-header-headline">{headline}</p>}
        {metaLine && <p className="figure-header-meta">{metaLine}</p>}
      </div>
    </div>
  )
}

export default FigureHeader
