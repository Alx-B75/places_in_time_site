# Guest Chat Routing Contract

## Active guarantees

1. **Guest chat runs in-site.** The `/guest/:slug` route mounts the Places in Time chat UI via `ChatProvider` and `GuestChat`, restoring the behaviour defined before commit 1bcf62c.
2. **Guest flow stays on-domain.** The guest chat experience does not render `RedirectPage`, call `window.location`, or otherwise leave the `_site` origin while guests ask questions or exhaust their allowance.
3. **Auth escape is intentional and limited.** Only the "Log in" and "Sign up" buttons rendered inside `GuestChat` link to `https://places-in-time-history-chat-front.onrender.com`. These links provide the temporary bridge to the legacy authentication frontend and are not used anywhere else in the guest flow.
4. **Legacy frontend usage is temporary.** The external login/register URLs exist solely until the new authentication experience ships. Future work should replace them with an in-site auth flow without changing any other guest chat routing.

## Future work placeholder

- Document and implement the migration plan that retires the legacy frontend once the unified auth experience is ready.
- Update this contract accordingly when the external dependency is removed.
