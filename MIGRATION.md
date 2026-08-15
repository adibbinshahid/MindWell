# Supabase → Neon (Postgres) + Vercel Blob (uploads)

**Status: code and data fully migrated and verified.** What's left is Vercel
dashboard work — see [Remaining steps](#remaining-steps).

**Why the switch:** Supabase's free plan pauses a project after ~7 days of
inactivity and needs a manual unpause. Neon's free plan never pauses
permanently — compute scales to zero after ~5 minutes idle and auto-resumes on
the next query. The `keepalive.yml` GitHub Action and `/api/system-maintenance`
endpoint existed only to work around the Supabase pause, so both were deleted.

---

## What was done

### Database → Neon

`prisma db push` created the schema, then every row was copied across. Verified
identical on both sides — schema, indexes, and every field of every row:

| Check | Result |
|---|---|
| Column parity (9 tables) | ✓ identical |
| Index / constraint parity | ✓ identical |
| Row-level data parity | ✓ 149 rows byte-identical |
| Orphaned foreign keys | ✓ 0 |

Rows: 12 User, 4 Doctor, 118 Appointment, 4 BlogPost, 10 ContactMessage,
1 SiteContent, 0 IntakeForm/NewsletterSubscriber/BlockedSlot.

`prisma/schema.prisma` needed no changes — Neon is plain Postgres, and
`directUrl` maps to Neon's non-pooled connection string. All IDs are cuids, so
there are no sequences to reset.

### Images → repo

Five images lived in Supabase Storage and would have 404'd the moment the
project was deleted. All were pulled down while Supabase was still up:

- **4 doctor portraits** → `public/doctors/*.jpg`, resized 1684px → 600px
  (12.5 MB → 249 KB), `Doctor.photoUrl` repointed
- **Homepage hero background** → `public/hero-main.webp`, `SiteContent.hero_main`
  repointed

A sweep of **all 60 text columns across all 9 tables** now returns zero Supabase
references — nothing is hiding in a blog body or JSON blob.

These are static files served by Vercel: free, permanent, no blob store needed.

### New uploads → Vercel Blob

[app/api/upload/route.ts](app/api/upload/route.ts) now uses `@vercel/blob`
instead of the Supabase Storage REST API. This only affects images uploaded
through the admin panel *from now on*. The `public/uploads` filesystem fallback
is kept for local dev.

### Verified against Neon

`npm run build` passes, and on a running server:

- Admin login through NextAuth — bcrypt hashes migrated intact, `role: ADMIN` correct
- Booking created (201), FK joins resolve, availability recalculates, double-book → 409
- Patient registration → 201, contact form → 200, newsletter form → 303
- Upload route: image accepted, non-image rejected (400)
- Homepage hero and all four doctor photos render; zero `supabase` strings in served HTML

All smoke-test rows were deleted afterwards; counts are back to the original 149.

---

## Remaining steps

### 1. Update Vercel environment variables

- **Set** `DATABASE_URL` → Neon **pooled** string (host contains `-pooler`)
- **Set** `DIRECT_URL` → Neon **direct** string (no `-pooler`)
- **Delete** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `KEEP_ALIVE_TOKEN`
- Leave `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` as-is

Both Neon strings are in your local `.env`.

Also delete the `KEEP_ALIVE_TOKEN` and `SITE_URL` **GitHub Actions secrets** —
the workflow that used them is gone.

### 2. Push and deploy

### 3. Close the cutover gap ⚠️

Until step 1 lands, the **live site is still writing to Supabase**. Any booking,
registration, or contact message submitted in the meantime exists only there.

After the deploy is live on Neon, run this once to sweep those stragglers over:

```bash
npx tsx prisma/migrate-from-supabase.ts "<supabaseDirectUrl>" "<neonUrl>"
```

It is idempotent — it copies only what's missing, rewrites any Supabase image
URLs, and re-runs the full verification. Running it twice is harmless.

### 4. Verify the live site

Doctor photos on `/team`, homepage hero, admin login, and a test booking.

### 5. Rotate the Neon password

The connection string was pasted into a chat, so treat it as exposed:
Neon → **Roles** → `neondb_owner` → **Reset password**, then update `.env` and
the Vercel env vars.

### 6. Delete the Supabase project

Only after steps 3 and 4 pass. Supabase → Settings → General → **Delete project**.
Then delete `prisma/migrate-from-supabase.ts` — it has no purpose after that.

### Optional: Vercel Blob store

Only needed for uploading *new* images through the admin panel. Existing images
are static files and work without it.

Vercel → Storage → **Create** → **Blob** → connect to project. Vercel injects
`BLOB_READ_WRITE_TOKEN` into deploys; copy it into `.env` for local dev.

---

## Unrelated bug found along the way — fixed

`POST /api/newsletter` called `req.text()` and then `req.json()` on the same
request. A body stream can only be read once, so `req.json()` always threw, the
`.catch()` swallowed it into `{}`, and every JSON client got `400 Email
required`. The site's own HTML form posts form-encoded data, so this only ever
hit JSON callers — pre-existing and unrelated to the migration.

Now reads the body once and parses it by content type. JSON requests get a JSON
response; form posts keep their 303 redirect. Malformed JSON returns 400 rather
than throwing a 500, non-string emails are rejected, and addresses are trimmed
so `" a@b.com "` upserts onto the existing row instead of duplicating it.

---

## Free-tier limits you're now inside

| | Neon free | Vercel Blob (Hobby) |
|---|---|---|
| Storage | 0.5 GB per project | ~1 GB included, metered beyond |
| Compute | 100 CU-hours/month | n/a |
| Idle behavior | scales to zero, auto-wakes | always available |
| Pauses permanently? | **No** | **No** |

First request after idle has a cold start of roughly half a second while Neon
resumes compute. That's the whole cost of scale-to-zero.

Sources: [Neon pricing](https://neon.com/pricing) ·
[Neon free-tier FAQ](https://neon.com/faqs/managed-postgres-databases-free-tier)
