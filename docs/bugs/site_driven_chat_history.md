# Site-Driven Figure Chat History

## Evidence of former site-driven figure chat

YES. The git history shows the SPA previously rendered the entire guest chat UI directly on `/chat`:

- Commit 5041e7b (2025-12-11) kept `/chat` mounted inside the router with the in-app provider: `Route path="/chat" element={<ChatProvider><Chat /></ChatProvider>}` (see [src/App.jsx](src/App.jsx) in that commit via `git show 5041e7b:src/App.jsx`).
- The same commit’s [src/pages/Chat.jsx](src/pages/Chat.jsx) (captured with `git show 5041e7b:src/pages/Chat.jsx`) contains the full guest-session UI: it reads `figure_slug`/`place_slug` from the query string, calls `startGuestSession`, displays the message log, enforces `max_questions` / `remaining_questions`, and calls `guestAsk` to POST to `${CHAT_API_BASE_URL}/guest/ask`. Those behaviors verify the SPA itself hosted the 3-question guest chat with register prompts before the routing change.

## Former routes and components

| Route | Component (pre-change) | Evidence |
| --- | --- | --- |
| `/chat` | `<ChatProvider><Chat /></ChatProvider>` | Commit 5041e7b, `src/App.jsx` (via `git show 5041e7b:src/App.jsx`) shows the provider wrapping `Chat`. |
| `/chat?figure_slug=...&place_slug=...` | Same `Chat` component parsing query params | Commit 5041e7b, `src/pages/Chat.jsx` demonstrates `const figureSlug = searchParams.get('figure_slug')` and `startGuestSession(dispatch, figureSlug, placeSlug)`. |
| CTA destinations | In-app CTA buttons linking to `${CHAT_API_BASE_URL}/login` / `/register` when guest limit hit | Same Chat component renders `<a className="button" href={`${CHAT_API_BASE_URL}/login`}>Log in</a>` etc., confirming the UI prompted for registration once the allowance expired.

## Removal/disable commit

- **Commit:** 1bcf62c (2025-12-11) – “Replace /chat with Chat Hub gateway and Quotha intro”.
- **Before:** `/chat` rendered the immersive guest chat UI via `ChatProvider` + `Chat` (commit 5041e7b).
- **After:** `/chat` rendered a new `ChatHub` component containing static marketing copy and CTA links out to `https://places-in-time-chatbot.onrender.com` (see `git show 1bcf62c:src/pages/Chat.jsx`). The router dropped `ChatProvider` entirely and mounted `<ChatHub />` (see `git show 1bcf62c:src/App.jsx`).
- **Diff summary:** `Chat.jsx` went from a 300+ line guest-chat implementation to a ~70 line CTA hub. `App.jsx` removed the provider-wrapped chat route and replaced it with `<Route path="/chat" element={<ChatHub />} />`. No site-driven guest UI remained after this commit.

## Replacement behavior

- **External redirects via Chat Hub:** The new `ChatHub` component introduced in 1bcf62c links directly to `https://places-in-time-chatbot.onrender.com`, `/login`, `/register`, and `?figure=quotha`, pushing users to the legacy Render-hosted frontend instead of the in-site UI.
- **Redirect scaffolding:** Commit daf0536 (2025-12-12) added `<RedirectPage>` (see [src/pages/RedirectPage.jsx](src/pages/RedirectPage.jsx)) and the router entries for `/login`, `/register`, and `/chat-app` (see [src/App.jsx](src/App.jsx)). Each route now mounts `<RedirectPage to="https://places-in-time-history-chat-front.onrender.com/..." />`, whose `useEffect` calls `window.location.replace(to)`, ensuring all chat authentication paths leave the SPA.

## Confirmed historical URLs

- `/chat` – previously hosted the full guest UI (commit 5041e7b). Required query params `figure_slug` (and optional `place_slug`) to start the guest session; the component reads them and triggers `startGuestSession`.
- `/chat?figure_slug={slug}` – identical route with query args; same component pre-change, now redirected to `/people/{slug}?start_chat=1` by the current `ChatHub` ([src/pages/Chat.jsx](src/pages/Chat.jsx#L1-L41)).

## Replacement summary

| Aspect | Before (5041e7b) | After (1bcf62c + daf0536) |
| --- | --- | --- |
| `/chat` route | Hosted guest chat UI with ChatProvider + Chat | Static Chat Hub with buttons pointing to Render-hosted app |
| Guest session logic | Implemented locally (`startGuestSession`, `guestAsk`) | No longer mounted; logic still exists under `src/chat/` but unused |
| Login/Register flow | Buttons linked to `${CHAT_API_BASE_URL}` but stayed in-app | Dedicated `/login`, `/register`, `/chat-app` routes now redirect via `<RedirectPage>` to `https://places-in-time-history-chat-front.onrender.com` |

## Top 10 chat-related commits (chronological by recency)

| Hash | Date | Message |
| --- | --- | --- |
| ad65ea7 | 2025-12-13 | feat: implement guest chat functionality and enhance UI with chat button animations |
| 8a2d4e2 | 2025-12-13 | feat: add ChatChooseFigure component and update routing in Chat and Person pages |
| daf0536 | 2025-12-12 | feat: add RedirectPage component for handling redirections |
| f85b126 | 2025-12-12 | Add Quotha figure page at /figures/quotha |
| 1bcf62c | 2025-12-11 | Replace /chat with Chat Hub gateway and Quotha intro |
| 5041e7b | 2025-12-11 | feat: enhance guest session management; add session ID handling and error messaging |
| 49088d9 | 2025-12-11 | feat: enhance error handling in chat components; improve network error messages |
| 33fa3d2 | 2025-12-10 | feat: implement FigureHeader component; enhance figure display logic and loading states |
| 2a88a0f | 2025-12-10 | feat: enhance guest chat experience; implement limit tracking and error handling |
| 0e2e7ac | 2025-12-10 | feat: enhance guest chat functionality; add remaining questions tracking and update UI prompts |

These commits cover the entire evolution from the in-site guest chat to the current redirect-based hub.

## Unknowns / required additional evidence

- The history up to commit 0e2e7ac confirms the SPA hosted the guest UI, but the repo does not document why leadership chose to externalize it; commit messages only describe feature work and then “Replace /chat with Chat Hub gateway…”. Further rationale would require design docs or PR discussions outside this repo.
- The backend implementation for `/guest/start` and `/guest/ask` lives elsewhere. Confirming server-side changes (if any) would need the API repo.
