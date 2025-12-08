export class ApiError extends Error {
  public status: number
  public details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

const RESPONSE_TYPES = ['json', 'blob', 'text', 'void'] as const

type ResponseType = (typeof RESPONSE_TYPES)[number]
type RequestBody = BodyInit | Record<string, unknown> | null | undefined

export interface HealthResponse {
  status: string
}

export interface User {
  id: string
  email: string
  name?: string
  role?: string
}

export interface AuthResponse {
  access_token: string
  token_type?: string
  refresh_token?: string
  user?: User
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthLoginRequest {
  username: string
  password: string
}

export interface FigureContext {
  id: number
  figure_slug: string
  source_name?: string | null
  source_url?: string | null
  content_type?: string | null
  content: string
  is_manual: number
}

export interface HistoricalFigure {
  id?: number
  slug: string
  name: string
  era?: string | null
  roles?: string | string[] | null
  image_url?: string | null
  short_summary?: string | null
  persona_prompt?: string | null
  long_bio?: string | null
  echo_story?: string | null
  quote?: string | null
  birth_year?: number | null
  death_year?: number | null
  main_site?: string | null
  related_sites?: string[] | string | null
  sources?: Record<string, unknown> | null
  wiki_links?: Record<string, string> | null
  verified?: boolean | number | null
  contexts?: FigureContext[]
}

export interface FavoriteFigure {
  id?: string
  figure_slug: string
  figure?: HistoricalFigure
  added_at?: string
}

export interface AskRequest {
  prompt: string
  figure_slug?: string
  thread_id?: string
}

export interface AskSource {
  id?: string
  title?: string
  snippet?: string
  url?: string
}

export interface AskUsage {
  input_tokens?: number
  output_tokens?: number
  cost?: number
}

export interface AskResponse {
  answer: string
  thread_id?: string
  sources?: AskSource[]
  usage?: AskUsage
}

export interface GuestStartResponse {
  guest_token: string
  figure_slug: string
  thread_id: string
}

export interface GuestAskRequest {
  prompt: string
  thread_id: string
  guest_token: string
}

export interface GuestAskResponse {
  answer: string
  thread_id: string
  sources?: AskSource[]
}

export interface Thread {
  id: string
  figure_slug?: string
  title?: string
  created_at?: string
  updated_at?: string
}

export interface ThreadCreate {
  figure_slug?: string
  title?: string
}

export interface AdminFigureCreate {
  slug: string
  name: string
  summary?: string
  era_primary?: string
  teaser?: string
  tags?: string[]
}

export interface AdminFigureUpdate extends Partial<AdminFigureCreate> {}

export interface RagSourceCreate {
  name: string
  figure_slug?: string
  type?: string
  url?: string
  content?: string
}

export interface RagSource {
  id: string
  name: string
  figure_slug?: string
  type?: string
  url?: string
  content?: string
  created_at?: string
  updated_at?: string
}

export interface RagContext {
  id: string
  figure_slug: string
  source_id?: string
  content: string
  created_at?: string
  updated_at?: string
}

export interface RagContextUpdate {
  content?: string
  figure_slug?: string
  source_id?: string
}

export interface FigureListParams {
  skip?: number
  limit?: number
}

export interface RagContextListParams {
  figure_slug?: string
}

export interface PlaceSummaries {
  gen?: string
  [key: string]: string | undefined
}

export interface PlaceEcho {
  title?: string
  text?: string
}

export interface PlaceMap {
  google_embed?: string
  googleEmbed?: string
  [key: string]: string | undefined
}

export interface PlaceLinks {
  wikipedia?: string
  official_site?: string
  officialSite?: string
  [key: string]: string | undefined
}

export interface Place {
  id?: string
  slug: string
  name: string
  description?: string
  summary?: string
  summary_gen?: string
  teaser?: string
  siteType?: string
  primaryEra?: string
  era_primary?: string
  era_range?: string
  timeline_start?: number
  timeline_end?: number
  country?: string
  region?: string
  location_label?: string
  locationLabel?: string
  latitude?: number
  longitude?: number
  types?: string[]
  summaries?: PlaceSummaries
  echo?: PlaceEcho
  echo_title?: string
  echo_text?: string
  map?: PlaceMap
  map_google_embed?: string
  links?: PlaceLinks
  link_wikipedia?: string
  link_official_site?: string
  hero_image?: string | null
  heroImage?: string | null
  echo_image?: string | null
  echoImage?: string | null
  [key: string]: unknown
}

export interface PlaceListParams {
  skip?: number
  limit?: number
  search?: string
  country?: string
  era?: string
}

export interface ContentMediaAsset {
  id?: string | number
  url?: string | null
  alt?: string | null
  caption?: string | null
  credit?: string | null
  width?: number | null
  height?: number | null
  kind?: string | null
  focalPointX?: number | null
  focalPointY?: number | null
  [key: string]: unknown
}

export interface ContentLink {
  label?: string | null
  url?: string | null
  target?: string | null
  description?: string | null
  icon?: string | null
  [key: string]: unknown
}

export interface ContentItem {
  id: string | number
  slug: string
  title: string
  subtitle?: string | null
  summary?: string | null
  excerpt?: string | null
  body?: string | null
  category?: string | null
  type?: string | null
  content_type?: string | null
  tags?: string[] | null
  status?: string | null
  featured?: boolean | null
  is_featured?: boolean | null
  featured_rank?: number | null
  hero_image?: string | null
  heroImage?: string | null
  thumbnail_image?: string | null
  thumbnailImage?: string | null
  promo_image?: string | null
  promoImage?: string | null
  published_at?: string | null
  updated_at?: string | null
  read_time_minutes?: number | null
  cta_label?: string | null
  cta_url?: string | null
  external_url?: string | null
  externalUrl?: string | null
  source_name?: string | null
  attachments?: ContentMediaAsset[] | null
  links?: ContentLink[] | null
  related_places?: string[] | null
  related_figures?: string[] | null
  metadata?: Record<string, unknown> | null
  [key: string]: unknown
}

export interface ContentListParams {
  skip?: number
  limit?: number
  search?: string
  contentType?: string
  types?: string[]
  tags?: string[]
  category?: string
  featured?: boolean
  status?: string
  before?: string
  after?: string
  placeSlug?: string
  figureSlug?: string
  isFeatured?: boolean
  sort?: string
  order?: 'asc' | 'desc'
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  private buildUrl(path: string): string {
    if (path.startsWith('http')) {
      return path
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${this.baseUrl}${cleanPath}`
  }

  private prepareBody(body: RequestBody, headers: Headers): BodyInit | undefined {
    if (body === null || body === undefined) {
      return undefined
    }

    if (body instanceof FormData || typeof body === 'string' || body instanceof Blob || body instanceof ArrayBuffer || body instanceof URLSearchParams) {
      return body
    }

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    return JSON.stringify(body)
  }

  private async request<T>(
    path: string,
    options: RequestInit & { body?: RequestBody } = {},
    token?: string,
    responseType: ResponseType = 'json',
  ): Promise<T> {
    const headers = new Headers(options.headers)

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const preparedBody = this.prepareBody(options.body, headers)

    const response = await fetch(this.buildUrl(path), {
      ...options,
      headers,
      body: preparedBody,
    })

    if (!response.ok) {
      let details: unknown
      let message = response.statusText || 'Request failed'

      try {
        details = await response.clone().json()
        if (details && typeof details === 'object' && 'detail' in details) {
          const detailValue = (details as { detail?: unknown }).detail
          if (typeof detailValue === 'string') {
            message = detailValue
          }
        }
        if (details && typeof details === 'object' && 'message' in details) {
          const detailValue = (details as { message?: unknown }).message
          if (typeof detailValue === 'string') {
            message = detailValue
          }
        }
      } catch {
        try {
          const text = await response.clone().text()
          if (text) {
            details = text
            message = text
          }
        } catch {
          // ignore
        }
      }

      throw new ApiError(message, response.status, details)
    }

    if (responseType === 'void') {
      return undefined as T
    }

    if (responseType === 'blob') {
      const blob = await response.blob()
      return blob as T
    }

    if (responseType === 'text') {
      const text = await response.text()
      return text as T
    }

    if (response.status === 204) {
      return undefined as T
    }

    const text = await response.text()
    if (!text) {
      return undefined as T
    }

    return JSON.parse(text) as T
  }

  health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health', { method: 'GET' })
  }

  register(payload: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register', { method: 'POST', body: payload })
  }

  login(payload: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login', { method: 'POST', body: payload })
  }

  authLogin(payload: AuthLoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', { method: 'POST', body: payload })
  }

  adminStepUp(token: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/admin/stepup', { method: 'POST' }, token)
  }

  async listFigures(params?: FigureListParams): Promise<HistoricalFigure[]> {
    const searchParams = new URLSearchParams()
    if (typeof params?.skip === 'number') {
      searchParams.set('skip', String(params.skip))
    }
    if (typeof params?.limit === 'number') {
      searchParams.set('limit', String(params.limit))
    }
    const query = searchParams.toString()
    const path = query ? `/figures/?${query}` : '/figures/'
    const data = await this.request<HistoricalFigure[] | { items?: HistoricalFigure[] }>(path, { method: 'GET' })
    if (Array.isArray(data)) {
      return data
    }
    return data.items ?? []
  }

  getFigure(slug: string): Promise<HistoricalFigure> {
    return this.request<HistoricalFigure>(`/figures/${encodeURIComponent(slug)}`, { method: 'GET' })
  }

  async listFavoriteFigures(token: string): Promise<FavoriteFigure[]> {
    const data = await this.request<FavoriteFigure[] | { items?: FavoriteFigure[] }>(
      '/figures/favorites',
      { method: 'GET' },
      token,
    )
    if (Array.isArray(data)) {
      return data
    }
    return data.items ?? []
  }

  addFavoriteFigure(slug: string, token: string): Promise<FavoriteFigure> {
    return this.request<FavoriteFigure>(`/figures/favorites/${encodeURIComponent(slug)}`, { method: 'POST' }, token)
  }

  removeFavoriteFigure(slug: string, token: string): Promise<void> {
    return this.request<void>(`/figures/favorites/${encodeURIComponent(slug)}`, { method: 'DELETE' }, token, 'void')
  }

  async listPlaces(params?: PlaceListParams): Promise<Place[]> {
    const searchParams = new URLSearchParams()
    if (typeof params?.skip === 'number') {
      searchParams.set('skip', String(params.skip))
    }
    if (typeof params?.limit === 'number') {
      searchParams.set('limit', String(params.limit))
    }
    if (params?.search) {
      searchParams.set('search', params.search)
    }
    if (params?.country) {
      searchParams.set('country', params.country)
    }
    if (params?.era) {
      searchParams.set('era', params.era)
    }
    if (params?.contentType) {
      searchParams.set('content_type', params.contentType)
    }
    if (params?.types?.length) {
      params.types.forEach((type) => {
        if (type) {
          searchParams.append('content_type', type)
        }
      })
    return data.items ?? []
  }

  getPlace(slug: string): Promise<Place> {
    return this.request<Place>(`/places/${encodeURIComponent(slug)}`, { method: 'GET' })
  }

  private buildContentSearchParams(params?: ContentListParams): URLSearchParams {
    const searchParams = new URLSearchParams()
    if (typeof params?.skip === 'number') {
      searchParams.set('skip', String(params.skip))
    }
    if (typeof params?.limit === 'number') {
      searchParams.set('limit', String(params.limit))
    }
    if (params?.search) {
      searchParams.set('search', params.search)
    }
    params?.types?.forEach((type) => {
      if (type) {
        searchParams.append('type', type)
      }
    })
    params?.tags?.forEach((tag) => {
      if (tag) {
        searchParams.append('tag', tag)
      }
    })
    if (params?.category) {
      searchParams.set('category', params.category)
    }
    if (typeof params?.featured === 'boolean') {
      searchParams.set('featured', params.featured ? 'true' : 'false')
    }
    if (typeof params?.isFeatured === 'boolean') {
      searchParams.set('is_featured', params.isFeatured ? 'true' : 'false')
    }
    if (params?.status) {
      searchParams.set('status', params.status)
    }
    if (params?.before) {
      searchParams.set('before', params.before)
    }
    if (params?.after) {
      searchParams.set('after', params.after)
    }
    if (params?.placeSlug) {
      searchParams.set('place_slug', params.placeSlug)
    }
    if (params?.figureSlug) {
      searchParams.set('figure_slug', params.figureSlug)
    }
    if (params?.sort) {
      searchParams.set('sort', params.sort)
    }
    if (params?.order) {
      searchParams.set('order', params.order)
    }
    return searchParams
  }

  async listContent(params?: ContentListParams): Promise<ContentItem[]> {
    const searchParams = this.buildContentSearchParams(params)
    const query = searchParams.toString()
    const path = query ? `/content?${query}` : '/content'
    const data = await this.request<ContentItem[] | { items?: ContentItem[] }>(path, { method: 'GET' })
    if (Array.isArray(data)) {
      return data
    }
    return data.items ?? []
  }

  listNews(params?: ContentListParams): Promise<ContentItem[]> {
    const mergedParams: ContentListParams = {
      limit: params?.limit ?? 12,
      status: params?.status ?? 'published',
      contentType: params?.contentType ?? 'news_article',
      ...params,
    }

    if (!mergedParams.contentType && (!mergedParams.types || mergedParams.types.length === 0)) {
      mergedParams.types = ['news_article']
    }

    const searchParams = this.buildContentSearchParams(mergedParams)
    if (!searchParams.has('content_type')) {
      searchParams.set('content_type', 'news_article')
    }

    const query = searchParams.toString()
    const path = query ? `/news?${query}` : '/news'
    return this.request<ContentItem[]>(path, { method: 'GET' })
  }

  getContentItem(slug: string): Promise<ContentItem> {
    return this.request<ContentItem>(`/content/${encodeURIComponent(slug)}`, { method: 'GET' })
  }

  getNewsItem(slug: string): Promise<ContentItem> {
    return this.request<ContentItem>(`/news/${encodeURIComponent(slug)}`, { method: 'GET' })
  }

  ask(payload: AskRequest, token?: string): Promise<AskResponse> {
    return this.request<AskResponse>('/ask', { method: 'POST', body: payload }, token)
  }

  guestStart(figureSlug: string): Promise<GuestStartResponse> {
    const params = new URLSearchParams({ figure_slug: figureSlug })
    return this.request<GuestStartResponse>(`/guest/start?${params.toString()}`, { method: 'POST' })
  }

  guestAsk(payload: GuestAskRequest): Promise<GuestAskResponse> {
    return this.request<GuestAskResponse>('/guest/ask', { method: 'POST', body: payload })
  }

  createThread(payload: ThreadCreate, token?: string): Promise<Thread> {
    return this.request<Thread>('/threads', { method: 'POST', body: payload }, token)
  }

  deleteThread(threadId: string, token: string): Promise<void> {
    return this.request<void>(`/threads/${encodeURIComponent(threadId)}`, { method: 'DELETE' }, token, 'void')
  }

  downloadDb(token?: string): Promise<Blob> {
    return this.request<Blob>('/download_db', { method: 'GET' }, token, 'blob')
  }

  async adminListFigures(token: string): Promise<HistoricalFigure[]> {
    const data = await this.request<HistoricalFigure[] | { items?: HistoricalFigure[] }>(
      '/admin/figures',
      { method: 'GET' },
      token,
    )
    if (Array.isArray(data)) {
      return data
    }
    return data.items ?? []
  }

  adminCreateFigure(payload: AdminFigureCreate, token: string): Promise<HistoricalFigure> {
    return this.request<HistoricalFigure>('/admin/figures', { method: 'POST', body: payload }, token)
  }

  adminUpdateFigure(slug: string, payload: AdminFigureUpdate, token: string): Promise<HistoricalFigure> {
    return this.request<HistoricalFigure>(`/admin/figures/${encodeURIComponent(slug)}`, { method: 'PATCH', body: payload }, token)
  }

  adminDeleteFigure(slug: string, token: string): Promise<void> {
    return this.request<void>(`/admin/figures/${encodeURIComponent(slug)}`, { method: 'DELETE' }, token, 'void')
  }

  adminCreateRagSource(payload: RagSourceCreate, token: string): Promise<RagSource> {
    return this.request<RagSource>('/admin/rag/sources', { method: 'POST', body: payload }, token)
  }

  adminListRagContexts(params: RagContextListParams | undefined, token: string): Promise<RagContext[]> {
    const searchParams = new URLSearchParams()
    if (params?.figure_slug) {
      searchParams.set('figure_slug', params.figure_slug)
    }
    const query = searchParams.toString()
    const path = query ? `/admin/rag/contexts?${query}` : '/admin/rag/contexts'
    return this.request<RagContext[]>(path, { method: 'GET' }, token)
  }

  adminUpdateRagContext(ctxId: string, payload: RagContextUpdate, token: string): Promise<RagContext> {
    return this.request<RagContext>(`/admin/rag/contexts/${encodeURIComponent(ctxId)}`, { method: 'PATCH', body: payload }, token)
  }

  adminDeleteRagContext(ctxId: string, token: string): Promise<void> {
    return this.request<void>(`/admin/rag/contexts/${encodeURIComponent(ctxId)}`, { method: 'DELETE' }, token, 'void')
  }
 }
