import { ApiClient } from './apiClient'

const baseUrl =
	import.meta.env.VITE_BACKEND_URL ?? 'https://places-in-time-history-chat.onrender.com'

export const api = new ApiClient(baseUrl)

export * from './apiClient'
