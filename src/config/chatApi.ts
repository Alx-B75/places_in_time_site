export const CHAT_API_BASE_URL =
  import.meta.env.VITE_CHAT_API_BASE_URL ||
  (() => {
    throw new Error('VITE_CHAT_API_BASE_URL is not set')
  })()
