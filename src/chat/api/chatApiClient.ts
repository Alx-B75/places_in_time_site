import { CHAT_API_BASE_URL } from '../../config/chatApi'

export interface AuthResponse {
  token?: string
  [key: string]: any
}

export interface GuestStartResponse {
  session_started?: boolean
  figure_slug?: string
  max_questions?: number
  remaining_questions?: number
  expires_at?: string
}

export interface GuestAskResponse {
  answer?: string
  sources?: unknown
  usage?: unknown
  max_questions?: number
  remaining_questions?: number
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

  const url = `${CHAT_API_BASE_URL}/guest/ask`

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
      mode: 'cors',
    })
  } catch (error) {
    console.error('[GUEST_ASK_EXCEPTION]', { url, error })
    throw {
      type: 'network',
      status: 0,
      errorCode: null,
      message: 'We could not reach the chat service. Check your connection and try again.',
      detail: error instanceof Error ? error.message : error,
    }
  }

  let bodyText = ''
  try {
    bodyText = await response.text()
  } catch (err) {
    console.error('[GUEST_ASK_ERROR]', { url, status: response.status, bodyText: null, parserError: err })
  }

  let parsed: unknown = {}
  if (bodyText) {
    try {
      parsed = JSON.parse(bodyText)
    } catch (err) {
      console.error('[GUEST_ASK] error parsing response', err)
      parsed = {}
    }
  }

  if (!response.ok) {
    const detailNode =
      parsed && typeof parsed === 'object' ? ((parsed as any).detail ?? parsed) : undefined
    const errorCode =
      detailNode && typeof detailNode === 'object'
        ? detailNode.error_code ?? detailNode.code ?? null
        : null
    const message =
      (detailNode && typeof detailNode === 'object' && detailNode.message) ||
      (detailNode && typeof detailNode === 'string' ? detailNode : undefined) ||
      (typeof parsed === 'object' && parsed && (parsed as any).message) ||
      'Guest request failed. Please try again.'
    const type =
      response.status === 403 && errorCode === 'guest_limit_reached'
        ? 'guest_limit_reached'
        : response.status === 503 && errorCode === 'llm_quota'
        ? 'llm_quota'
        : 'guest_error'

    const errorPayload = {
      type,
      status: response.status,
      errorCode,
      message,
      detail: detailNode ?? parsed ?? null,
    }

    console.error('[GUEST_ASK_ERROR]', { url, status: response.status, bodyText, error: errorPayload })
    throw errorPayload
  }

  return (parsed ?? {}) as GuestAskResponse
}
