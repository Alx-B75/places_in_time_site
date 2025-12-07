const LogoMark = ({ tone = 'teal', size = 48, className = '', hideTitle = false }) => {
  const toneMap = {
    teal: '#0f4c5c',
    dark: '#1c2333',
    light: '#ffffff',
  }

  const toneKey = tone ?? 'teal'
  const strokeColor = toneMap[toneKey] ?? toneKey
  const titleId = hideTitle ? undefined : 'places-in-time-logo'

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role="img"
      aria-labelledby={titleId}
    >
      {!hideTitle && <title id={titleId}>Places in Time logo</title>}
      <g
        fill="none"
        stroke={strokeColor}
        strokeWidth={56}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M320 64h96c53 0 96 43 96 96v96c0 35-21 65-48 80" />
        <path d="M192 64H96C43 64 0 107 0 160v96c0 35 21 65 48 80" />
        <path d="M192 448H96c-53 0-96-43-96-96v-96c0-35 21-65 48-80" />
        <path d="M320 448h96c53 0 96-43 96-96v-96c0-35-21-65-48-80" />
        <path d="M144 112l224 224" />
        <path d="M368 112L144 336" />
        <path d="M112 144l224 224" />
        <path d="M400 144L176 368" />
      </g>
    </svg>
  )
}

export default LogoMark
