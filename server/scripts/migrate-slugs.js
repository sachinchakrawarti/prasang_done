// server/scripts/migrate-slugs.js
//
// One-time migration: convert existing Devanagari (or otherwise non-ASCII)
// poem slugs into ASCII slugs generated from the title.
//
// Usage:
//   cd server
//   node scripts/migrate-slugs.js
//
// Back up your DB first:
//   Copy-Item db\database\prasang.db db\database\prasang.backup.db

import { db } from "../config/database.js";
import { poems } from "../../db/schema/index.js";
import { eq } from "drizzle-orm";
import { slugify, makeUniqueSlug } from "../utils/slugify.js";

async function main() {
  const all = await db
    .select({
      id: poems.id,
      title: poems.title,
      slug: poems.slug,
    })
    .from(poems);

  let changed = 0;

  for (const row of all) {
    const source = row.title || row.slug || `poem-${row.id}`;
    const desired = slugify(source);

    // If current slug already matches the desired ascii form, skip.
    if (row.slug === desired) continue;

    const newSlug = await makeUniqueSlug(db, poems, source, row.id);

    if (newSlug !== row.slug) {
      await db
        .update(poems)
        .set({ slug: newSlug })
        .where(eq(poems.id, row.id));

      console.log(`#${row.id}  ${row.slug}  ->  ${newSlug}`);
      changed++;
    }
  }

  console.log(`\nDone. ${changed} of ${all.length} slugs updated.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });