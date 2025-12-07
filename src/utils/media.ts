export function resolveMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const base = import.meta.env.VITE_BACKEND_URL ?? 'https://places-in-time-history-chat.onrender.com'
  const trimmedBase = base.replace(/\/$/, '')
  const trimmedPath = path.replace(/^\//, '')

  return `${trimmedBase}/media/${trimmedPath}`
}
