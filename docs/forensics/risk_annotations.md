# Risk annotations

- Backend contract opacity: No backend repo or OpenAPI available; frontend defaults to hard-coded Render base URLs ([src/api/index.ts](../src/api/index.ts), [src/config/chatApi.ts](../src/config/chatApi.ts)). Any API shape changes will silently break fetches or media resolution.
- Legacy chat code divergence: `/chat` now a static hub ([src/pages/Chat.jsx](../src/pages/Chat.jsx)), while legacy in-app chat client/store remain ([src/chat/api/chatApiClient.ts](../src/chat/api/chatApiClient.ts), [src/chat/state/chatStore.ts](../src/chat/state/chatStore.ts)). If reactivated without alignment to current backend, failures likely.
- Seed fallback masking outages: Lists/pages fall back to static seeds ([src/data/places.js](../src/data/places.js), [src/data/figures.js](../src/data/figures.js), [src/data/newsFallback.ts](../src/data/newsFallback.ts)), so production data/API failures may go unnoticed.
- CMS optionality: Homepage content depends on Sanity env vars ([src/cms/sanityClient.ts](../src/cms/sanityClient.ts)); missing config silently uses static copy, hiding CMS regressions.
- Missing routes for CTAs: Quotha page links to `/chat/choose` which has no route ([src/pages/FigureQuotha.jsx](../src/pages/FigureQuotha.jsx)), creating a dead end.
- TODO/placeholder content: Shop page contains TODO for merch copy ([src/pages/Shop.jsx](../src/pages/Shop.jsx#L10)), indicating unfinished surface.
