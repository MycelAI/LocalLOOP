# Cycle 003 — Interest search must respect shareEmail

## Item
`listInterests(search)` returns raw email even when `shareEmail` is false; non-search path already redacts.

## Hypothesis
Static: search SQL selects `email` and `mapInterestRow` always maps it; findMany path uses `shareEmail ? email : null`.  
Local: unit test with shareEmail false + search.  
Live: privacy correctness risk on `GET /api/interest?search=`.

## Repos
- localloop-backend only

## Acceptance
1. Search results null email when shareEmail false
2. Non-search path unchanged
3. Tests pass; deploy + smoke

## Deploy
backend api only

## Rollback
previous image
