import { CHAT_API_BASE_URL } from '../../config/chatApi'

export interface AuthResponse {
  token?: string
  [key: string]: any
}

export interface GuestStartResponse {
  session_started?: boolean
  figure_slug?: string
  max_questions?: number
  expires_at?: string
}

export interface GuestAskResponse {
  answer?: string
  [key: string]: any
}

export interface ThreadSummary {
  id: number
  title?: string
  created_at?: string
  [key: string]: any
}

export interface ChatMessage {
  id?: number
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at?: string
  [key: string]: any
}

type RequestOptions = {
  method?: string
  body?: BodyInit | null
  headers?: Record<string, string>
}

const buildUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${CHAT_API_BASE_URL}${normalizedPath}`
}

const parseJson = async (response: Response) => {
  try {
    const text = await response.text()
    if (!text) {
      return {}
    }
    return JSON.parse(text)
  } catch (error) {
    throw new Error('Failed to parse chat API response')
  }
}

const request = async (path: string, options: RequestOptions = {}) => {
  const { method = 'GET', body = null, headers = {} } = options

  const url = path.startsWith('http') ? path : buildUrl(path)
  const fetchHeaders: Record<string, string> = { ...headers }
  let fetchBody: BodyInit | null = body as BodyInit | null

  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)) {
    fetchHeaders['Content-Type'] = fetchHeaders['Content-Type'] ?? 'application/json'
    fetchBody = JSON.stringify(body)
  }

  const response = await fetch(url, {
    method,
    headers: fetchHeaders,
    body: fetchBody,
    credentials: 'include',
  })

  return parseJson(response)
}

export const registerUser = async (username: string, password: string): Promise<AuthResponse> =>
  request('/auth/register', { method: 'POST', body: { username, password } })

export const loginUser = async (username: string, password: string): Promise<AuthResponse> =>
  request('/auth/login', { method: 'POST', body: { username, password } })

export const listThreads = async (token: string): Promise<ThreadSummary[]> =>
  request('/threads', { token })

export const createThread = async (
  token: string,
  figure_slug?: string | null,
  place_slug?: string | null,
): Promise<ThreadSummary | any> =>
  request('/threads', {
    method: 'POST',
    token,
    body: { figure_slug, place_slug },
  })

export const sendMessage = async (
  token: string,
  threadId: number | string,
  message: string,
): Promise<ChatMessage | any> =>
  request(`/threads/${threadId}/messages`, {
    method: 'POST',
    token,
    body: { message },
  })

export const guestStart = async (
  figureSlug: string,
  placeSlug: string | null = null,
): Promise<GuestStartResponse> => {
  if (!figureSlug) {
    throw new Error('figureSlug is required to start a guest session')
  }

  const encodedSlug = encodeURIComponent(figureSlug)
  const url = `${CHAT_API_BASE_URL}/guest/start/${encodedSlug}`
  const trimmedPlace = placeSlug?.trim()
  const body = trimmedPlace ? { place_slug: trimmedPlace } : {}

  // eslint-disable-next-line no-console
  console.debug('[GUEST_START] POST', url, { place_slug: trimmedPlace ?? null })

  const data = (await request(url, {
    method: 'POST',
    body,
  })) as GuestStartResponse

  // eslint-disable-next-line no-console
  console.debug('[GUEST_START] payload', data)

  return data
}

export const guestAsk = async (
  message: string,
  threadId?: string | number | null,
): Promise<GuestAskResponse> => {
  const payload: { message: string; thread_id?: string | number | null } = { message }

  if (threadId !== undefined && threadId !== null) {
    payload.thread_id = threadId
  }

  try {
    const response = await request('/guest/ask', {
      method: 'POST',
      body: payload,
    })

    if ((response as any)?.detail || (response as any)?.error) {
      console.error('[GUEST_ASK] error payload', response)
    }

    return response
  } catch (error) {
    console.error('[GUEST_ASK] error', error)
    throw error
  }
}
