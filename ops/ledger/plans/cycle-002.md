# Cycle 002 — Site nginx security headers

## Item
Add baseline security response headers to the static site nginx config.

## Hypothesis
Static: `nginx.conf` only sets Content-Type for `.md`; no X-Content-Type-Options, X-Frame-Options, Referrer-Policy, or Permissions-Policy.  
Local: curl against rebuilt container shows headers.  
Live: `curl -sSI https://localloop.urbnia.com/` shows only generic nginx headers — confirmed missing security headers.

## Repos in scope
- `localloop-site` only

## Files
- `nginx.conf` — add security headers in `server` block
- `tests/smoke.test.cjs` — assert nginx.conf contains required headers (static/source gate)

## Acceptance criteria
1. Live responses include `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geo disabled).
2. Smoke tests pass.
3. Site still serves `/` 200 after deploy.

## Cross-repo contract impact
None (static response headers only).

## Deploy order
1. `localloop-site` only

## Rollback
Previous site image / prior nginx.conf rebuild.

## Migration
None.
