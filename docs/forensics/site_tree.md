# _site repository snapshot (depth <=4)

## Tree
```
./
├─ eslint.config.js
├─ index.html
├─ package.json
├─ vite.config.js
├─ places_seed.json
├─ public/
│  ├─ images/
│  ├─ favicon.svg
│  └─ site.webmanifest
├─ scripts/
│  └─ export_places_json.mjs
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ api/
│  │  ├─ apiClient.ts
│  │  └─ index.ts
│  ├─ assets/
│  ├─ chat/
│  │  ├─ api/
│  │  │  └─ chatApiClient.ts
│  │  └─ state/
│  │     └─ chatStore.ts
│  ├─ cms/
│  │  ├─ homepage.ts
│  │  └─ sanityClient.ts
│  ├─ components/
│  │  ├─ ApiDebug.tsx
│  │  ├─ ChatPreviewBlock.jsx
│  │  ├─ CookieBanner.tsx
│  │  ├─ FeaturedPlacesCard.jsx
│  │  ├─ FigureCard.jsx
│  │  ├─ FigureHeader.jsx
│  │  ├─ HeroBanner.jsx
│  │  └─ NewsCard.jsx
│  ├─ config/
│  │  └─ chatApi.ts
│  ├─ data/
│  │  ├─ figures.js
│  │  ├─ newsFallback.ts
│  │  └─ places.js
│  ├─ hooks/
│  │  └─ useHomepageContent.ts
│  ├─ layout/
│  │  └─ AppLayout.jsx
│  ├─ pages/
│  │  ├─ About.tsx
│  │  ├─ Chat.jsx
│  │  ├─ FigureQuotha.jsx
│  │  ├─ Home.jsx
│  │  ├─ Home.tsx
│  │  ├─ Impressum.tsx
│  │  ├─ News.jsx
│  │  ├─ News.tsx
│  │  ├─ People.jsx
│  │  ├─ People.tsx
│  │  ├─ Person.jsx
│  │  ├─ Person.tsx
│  │  ├─ Place.jsx
│  │  ├─ Place.tsx
│  │  ├─ Places.jsx
│  │  ├─ Places.tsx
│  │  ├─ PrivacyPolicy.tsx
│  │  ├─ RedirectPage.jsx
│  │  ├─ Shop.jsx
│  │  ├─ TermsOfUse.tsx
│  │  └─ About/Impressum/etc.
│  ├─ styles/
│  │  └─ global.css
│  └─ utils/
│     ├─ content.ts
│     ├─ figures.ts
│     └─ media.ts
└─ dist/ (built assets)
```

## Entry points
- React root: [src/main.jsx](../src/main.jsx) mounts `App` inside `BrowserRouter`.
- Routing: [src/App.jsx](../src/App.jsx) defines all client routes.

## Routing definitions (App.jsx)
- `/`, `/places`, `/places/:slug`, `/people`, `/people/:slug`, `/figures/quotha`, `/chat`, `/login`, `/register`, `/chat-app`, `/shop`, `/news`, `/about`, `/privacy-policy-gdpr`, `/terms-of-use`, `/impressum`.
- Redirect routes use [src/pages/RedirectPage.jsx](../src/pages/RedirectPage.jsx).
- `/chat` renders ChatHub static handoff page [src/pages/Chat.jsx](../src/pages/Chat.jsx).

## API client modules
- Core REST client: [src/api/apiClient.ts](../src/api/apiClient.ts) (figures, places, content/news, auth, admin, legacy chat endpoints). Base URL from `VITE_BACKEND_URL` with fallback `https://places-in-time-history-chat.onrender.com` set in [src/api/index.ts](../src/api/index.ts).
- Chat-specific client (legacy, currently unused by routing): [src/chat/api/chatApiClient.ts](../src/chat/api/chatApiClient.ts) uses `VITE_CHAT_API_BASE_URL` from [src/config/chatApi.ts](../src/config/chatApi.ts).
- Media resolver: [src/utils/media.ts](../src/utils/media.ts) prefixes media paths with backend base URL.
- CMS client: [src/cms/sanityClient.ts](../src/cms/sanityClient.ts) gated on `VITE_SANITY_PROJECT_ID`/`VITE_SANITY_DATASET`; homepage content loader [src/cms/homepage.ts](../src/cms/homepage.ts).

## Data models / schemas (frontend expectations)
- Type definitions in [src/api/apiClient.ts](../src/api/apiClient.ts): `HistoricalFigure`, `Place`, `ContentItem`, etc.; mixed camel/snake casing supported.
- Seed/fallback datasets: [src/data/places.js](../src/data/places.js), [src/data/figures.js](../src/data/figures.js), [src/data/newsFallback.ts](../src/data/newsFallback.ts).
- Homepage content shape in [src/cms/homepage.ts](../src/cms/homepage.ts).

## Entry components & data loading boundaries
- Places list/detail: [src/pages/Places.tsx](../src/pages/Places.tsx) and [src/pages/Place.tsx](../src/pages/Place.tsx) fetch via `api.listPlaces`/`api.getPlace`, with seed fallbacks.
- People list/detail: [src/pages/People.tsx](../src/pages/People.tsx) and [src/pages/Person.tsx](../src/pages/Person.tsx) fetch via `api.listFigures`/`api.getFigure`, with seed fallbacks.
- News feed: [src/pages/News.tsx](../src/pages/News.tsx) uses `api.listNews` with fallback items.
- Homepage pulls Sanity via [src/hooks/useHomepageContent.ts](../src/hooks/useHomepageContent.ts); falls back to static content.

## TODO / FIXME / TEMP / LEGACY markers
- LEGACY chat endpoints annotated in [src/api/apiClient.ts](../src/api/apiClient.ts#L668-L684) (legacy chat/guest ask helpers, unused).
- TODO in shop copy: [src/pages/Shop.jsx](../src/pages/Shop.jsx#L10).
- `LegacyFigureFields` naming in [src/pages/People.tsx](../src/pages/People.tsx#L10-L19) denotes compatibility layer for older figure fields (not an active TODO tag).

## Hard-coded / placeholder / temporary
- Backend base fallback URL: [src/api/index.ts](../src/api/index.ts).
- Chat hub external links: [src/pages/Chat.jsx](../src/pages/Chat.jsx).
- Redirect targets to Render chat frontend: [src/pages/RedirectPage.jsx](../src/pages/RedirectPage.jsx).
- Featured places order hard-coded in [src/pages/Home.tsx](../src/pages/Home.tsx#L16).
- Console debug logs in [src/pages/Place.tsx](../src/pages/Place.tsx#L103-L119).

## Build/tooling
- Vite config: [vite.config.js](../vite.config.js).
- ESLint: [eslint.config.js](../eslint.config.js).
- Scripts: export utility [scripts/export_places_json.mjs](../scripts/export_places_json.mjs).
- Package manifest: [package.json](../package.json) (React 19, react-router-dom 7, Vite 7, Sanity client).

## Static assets
- Public favicons/webmanifest and images under `public/`.
- Built assets under `dist/` (generated).
