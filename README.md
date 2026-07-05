# acrex — web

Next.js frontend for the acrex land marketplace backend (`../backend`).

Design system: Tailwind v4 (CSS-first) + shadcn/ui (base-nova) restyled to an
orange/terracotta identity — hairline `0.5px` borders, flat shadowless cards,
compact 11–18px type at weights 400/500, light mode default with a dark toggle.

## Run

```bash
# 1. backend (from ../backend) — needs Postgres with the arcex/acrex role+db
npm run start:dev

# 2. web
npm install
npm run dev        # http://localhost:3000
```

`.env.local`:

| Variable      | Default                 | Purpose                                   |
| ------------- | ----------------------- | ----------------------------------------- |
| `BACKEND_URL` | `http://localhost:4000` | Target of the `/api/backend/:path*` proxy |

All browser traffic — JSON, file uploads (PUT), and image downloads — flows
through the `/api/backend` rewrite in `next.config.ts`. The backend issues
upload/file URLs already prefixed with `/api/backend/...`, so the proxy is
required for photos and documents to work.

## Seed accounts

| Email             | Phone         | Password       | Role                                         |
| ----------------- | ------------- | -------------- | -------------------------------------------- |
| amina@example.com | +252611111111 | `Password123!` | USER                                         |
| omar@example.com  | +252622222222 | `Password123!` | USER (promote to ADMIN for the review queue) |

Promote an admin (role is embedded in the JWT — log in again afterwards):

```sql
UPDATE "User" SET role='ADMIN' WHERE email='omar@example.com';
```

## Notes

- Favorites are stored locally (zustand + localStorage) — the backend has no
  favorites endpoint yet.
- There is no messaging; buyers contact sellers via the phone number on the
  listing (call / WhatsApp).
- Editing a listing's details resubmits it for review (backend behavior);
  photo/document changes don't.
- Image reordering uses a two-phase update because the backend enforces
  `@@unique([listingId, order])` and applies reorders sequentially.
