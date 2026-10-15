# Server Guide

## Startup and configuration

`src/index.js` imports the Express app, connects to MongoDB, then listens on `PORT` or `3000`. `src/db/index.js` loads dotenv and connects using `MONGODB_URI` plus `MONGODB_DB_NAME`. Required deployment values and hosting setup are **UNKNOWN**. The connection helper catches and logs errors without rethrowing, so the caller can continue to listen after a connection failure.

## Request setup and routes

`src/app.js` enables JSON parsing and CORS with `origin: '*'`, exposes `GET /` as a health-like greeting, and mounts `/api/url` routes. It also implements `GET /:shortCode` directly.

| Method and path | Behavior |
|---|---|
| `POST /api/url` | Requires a truthy `originalUrl`; creates an 8-character Nano ID, persists it and returns a link derived from request protocol/host. |
| `GET /:shortCode` | Looks up the code and responds with a 302 redirect, 404 when missing, or 500 on error. |
| `GET /api/url/:shortCode` | Same redirect behavior via controller, mounted under the API router. |
| `GET /` | Returns `Hello, World!`. |

## Data model

Mongoose model `Url` has required string `originalUrl` and `shortCode`; numeric `clicks` defaults to 0; `createdAt` defaults to now; `status` is `active` or `inactive` and defaults active. `{ timestamps: true }` also adds `createdAt` and `updatedAt`. There is no declared unique index or user ownership relation.

## Validation, errors, and security

Creation checks only that `originalUrl` is present. URL parsing/protocol checks exist in the browser only, so API callers can submit arbitrary values; redirect destination validation is also absent. Both redirect handlers ignore `status` and do not increment `clicks`. The controller's fallback link uses the incoming request host, which may not be the public short-domain behind a proxy. CORS is unrestricted. Authentication, authorization, rate limiting, structured logging, and automated tests are **NOT FOUND** in the inspected server source.

Recommended first changes: validate and normalize HTTP(S) URLs on the server; add a unique index and collision retry for `shortCode`; restrict CORS; enforce active status and increment analytics atomically; fail startup when MongoDB is unavailable; configure the canonical public base URL explicitly.
