// D:\Projects\done\prasang_done\db\automation\syncUrdu.js

import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { eq, and, sql } from "drizzle-orm";

import * as schema from "../schema/index.js";
import { poets } from "../schema/poets.js";
import { poems } from "../schema/poems.js";
import { categories } from "../schema/categories.js";

// --------------------------------------------------
// Resolve DB path relative to this file, not CWD
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This file lives in db/automation/, so the DB is at db/database/prasang.db
const DB_PATH = path.resolve(__dirname, "../database/prasang.db");

console.log("🇵🇰 Starting Urdu poetry sync...");
console.log("📁 Database:", DB_PATH);

// --------------------------------------------------
// DB client
// --------------------------------------------------

const client = createClient({
  url: `file:${DB_PATH}`,
});

const db = drizzle(client, { schema });

// --------------------------------------------------
// Urdu poetry dataset
// --------------------------------------------------

const URDU_POEMS = [
  // Mirza Ghalib
  {
    title: "دلِ ناداں تجھے ہوا کیا ہے",
    author: "مرزا غالب",
    category: "ghazal",
    lines: [
      "دلِ ناداں تجھے ہوا کیا ہے",
      "آخر اس درد کی دوا کیا ہے",
      "",
      "ہم ہیں مشتاق اور وہ بیزار",
      "یا الٰہی یہ ماجرا کیا ہے",
    ],
  },
  {
    title: "ہزاروں خواہشیں ایسی",
    author: "مرزا غالب",
    category: "ghazal",
    lines: [
      "ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے",
      "بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے",
    ],
  },

  // Allama Iqbal
  {
    title: "خودی کو کر بلند اتنا",
    author: "علامہ اقبال",
    category: "nazm",
    lines: [
      "خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے",
      "خدا بندے سے خود پوچھے بتا تیری رضا کیا ہے",
    ],
  },
  {
    title: "لب پہ آتی ہے دعا بن کے تمنا میری",
    author: "علامہ اقبال",
    category: "nazm",
    lines: [
      "لب پہ آتی ہے دعا بن کے تمنا میری",
      "زندگی شمع کی صورت ہو خدایا میری",
    ],
  },

  // Faiz Ahmed Faiz
  {
    title: "اور بھی دکھ ہیں زمانے میں",
    author: "فیض احمد فیض",
    category: "ghazal",
    lines: [
      "اور بھی دکھ ہیں زمانے میں محبت کے سوا",
      "راحتیں اور بھی ہیں وصل کی راحت کے سوا",
    ],
  },
  {
    title: "مجھ سے پہلی سی محبت",
    author: "فیض احمد فیض",
    category: "ghazal",
    lines: [
      "مجھ سے پہلی سی محبت مری محبوب نہ مانگ",
      "میں نے سمجھا تھا کہ تو ہے تو درخشاں ہے حیات",
    ],
  },
];

const URDU_CATEGORIES = [
  {
    name: "اردو شاعری",
    slug: "urdu-poetry",
    description: "Urdu poetry collection",
  },
  {
    name: "غزل",
    slug: "ghazal",
    description: "Urdu ghazal",
  },
  {
    name: "نظم",
    slug: "nazm",
    description: "Urdu nazm",
  },
];

// --------------------------------------------------
// Slugify (Urdu + Devanagari aware)
// --------------------------------------------------

const URDU_MAP = {
  "ا": "a",  "آ": "aa", "أ": "a",  "إ": "i",  "ٱ": "a",
  "ب": "b",  "پ": "p",  "ت": "t",  "ٹ": "t",  "ث": "s",
  "ج": "j",  "چ": "ch", "ح": "h",  "خ": "kh",
  "د": "d",  "ڈ": "d",  "ذ": "z",  "ر": "r",  "ڑ": "r",
  "ز": "z",  "ژ": "zh", "س": "s",  "ش": "sh",
  "ص": "s",  "ض": "z",  "ط": "t",  "ظ": "z",
  "ع": "",   "غ": "gh", "ف": "f",  "ق": "q",
  "ک": "k",  "گ": "g",  "ل": "l",  "م": "m",
  "ن": "n",  "ں": "n",  "و": "o",  "ہ": "h",
  "ھ": "h",  "ء": "",   "ی": "i",  "ے": "e",
  "ۓ": "e",  "ؤ": "o",  "ئ": "i",
  "َ": "a",  "ِ": "i",  "ُ": "u",
  "ً": "an", "ٍ": "in", "ٌ": "un",
  "ْ": "",   "ّ": "",   "ٰ": "a",
  "۔": " ",  "،": " ",  "؟": " ",
  "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4",
  "۵":"5","۶":"6","۷":"7","۸":"8","۹":"9",
};

const URDU_DIGRAPHS = [
  ["کھ","kh"],["گھ","gh"],["چھ","chh"],["جھ","jh"],
  ["تھ","th"],["دھ","dh"],["ٹھ","th"],["ڈھ","dh"],
  ["بھ","bh"],["پھ","ph"],
];

const DEV_MAP = {
  "अ":"a","आ":"aa","इ":"i","ई":"i","उ":"u","ऊ":"u",
  "ए":"e","ऐ":"ai","ओ":"o","औ":"au",
  "क":"k","ख":"kh","ग":"g","घ":"gh","च":"ch","छ":"chh","ज":"j","झ":"jh",
  "ट":"t","ठ":"th","ड":"d","ढ":"dh","ण":"n",
  "त":"t","थ":"th","द":"d","ध":"dh","न":"n",
  "प":"p","फ":"ph","ब":"b","भ":"bh","म":"m",
  "य":"y","र":"r","ल":"l","व":"v",
  "श":"sh","ष":"sh","स":"s","ह":"h",
  "ा":"a","ि":"i","ी":"i","ु":"u","ू":"u",
  "े":"e","ै":"ai","ो":"o","ौ":"au",
  "ं":"n","ँ":"n","ः":"h","्":"","़":"",
};

function transliterateUrdu(str) {
  let text = str;
  for (const [seq, rep] of URDU_DIGRAPHS) {
    text = text.split(seq).join(rep);
  }
  return text
    .split("")
    .map((ch) => URDU_MAP[ch] ?? ch)
    .join("");
}

function transliterateDevanagari(str) {
  return str
    .split("")
    .map((ch) => DEV_MAP[ch] ?? ch)
    .join("");
}

function slugify(input) {
  if (!input) return "untitled";

  let text = input;

  if (/[\u0900-\u097F]/.test(input)) {
    text = transliterateDevanagari(input);
  } else if (/[\u0600-\u06FF]/.test(input)) {
    text = transliterateUrdu(input);
  }

  const slug = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "untitled";
}

async function makeUniquePoemSlug(title, excludeId = null) {
  const base = slugify(title);
  let candidate = base;
  let counter = 1;

  while (true) {
    const where = excludeId
      ? and(eq(poems.slug, candidate), sql`${poems.id} != ${excludeId}`)
      : eq(poems.slug, candidate);

    const [existing] = await db
      .select({ id: poems.id })
      .from(poems)
      .where(where)
      .limit(1);

    if (!existing) return candidate;
    counter += 1;
    candidate = `${base}-${counter}`;
  }
}

// --------------------------------------------------
// Categories
// --------------------------------------------------

async function ensureUrduCategories() {
  console.log("🏷️  Ensuring Urdu categories exist...");

  for (const category of URDU_CATEGORIES) {
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, category.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(categories).values({
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: null,
        sortOrder: 0,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ Created category: ${category.name} (${category.slug})`);
    } else {
      console.log(`ℹ️  Category exists: ${category.slug}`);
    }
  }
}

async function getCategoryId(slug) {
  const [cat] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return cat?.id ?? null;
}

// --------------------------------------------------
// Poets
// --------------------------------------------------

async function getOrCreateUrduPoet(name) {
  if (!name) return null;

  const existing = await db
    .select()
    .from(poets)
    .where(sql`LOWER(${poets.name}) = LOWER(${name})`)
    .limit(1);

  if (existing.length > 0) return existing[0];

  const slug = slugify(name);
  console.log(`👤 Creating Urdu poet: ${name} (${slug})`);

  const [created] = await db
    .insert(poets)
    .values({
      name,
      slug,
      bio: "Urdu poet",
      language: "ur",
      status: "published",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return created;
}

// --------------------------------------------------
// Sync
// --------------------------------------------------

async function syncUrduPoems() {
  let added = 0;
  let skipped = 0;
  let errored = 0;

  const fallbackCategoryId = await getCategoryId("urdu-poetry");

  for (const data of URDU_POEMS) {
    try {
      const poet = await getOrCreateUrduPoet(data.author);
      if (!poet) {
        errored++;
        console.error(`❌ Skipped (no poet): ${data.title}`);
        continue;
      }

      const dup = await db
        .select({ id: poems.id })
        .from(poems)
        .where(
          and(eq(poems.title, data.title), eq(poems.poetId, poet.id))
        )
        .limit(1);

      if (dup.length > 0) {
        skipped++;
        console.log(`⏭️  Skipping existing: ${data.title}`);
        continue;
      }

      const categoryId =
        (await getCategoryId(data.category)) ?? fallbackCategoryId ?? 1;

      const slug = await makeUniquePoemSlug(data.title);

      await db.insert(poems).values({
        title: data.title,
        slug,
        content: data.lines.join("\n"),
        poetId: poet.id,
        categoryId,
        language: "ur",
        script: "Arabic",
        status: "published",
        contentVersion: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      added++;
      console.log(`✅ Added: ${data.title} → /${slug}`);
    } catch (err) {
      errored++;
      console.error(`❌ Error saving "${data.title}":`, err.message);
    }
  }

  return { added, skipped, errored };
}

// --------------------------------------------------
// Main
// --------------------------------------------------

async function main() {
  try {
    await ensureUrduCategories();
    const result = await syncUrduPoems();
    console.log("\n✨ Urdu poetry sync complete!");
    console.log("📊 Summary:", result);
  } catch (err) {
    console.error("❌ Sync failed:", err);
    throw err;
  }
}

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err);
  process.exit(1);
});

main()
  .then(() => {
    console.log("✅ Done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Fatal error:", err);
    process.exit(1);
  });

export { syncUrduPoems, ensureUrduCategories };