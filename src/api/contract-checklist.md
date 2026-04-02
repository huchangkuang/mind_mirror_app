# API Contract Checklist (Web + mind_mirror_api)

## Base URL

- Mobile default base URL: `http://localhost:3001/api/v1`
- Config override: `EXPO_PUBLIC_API_BASE_URL`

## Auth

- [x] `POST /auth/register` body: `{ username, password }` -> returns `{ accessToken, refreshToken }`
- [x] `POST /auth/login` body: `{ username, password }` -> returns `{ accessToken, refreshToken }`
- [x] `POST /auth/refresh` body: `{ refreshToken }` -> returns new token pair
- [x] `POST /auth/logout` body: `{ refreshToken }`
- [ ] `GET /auth/me` response mapping to mobile user profile model
- [ ] `PATCH /auth/profile` body: `{ nickname }`
- [ ] `POST /auth/change-password` body: `{ currentPassword, newPassword }`

## Tests / History

- [ ] `GET /tests` response mapping (`tests` list)
- [ ] `GET /tests/history?test_id=<id>` response mapping
- [ ] `POST /tests/history` body: `{ testId, result, resultSummary }`

## MBTI

- [ ] `GET /mbti/questions?mode=quick|deep` response mapping
- [ ] `POST /mbti/submit` body/response contract mapping

## City Match

- [ ] `GET /city-match/questions?mode=quick|full` response mapping
- [ ] Confirm whether city-match result is submitted via dedicated backend endpoint (currently backend has no `POST /city-match/submit`)

## Error Mapping Checks

- [x] 401 -> `UNAUTHORIZED`
- [x] 403 -> `FORBIDDEN`
- [x] 422 -> `VALIDATION` (with field errors)
- [x] network timeout/no response -> `NETWORK`
- [x] 5xx -> `SERVER`
