import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react'
import type { ThreadSummary, ChatMessage, GuestStartResponse } from '../api/chatApiClient'
import { guestStart } from '../api/chatApiClient'

export type ChatMode = 'none' | 'guest-starting' | 'guest' | 'user'

export interface ChatState {
  mode: ChatMode
  guestMode: boolean
  sessionStarted: boolean
  token?: string | null
  activeFigureSlug?: string | null
  activePlaceSlug?: string | null
  maxQuestions?: number | null
  remainingQuestions?: number | null
  expiresAt?: string | null
  limitReached: boolean
  serviceError?: 'quota' | null
  threads: ThreadSummary[]
  currentThreadId?: number | string | null
  messages: ChatMessage[]
  loading: boolean
  error?: string | null
}

const initialState: ChatState = {
  mode: 'none',
  guestMode: false,
  sessionStarted: false,
  token: null,
  activeFigureSlug: null,
  activePlaceSlug: null,
  maxQuestions: null,
  remainingQuestions: null,
  expiresAt: null,
  limitReached: false,
  serviceError: null,
  threads: [],
  currentThreadId: null,
  messages: [],
  loading: false,
  error: null,
}

type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'GUEST_SESSION_START'; payload: { figureSlug: string; placeSlug: string | null } }
  | {
      type: 'GUEST_SESSION_READY'
      payload: {
        sessionStarted: boolean
        threadId?: string | number | null
        figureSlug?: string | null
        placeSlug?: string | null
        maxQuestions?: number | null
        remainingQuestions?: number | null
        expiresAt?: string | null
      }
    }
  | { type: 'GUEST_ERROR'; error: string }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_THREADS'; payload: ThreadSummary[] }
  | { type: 'SET_CURRENT_THREAD'; payload: number | string | null }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_GUEST_LIMITS'; payload: { maxQuestions?: number | null; remainingQuestions?: number | null } }
  | { type: 'SET_LIMIT_STATUS'; payload: { limitReached?: boolean; serviceError?: 'quota' | null } }

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'GUEST_SESSION_START':
      return {
        ...state,
        mode: 'guest-starting',
        guestMode: false,
        sessionStarted: false,
        loading: true,
        error: null,
        activeFigureSlug: action.payload.figureSlug,
        activePlaceSlug: action.payload.placeSlug,
        limitReached: false,
        serviceError: null,
      }
    case 'GUEST_SESSION_READY':
      return {
        ...state,
        mode: 'guest',
        guestMode: true,
        sessionStarted: action.payload.sessionStarted,
        loading: false,
        error: null,
        currentThreadId: action.payload.threadId ?? null,
        activeFigureSlug: action.payload.figureSlug ?? state.activeFigureSlug,
        activePlaceSlug: action.payload.placeSlug ?? state.activePlaceSlug,
        maxQuestions: null,
        remainingQuestions: null,
        expiresAt: action.payload.expiresAt ?? null,
        limitReached: false,
        serviceError: null,
        messages: [],
      }
    case 'GUEST_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
        mode: 'none',
        guestMode: false,
        sessionStarted: false,
        currentThreadId: null,
        remainingQuestions: null,
        maxQuestions: null,
        limitReached: false,
        serviceError: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        mode: 'user',
        token: action.payload.token,
        guestMode: false,
        sessionStarted: false,
        remainingQuestions: null,
        maxQuestions: null,
        limitReached: false,
        serviceError: null,
        error: null,
      }
    case 'LOGOUT':
      return { ...initialState }
    case 'SET_THREADS':
      return { ...state, threads: action.payload }
    case 'SET_CURRENT_THREAD':
      return { ...state, currentThreadId: action.payload }
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'UPDATE_GUEST_LIMITS':
      return {
        ...state,
        maxQuestions:
          Object.prototype.hasOwnProperty.call(action.payload, 'maxQuestions')
            ? action.payload.maxQuestions ?? null
            : state.maxQuestions ?? null,
        remainingQuestions:
          Object.prototype.hasOwnProperty.call(action.payload, 'remainingQuestions')
            ? action.payload.remainingQuestions ?? null
            : state.remainingQuestions ?? null,
      }
    case 'SET_LIMIT_STATUS':
      return {
        ...state,
        limitReached:
          typeof action.payload.limitReached === 'boolean'
            ? action.payload.limitReached
            : state.limitReached,
        serviceError:
          action.payload.serviceError === undefined ? state.serviceError ?? null : action.payload.serviceError,
      }
    default:
      return state
  }
}

const ChatContext = createContext<{ state: ChatState; dispatch: Dispatch<ChatAction> } | undefined>(undefined)

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  return React.createElement(ChatContext.Provider, { value: { state, dispatch } }, children)
}

export const useChatStore = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error('useChatStore must be used within a ChatProvider')
  }
  return ctx
}

export async function startGuestSession(
  dispatch: Dispatch<ChatAction>,
  figureSlug?: string | null,
  placeSlug?: string | null,
): Promise<void> {
  if (!figureSlug) {
    dispatch({ type: 'SET_ERROR', payload: 'No figure selected for guest chat.' })
    return
  }

  dispatch({ type: 'GUEST_SESSION_START', payload: { figureSlug, placeSlug: placeSlug ?? null } })

  try {
    const payload = await guestStart(figureSlug, placeSlug ?? undefined)
    console.debug('[GUEST_START] payload', payload)

    if (!payload?.session_started) {
      dispatch({
        type: 'GUEST_ERROR',
        error: 'Could not start guest chat.',
      })
      return
    }

    dispatch({
      type: 'GUEST_SESSION_READY',
      payload: {
        sessionStarted: true,
        threadId: null,
        figureSlug: payload.figure_slug ?? figureSlug ?? null,
        placeSlug: placeSlug ?? null,
        maxQuestions: null,
        remainingQuestions: null,
        expiresAt: payload.expires_at ?? null,
      },
    })
  } catch (err: any) {
    console.error('[GUEST_START] failed', err)
    dispatch({
      type: 'GUEST_ERROR',
      error: 'Could not start guest chat.',
    })
  }
}
