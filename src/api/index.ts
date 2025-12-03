import { ApiClient } from './apiClient'

const baseUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000'

export const api = new ApiClient(baseUrl)

export * from './apiClient'
