# Client Guide

## App and files

The client is a React 19 single-page app built with Vite. `src/main.jsx` imports global CSS and mounts `App` under `StrictMode`. `src/App.jsx` contains the entire shortener interface and behavior; `App.css` and `index.css` provide styling. There is no client router, global state manager, or reusable API layer in the inspected source.

## User interaction

1. The URL input is controlled by React state (`url`). On change, the app tries `new URL(value)` and clears or sets a status message depending on whether the protocol is HTTP(S).
2. Submitting prevents the browser form action, clears previous result/status, sets loading state, and posts `{ originalUrl: url }` to `${VITE_BASE_URL}/api/url` with Axios.
3. A successful response (`data.success`) shows `data.shortUrl` and a success message. A non-success response displays its message when present. Request failures show a generic URL prompt; loading resets in `finally`.
4. The result link opens in a new tab. Copy uses `navigator.clipboard.writeText` and updates the status.

## Important behavior and gaps

- The browser input uses `type="url"` and `required`, but the custom `isValidUrl` check only controls messaging; it does not block submission itself. The API must validate independently.
- The response error message says to enter a valid URL even for network/server failures, so it can mislead.
- Clipboard errors are not caught. No reset/history, editing, analytics, or account UI was found.
- `VITE_BASE_URL` must be supplied at build/runtime; exact deployment configuration is **UNKNOWN**.
- Styling and semantic feedback include a status region and live result region. Keyboard/screen-reader behavior beyond the visible markup is **NEEDS VERIFICATION**.

## Client to API contract

`POST {VITE_BASE_URL}/api/url` with JSON `{ "originalUrl": "https://…" }`. Expected success fields: `{ success, shortUrl, message }`. The client does not define a shared response type or request timeout.
