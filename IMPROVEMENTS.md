# Improvement Notes

Prioritized recommendations based on the current URL shortener code.

## Do first: correctness and safety

1. **Validate URLs in the API.** Parse with the platform `URL` class and accept only `http:` and `https:`; return a clear 400 for invalid input. Client checks are not a security boundary.
2. **Make codes unique.** Add a unique database index on `shortCode` and retry if Nano ID collides.
3. **Fail cleanly on database errors.** Let connection failures reach startup and do not accept traffic without MongoDB.
4. **Use the configured public short-link domain.** Request-derived host/protocol can generate incorrect links behind a proxy or on separate frontend/backend hosts.
5. **Restrict CORS and add basic rate limiting.** Helps control cross-origin use and automated link abuse.

## Complete the core experience

- Honor `status` when redirecting and increment `clicks` atomically; optionally expose a small stats endpoint.
- Show distinct validation, network, and server errors. Handle clipboard failures and provide clear loading/success feedback.
- Add tests for valid/invalid creation, missing codes, redirects, disabled links, and DB failure behavior.

## Later, if useful

Add custom aliases, link expiry, and a user's link history only if the product needs those workflows. Avoid accounts, queues, Redis, or microservices until there is a real need.

## Suggested sequence

**Phase 1:** server validation, database startup failure handling, unique codes.  
**Phase 2:** canonical domain, CORS/rate limits, status and click tracking.  
**Phase 3:** clearer client errors and focused API/UI tests.  
**Phase 4:** optional custom aliases, expiry, or link management.

**Assessment:** the create-and-redirect path is present and easy to follow. The biggest gaps are server-side URL checks, collision handling, operational configuration, and abuse protection. A modest, reliable single-service app is the natural target.
