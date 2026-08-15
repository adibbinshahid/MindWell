# Supabase → Neon (Postgres) + Vercel Blob (uploads)

**Status: migration complete locally.** Code, schema, and all data are on Neon.
What's left is Vercel dashboard work — see [Remaining steps](#remaining-steps).

**Why the switch:** Supabase's free plan pauses a project after ~7 days of
inactivity and needs a manual unpause. Neon's free plan never pauses
permanently — compute scales to zero after ~5 minutes idle and auto-resumes on
the next query. The `keepalive.yml` GitHub Action and `/api/system-maintenance`
endpoint existed only to work around the Supabase pause, so both were deleted.

---

## What was done

**Database → Neon.** `prisma db push` created the schema, then every row was
copied Supabase → Neon with a Prisma script. Verified equal on both sides:

| Table | Rows |
|---|---|
| User | 12 |
| Doctor | 4 |
| Appointment | 118 |
| BlogPost | 4 |
| ContactMessage | 10 |
| SiteContent | 1 |
| IntakeForm / NewsletterSubscriber / BlockedSlot | 0 |

`prisma/schema.prisma` needed no changes — Neon is plain Postgres, and
`directUrl` maps to Neon's non-pooled connection string.

**Doctor photos → repo.** The four doctor portraits lived in Supabase Storage.
They were downloaded while Supabase was still up, resized 1684px → 600px and
converted to JPEG (12.5 MB → 249 KB total), committed to `public/doctors/`, and
`Doctor.photoUrl` was repointed to `/doctors/*.jpg`. Zero rows in the database
still reference Supabase. These are static files now — free, permanent, and
independent of any blob store.

**Future uploads → Vercel Blob.** [app/api/upload/route.ts](app/api/upload/route.ts)
now uses `@vercel/blob` instead of the Supabase Storage REST API. This only
matters for *new* images uploaded through the admin panel.

**Verified:** `npm run build` passes, `/api/doctors` serves Neon data, `/team`
renders all four photos, and `/`, `/blog`, `/book`, `/login`, `/admin` all
return 200 against Neon.

---

## Remaining steps

### 1. Create the Vercel Blob store

Only needed so the admin panel can upload *new* images. Existing photos already
work without it.

1. Vercel dashboard → your project → **Storage** → **Create** → **Blob**
2. Connect it to the project — Vercel injects `BLOB_READ_WRITE_TOKEN` into deploys
3. For local dev, copy that token into `.env` as `BLOB_READ_WRITE_TOKEN`

Without the token, uploads fall back to writing into `public/uploads` — fine
locally, useless on Vercel (ephemeral filesystem).

### 2. Update Vercel environment variables

- **Set** `DATABASE_URL` → Neon **pooled** string (host contains `-pooler`)
- **Set** `DIRECT_URL` → Neon **direct** string (no `-pooler`)
- **Delete** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `KEEP_ALIVE_TOKEN`
- Leave `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` as-is

Both Neon strings are in your local `.env` — copy from there.

Also delete the `KEEP_ALIVE_TOKEN` and `SITE_URL` **GitHub Actions secrets**;
the workflow that used them is gone.

### 3. Deploy and verify

Push, let Vercel build, then check the live site: doctor photos load on `/team`,
admin login works, and a test booking saves.

### 4. Rotate the Neon password

The Neon connection string was pasted into a chat, so treat it as exposed:
Neon → **Roles** → `neondb_owner` → **Reset password**, then update `.env` and
the Vercel env vars with the new string.

### 5. Delete the Supabase project

Only after step 3 passes. Supabase → Settings → General → **Delete project**.
Nothing depends on it anymore — data is on Neon, images are in the repo.

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
