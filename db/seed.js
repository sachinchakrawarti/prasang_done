import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import {
  poets,
  categories,
  tags,
  poems,
  contributors,
  aiTranslations,
} from "./schema/index.js";

// --------------------------------------------------
// DATABASE
// --------------------------------------------------

const sqlite = new Database("./database/prasang.db");

const db = drizzle(sqlite);

console.log("🌱 Starting seed...");

try {
  // ------------------------------------------------
  // POETS
  // ------------------------------------------------

  const [shakespeare] = await db
    .insert(poets)
    .values({
      name: "William Shakespeare",
      slug: "william-shakespeare",
      bio: "English poet and playwright.",
      country: "England",
      birthDate: "1564-04-26",
      deathDate: "1616-04-23",
      language: "en",
      photo: null,
      website: null,
      status: "published",
    })
    .returning();

  const [tagore] = await db
    .insert(poets)
    .values({
      name: "Rabindranath Tagore",
      slug: "rabindranath-tagore",
      bio: "Indian poet, writer and philosopher.",
      country: "India",
      birthDate: "1861-05-07",
      deathDate: "1941-08-07",
      language: "bn",
      photo: null,
      website: null,
      status: "published",
    })
    .returning();

  console.log("✓ Poets added");

  // ------------------------------------------------
  // CATEGORIES
  // ------------------------------------------------

  const [sonnet] = await db
    .insert(categories)
    .values({
      name: "Sonnet",
      slug: "sonnet",
      description: "A fourteen-line poetic form.",
      parentId: null,
      sortOrder: 1,
      status: "active",
    })
    .returning();

  const [ghazal] = await db
    .insert(categories)
    .values({
      name: "Ghazal",
      slug: "ghazal",
      description: "A poetic form consisting of independent couplets.",
      parentId: null,
      sortOrder: 2,
      status: "active",
    })
    .returning();

  const [freeVerse] = await db
    .insert(categories)
    .values({
      name: "Free Verse",
      slug: "free-verse",
      description: "Poetry without a fixed meter or rhyme scheme.",
      parentId: null,
      sortOrder: 3,
      status: "active",
    })
    .returning();

  console.log("✓ Categories added");

  // ------------------------------------------------
  // TAGS
  // ------------------------------------------------

  const tagValues = [
    {
      name: "Love",
      slug: "love",
      description: "Poetry about love and affection.",
    },
    {
      name: "Nature",
      slug: "nature",
      description: "Poetry inspired by nature.",
    },
    {
      name: "Beauty",
      slug: "beauty",
      description: "Poetry exploring beauty.",
    },
    {
      name: "Life",
      slug: "life",
      description: "Poetry about life and existence.",
    },
    {
      name: "Philosophy",
      slug: "philosophy",
      description: "Poetry exploring philosophical ideas.",
    },
  ];

  await db.insert(tags).values(tagValues);

  console.log("✓ Tags added");

  // ------------------------------------------------
  // POEMS
  // ------------------------------------------------

  const [poem1] = await db
    .insert(poems)
    .values({
      title: "Sonnet 18",
      slug: "sonnet-18",

      content:
        "Shall I compare thee to a summer's day?\n" +
        "Thou art more lovely and more temperate.",

      description:
        "One of William Shakespeare's most famous sonnets.",

      poetId: shakespeare.id,
      categoryId: sonnet.id,

      language: "en",
      script: "Latin",

      status: "published",

      contentVersion: 1,

      coverImage: null,
    })
    .returning();

  const [poem2] = await db
    .insert(poems)
    .values({
      title: "Where the Mind Is Without Fear",
      slug: "where-the-mind-is-without-fear",

      content:
        "Where the mind is without fear and the head is held high,\n" +
        "Where knowledge is free.",

      description:
        "A famous poem by Rabindranath Tagore.",

      poetId: tagore.id,
      categoryId: freeVerse.id,

      language: "bn",
      script: "Bengali",

      status: "published",

      contentVersion: 1,

      coverImage: null,
    })
    .returning();

  console.log("✓ Poems added");

  // ------------------------------------------------
  // CONTRIBUTORS
  // ------------------------------------------------

  await db.insert(contributors).values({
    name: "Prasang Editorial Team",
    slug: "prasang-editorial-team",

    bio: "The editorial team of Prasang.",

    photo: null,

    role: "editor",

    language: "en",

    email: null,

    status: "active",
  });

  console.log("✓ Contributor added");

  // ------------------------------------------------
  // AI TRANSLATION
  // ------------------------------------------------

  await db.insert(aiTranslations).values({
    poemId: poem1.id,

    sourceLanguage: "en",

    targetLanguage: "hi",

    translation:
      "क्या मैं तुम्हारी तुलना गर्मी के एक दिन से करूँ?\n" +
      "तुम उससे अधिक सुंदर और अधिक संतुलित हो।",

    model: "test-model",

    status: "approved",

    attempts: 1,

    poemVersion: 1,

    error: null,

    generatedAt: new Date(),

    approvedAt: new Date(),
  });

  console.log("✓ AI translation added");

  console.log("");
  console.log("================================");
  console.log("✅ Seed completed successfully!");
  console.log("================================");
} catch (error) {
  console.error("");
  console.error("❌ Seed failed:");
  console.error(error);

  process.exitCode = 1;
} finally {
  sqlite.close();
}