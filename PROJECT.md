# Project Guide

## Overview

**Linksmith** is a small URL shortener. A visitor enters an HTTP(S) URL, the client asks the server to create an 8-character Nano ID code, and the server stores the mapping in MongoDB. Visiting the generated root link looks up the code and redirects to the original URL.

**Users:** only an anonymous visitor is represented. There is no account or role system. **Status:** core create-and-redirect flow exists; production readiness is limited. Deployment details and environment values are **UNKNOWN**.

## Stack and structure

- **Client:** React 19, Vite, Axios, Tailwind CSS 4 (Vite plugin), custom CSS. Local component state; no router or dedicated state library.
- **Server:** Node.js ES modules, Express 5, Mongoose 9, Nano ID, dotenv, CORS.
- **Database:** MongoDB; connection expects `MONGODB_URI` and `MONGODB_DB_NAME`.
- `client/src/` — app entry, shortener UI and styles.
- `server/src/` — startup, Express app, DB connection, URL route/controller/model.

## Main flow

```text
Visitor enters URL → React sends POST /api/url → Express creates a code
→ MongoDB stores original URL and code → client displays short link
→ GET /:shortCode looks up record → HTTP 302 redirect
```

The client builds its API address from `VITE_BASE_URL`. Creation returns a short link using the request host and protocol. The separate `GET /api/url/:shortCode` route calls a similar redirect controller, but the client-generated link uses `/:shortCode`.

## Data and access

`Url` stores `originalUrl`, `shortCode`, `clicks` (default 0), `createdAt`, `status` (`active`/`inactive`), and Mongoose timestamps. No user relationship exists. Authentication and authorization are **NOT FOUND**. Although `status` exists, redirect handlers do not check it; click counts are not updated.

## Important issues

- No verified server-side URL validation: arbitrary `originalUrl` strings can be stored and later redirected to. Validate and allow only `http:`/`https:` on the server.
- `shortCode` has no unique index; handle rare collisions to prevent ambiguous mappings.
- CORS allows every origin. Restrict origins when deploying.
- DB connection errors are logged and swallowed in `connectDB`; startup may proceed after a failed connection. Propagate failure and avoid listening without the DB.
- No visible rate limiting, abuse controls, or automated tests (**NOT FOUND** in the inspected files).

## Quick explanation

Linksmith is a React and Express URL shortener backed by MongoDB. The browser submits a long URL, the API stores it against a Nano ID, and requests to the short code redirect to the stored destination. The current implementation has no accounts and needs server-side validation and deployment safeguards before public use.
