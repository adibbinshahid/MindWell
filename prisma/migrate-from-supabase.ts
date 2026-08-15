/**
 * One-shot / repeatable Supabase → Neon data migration.
 *
 *   npx tsx prisma/migrate-from-supabase.ts "<supabaseUrl>" "<neonUrl>"
 *
 * Safe to run more than once. Rows are inserted with skipDuplicates, so a
 * second run only carries over records created since the previous run — which
 * is exactly what you want at cutover, when the live site has still been
 * writing to Supabase after the first copy.
 *
 * Delete this file once the Supabase project is gone.
 */
import { PrismaClient } from "@prisma/client";

const [, , SOURCE, TARGET] = process.argv;

if (!SOURCE || !TARGET) {
  console.error('usage: tsx prisma/migrate-from-supabase.ts "<supabaseUrl>" "<neonUrl>"');
  process.exit(1);
}

const src = new PrismaClient({ datasources: { db: { url: SOURCE } } });
const dst = new PrismaClient({ datasources: { db: { url: TARGET } } });

/** Parents before children, so foreign keys always resolve. */
const TABLES = [
  "user", "doctor", "appointment", "intakeForm", "blogPost",
  "contactMessage", "newsletterSubscriber", "blockedSlot", "siteContent",
] as const;

/**
 * Images that used to live in Supabase Storage and are now static files in
 * public/. Any freshly-copied row still pointing at Supabase gets rewritten.
 */
const URL_REWRITES: Record<string, string> = {
  "1781247450380-swwun6.png": "/doctors/alex-turner.jpg",
  "1781247467155-jx3re1.png": "/doctors/jessica-okafor.jpg",
  "1781247471816-mfxu5v.png": "/doctors/pricila-nair.jpg",
  "1781247476186-bsytmz.png": "/doctors/sarah-mitchell.jpg",
  "1781280499238-7upb53.webp": "/hero-main.webp",
};

const CHUNK = 200;

type AnyModel = {
  findMany: (a?: unknown) => Promise<Record<string, unknown>[]>;
  createMany: (a: { data: unknown[]; skipDuplicates: boolean }) => Promise<{ count: number }>;
  count: (a?: unknown) => Promise<number>;
};
const model = (c: PrismaClient, name: string) =>
  (c as never as Record<string, AnyModel>)[name];

async function copy() {
  console.log("=== COPY ===");
  let total = 0;
  for (const t of TABLES) {
    const rows = await model(src, t).findMany();
    if (rows.length === 0) {
      console.log(`  ${t.padEnd(22)} 0 rows`);
      continue;
    }
    let written = 0;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const res = await model(dst, t).createMany({
        data: rows.slice(i, i + CHUNK),
        skipDuplicates: true,
      });
      written += res.count;
    }
    total += written;
    const skipped = rows.length - written;
    console.log(
      `  ${t.padEnd(22)} ${written} new` + (skipped > 0 ? `, ${skipped} already present` : "")
    );
  }
  console.log(`  ${total} new row(s) written`);
}

/** Rewrites Supabase Storage URLs in every text column of every table. */
async function rewriteUrls() {
  console.log("\n=== REWRITE SUPABASE URLS ===");
  const cols = await dst.$queryRawUnsafe<{ table_name: string; column_name: string }[]>(
    `SELECT table_name, column_name
     FROM information_schema.columns
     WHERE table_schema='public'
       AND data_type IN ('text','character varying','character')
     ORDER BY table_name, column_name`
  );

  let changed = 0;
  for (const c of cols) {
    const rows = await dst.$queryRawUnsafe<{ id: string; val: string }[]>(
      `SELECT "id"::text AS id, "${c.column_name}"::text AS val
       FROM "${c.table_name}"
       WHERE "${c.column_name}"::text ILIKE '%supabase%'`
    );

    for (const r of rows) {
      const hit = Object.entries(URL_REWRITES).find(([file]) => r.val.includes(file));
      if (!hit) {
        console.log(`  ! ${c.table_name}.${c.column_name} id=${r.id} has an unmapped Supabase URL:`);
        console.log(`    ${r.val.slice(0, 200)}`);
        console.log(`    Download it, put it in public/, and add it to URL_REWRITES.`);
        continue;
      }
      await dst.$executeRawUnsafe(
        `UPDATE "${c.table_name}" SET "${c.column_name}" = $1 WHERE "id"::text = $2`,
        hit[1],
        r.id
      );
      console.log(`  ✓ ${c.table_name}.${c.column_name} id=${r.id} → ${hit[1]}`);
      changed++;
    }
  }
  console.log(changed === 0 ? "  nothing to rewrite" : `  ${changed} URL(s) rewritten`);
}

async function verify() {
  console.log("\n=== VERIFY ===");
  let bad = 0;

  for (const t of TABLES) {
    const [a, b] = await Promise.all([model(src, t).count(), model(dst, t).count()]);
    const ok = b >= a; // Neon may legitimately hold more (rows created post-cutover).
    if (!ok) bad++;
    console.log(`  ${ok ? "✓" : "✗"} ${t.padEnd(22)} supabase=${a}  neon=${b}`);
  }

  const orphans = await dst.$queryRawUnsafe<{ n: bigint }[]>(
    `SELECT count(*) AS n FROM "Appointment" a
     WHERE NOT EXISTS (SELECT 1 FROM "User"   u WHERE u.id = a."userId")
        OR NOT EXISTS (SELECT 1 FROM "Doctor" d WHERE d.id = a."doctorId")`
  );
  const n = Number(orphans[0].n);
  if (n > 0) bad++;
  console.log(`  ${n === 0 ? "✓" : "✗"} Appointment orphaned references: ${n}`);

  const stragglers = await dst.doctor.count({ where: { photoUrl: { contains: "supabase" } } })
    + await dst.blogPost.count({ where: { imageUrl: { contains: "supabase" } } })
    + await dst.siteContent.count({ where: { value: { contains: "supabase" } } });
  if (stragglers > 0) bad++;
  console.log(`  ${stragglers === 0 ? "✓" : "✗"} rows still pointing at Supabase: ${stragglers}`);

  console.log(bad === 0 ? "\nALL CHECKS PASSED" : `\n${bad} CHECK(S) FAILED`);
  process.exitCode = bad === 0 ? 0 : 1;
}

(async () => {
  await copy();
  await rewriteUrls();
  await verify();
})()
  .catch((e) => { console.error("FAIL:", e.message); process.exit(1); })
  .finally(async () => { await src.$disconnect(); await dst.$disconnect(); });
