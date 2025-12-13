# Guest Chat Redirect Forensics

## Confirmed guest chat references

| # | File | Lines | Classification | Observed behavior |
| - | - | - | - | - |
| 1 | [src/pages/Person.tsx](src/pages/Person.tsx#L116-L136) | React component | Defines `GUEST_CHAT_HOST = "https://places-in-time-history-chat-front.onrender.com"` and builds `/guest/${figure.slug}` URLs plus optional `place_slug` query parameters. |
| 2 | [src/pages/Person.tsx](src/pages/Person.tsx#L257-L296) | React component | Renders a primary CTA `<a>` with `href={chatHref}` and `target="_blank"`, plus explanatory copy informing users the guest chat opens in a new tab. |
| 3 | [src/pages/Place.tsx](src/pages/Place.tsx#L304-L305) | React component | Static copy advertising "Short guest chat" but no UI implementation. |
| 4 | [src/pages/Home.tsx](src/pages/Home.tsx#L236-L324) | React component | Landing-page CTAs that send users to `/chat` (not `/guest`) while copy mentions guest chat limits. |
| 5 | [src/App.jsx](src/App.jsx#L9-L46) | Routing table | Declares `/chat`, `/chat/choose`, `/chat-app`, `/login`, `/register`, `/figures/quotha`, but no `/guest/:slug` route. Routes `/chat-app`, `/login`, `/register` all render `<RedirectPage>` to the Render-hosted chat frontend. |
| 6 | [src/pages/RedirectPage.jsx](src/pages/RedirectPage.jsx#L4-L16) | React redirect shim | Calls `window.location.replace(to)` during mount, producing client-side redirects to the Render app. |
| 7 | [src/pages/Chat.jsx](src/pages/Chat.jsx#L8-L24) | React component | On `/chat?figure_slug=...`, immediately navigates to `/people/${slug}?start_chat=1` rather than any guest UI. |
| 8 | [src/api/apiClient.ts](src/api/apiClient.ts#L128-L140) | API helper | Defines legacy `guestStart`/`guestAsk` TypeScript interfaces referencing `/guest/start` and `/guest/ask`. Comments note this path is "Legacy". |
| 9 | [src/api/apiClient.ts](src/api/apiClient.ts#L675-L686) | API helper | Implements `guestStart` and `guestAsk` methods that call `/guest/start` and `/guest/ask` on the backend, but these helpers are unused elsewhere. |
| 10 | [src/chat/api/chatApiClient.ts](src/chat/api/chatApiClient.ts#L117-L231) | API helper | Active guest chat API client hitting `${CHAT_API_BASE_URL}/guest/start/${slug}` and `/guest/ask`. Still pure data layer; no UI. |
| 11 | [src/chat/state/chatStore.ts](src/chat/state/chatStore.ts#L8-L214) | React context | Contains guest-session state transitions but is not mounted anywhere (no `<ChatProvider>` usage in the app tree). |

## Serving mechanisms

1. Person detail CTA: client-side React link opening `https://places-in-time-history-chat-front.onrender.com/guest/${slug}` in a new tab ([src/pages/Person.tsx#L257-L296](src/pages/Person.tsx#L257-L296)). This is an absolute URL; the SPA does not serve a guest UI.
2. `/chat-app`, `/login`, `/register` routes: React renders `<RedirectPage>`, whose `useEffect` performs `window.location.replace(to)` ([src/pages/RedirectPage.jsx#L4-L16](src/pages/RedirectPage.jsx#L4-L16)), sending the browser to the Render app. These are client-side redirects only; there is no FastAPI/static serving inside this repo.
3. No `/guest` route exists within the SPA router ([src/App.jsx#L24-L46](src/App.jsx#L24-L46)). Therefore, the "lovely guest chat interface" is not present in this codebase.
4. Guest API helpers exist but have no mounting UI. They describe network calls to `${CHAT_API_BASE_URL}` ([src/chat/api/chatApiClient.ts#L117-L231](src/chat/api/chatApiClient.ts#L117-L231)) and maintain state ([src/chat/state/chatStore.ts#L8-L214](src/chat/state/chatStore.ts#L8-L214)), yet no React page imports these modules.

## Navigation triggers and targets

| Trigger | Destination | Absolute/Relative | Evidence |
| - | - | - | - |
| `<a href={chatHref} target="_blank">` in person hero | `https://places-in-time-history-chat-front.onrender.com/guest/${figure.slug}` (+optional `place_slug`) | Absolute | [src/pages/Person.tsx#L257-L296](src/pages/Person.tsx#L257-L296) |
| `<RedirectPage to="https://places-in-time-history-chat-front.onrender.com/login" />` | `https://places-in-time-history-chat-front.onrender.com/login` | Absolute | [src/App.jsx#L33-L37](src/App.jsx#L33-L37) + [src/pages/RedirectPage.jsx#L4-L16](src/pages/RedirectPage.jsx#L4-L16) |
| `<RedirectPage to="https://places-in-time-history-chat-front.onrender.com/register" />` | `https://places-in-time-history-chat-front.onrender.com/register` | Absolute | [src/App.jsx#L37-L41](src/App.jsx#L37-L41) + [src/pages/RedirectPage.jsx#L4-L16](src/pages/RedirectPage.jsx#L4-L16) |
| `<RedirectPage to="https://places-in-time-history-chat-front.onrender.com/" />` (mounted at `/chat-app`) | `https://places-in-time-history-chat-front.onrender.com/` | Absolute | [src/App.jsx#L41-L45](src/App.jsx#L41-L45) + [src/pages/RedirectPage.jsx#L4-L16](src/pages/RedirectPage.jsx#L4-L16) |
| `/chat?figure_slug=...` effect | `/people/${slug}?start_chat=1` | Relative (internal SPA navigation) | [src/pages/Chat.jsx#L8-L24](src/pages/Chat.jsx#L8-L24) |

No `window.location`, meta refresh, or fetch-initiated redirects are present besides the centralized `<RedirectPage>` effect. All guest-specific navigation is either absolute links to the Render domain or internal reroutes to `/people/:slug`.

## Flow reconstruction (evidence-only)

1. User loads `/people/:slug` inside the SPA.
2. The `Person` component renders a "Talk to {figure}" button pointing to `https://places-in-time-history-chat-front.onrender.com/guest/${slug}` and labels it as opening in a new tab ([src/pages/Person.tsx#L257-L296](src/pages/Person.tsx#L257-L296)).
3. Clicking the button navigates the browser directly to the Render-hosted guest chat interface. No intermediate SPA route or API call runs beforehand.
4. Alternatively, hitting `/chat?figure_slug=anne-boleyn` triggers `ChatHub` to internal-navigate to `/people/anne-boleyn?start_chat=1` ([src/pages/Chat.jsx#L8-L24](src/pages/Chat.jsx#L8-L24)). The redirected person page then exposes the same external CTA, so the user must click again to reach the guest chat frontend.
5. Visiting `/chat-app` renders `<RedirectPage>`, whose `useEffect` immediately invokes `window.location.replace("https://places-in-time-history-chat-front.onrender.com/")`, sending the browser to the Render deployment ([src/App.jsx#L41-L45](src/App.jsx#L41-L45); [src/pages/RedirectPage.jsx#L4-L16](src/pages/RedirectPage.jsx#L4-L16)).

**Confirmed reproduction URLs**
- `/people/{slug}` → button opens `https://places-in-time-history-chat-front.onrender.com/guest/{slug}` in a new tab ([src/pages/Person.tsx#L257-L296](src/pages/Person.tsx#L257-L296)).
- `/chat?figure_slug={slug}` → SPA redirects to `/people/{slug}?start_chat=1`, exposing the same external CTA ([src/pages/Chat.jsx#L8-L24](src/pages/Chat.jsx#L8-L24)).
- `/chat-app` → SPA renders `<RedirectPage>` which performs `window.location.replace("https://places-in-time-history-chat-front.onrender.com/")` ([src/App.jsx#L41-L45](src/App.jsx#L41-L45); [src/pages/RedirectPage.jsx#L4-L16](src/pages/RedirectPage.jsx#L4-L16)).

## Unknowns / Required data

- No guest chat UI component, page, or route exists within this repository; only links to `places-in-time-history-chat-front.onrender.com` were found. Identifying the actual "lovely guest chat interface" requires access to that external frontend’s source.
- Serving mechanism for `/guest/start` and `/guest/ask` endpoints cannot be confirmed because the backend (FastAPI or otherwise) is not present here. Determining whether those endpoints deliver HTML, JSON, or redirects requires the backend repo or live inspection.
- Usage sites for `ChatProvider`/`chatStore` are absent. Establishing whether a guest session ever starts inside this SPA would require additional code or runtime instrumentation.
