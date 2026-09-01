import { eq, and } from "drizzle-orm";

import { db } from "../config/database.js";

import {
  poems,
  poets,
  tags,
  categories,
} from "../../db/schema/index.js";

// ==================================================
// SLUG HELPER
// ==================================================

function createSlug(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ==================================================
// FIND OR CREATE POET
// ==================================================

export async function findOrCreatePoet({
  name,
  slug,
  bio = null,
  description = null,
  birthDate = null,
  deathDate = null,
  birthPlace = null,
  nationality = null,
  language = null,
  website = null,
  image = null,
}) {
  if (!name?.trim()) {
    throw new Error(
      "Poet name is required"
    );
  }

  const poetSlug =
    slug?.trim() ||
    createSlug(name);

  // ----------------------------------------------
  // FIND
  // ----------------------------------------------

  const [existing] = await db
    .select()
    .from(poets)
    .where(eq(poets.slug, poetSlug))
    .limit(1);

  if (existing) {
    return {
      data: existing,
      created: false,
    };
  }

  // ----------------------------------------------
  // CREATE
  // ----------------------------------------------

  const [created] = await db
    .insert(poets)
    .values({
      name: name.trim(),

      slug: poetSlug,

      bio: bio?.trim() || null,

      description:
        description?.trim() || null,

      birthDate:
        birthDate?.trim() || null,

      deathDate:
        deathDate?.trim() || null,

      birthPlace:
        birthPlace?.trim() || null,

      nationality:
        nationality?.trim() || null,

      language:
        language
          ?.trim()
          .toLowerCase() || null,

      website:
        website?.trim() || null,

      image:
        image?.trim() || null,

      status: "active",
    })
    .returning();

  return {
    data: created,
    created: true,
  };
}

// ==================================================
// FIND OR CREATE CATEGORY
// ==================================================

export async function findOrCreateCategory({
  name,
  slug,
  description = null,
  parentId = null,
}) {
  if (!name?.trim()) {
    throw new Error(
      "Category name is required"
    );
  }

  const categorySlug =
    slug?.trim() ||
    createSlug(name);

  // ----------------------------------------------
  // FIND
  // ----------------------------------------------

  const [existing] = await db
    .select()
    .from(categories)
    .where(
      eq(
        categories.slug,
        categorySlug
      )
    )
    .limit(1);

  if (existing) {
    return {
      data: existing,
      created: false,
    };
  }

  // ----------------------------------------------
  // CREATE
  // ----------------------------------------------

  const [created] = await db
    .insert(categories)
    .values({
      name: name.trim(),

      slug: categorySlug,

      description:
        description?.trim() || null,

      parentId:
        parentId || null,

      status: "active",
    })
    .returning();

  return {
    data: created,
    created: true,
  };
}

// ==================================================
// FIND OR CREATE TAG
// ==================================================

export async function findOrCreateTag({
  name,
  slug,
  description = null,
}) {
  if (!name?.trim()) {
    throw new Error(
      "Tag name is required"
    );
  }

  const tagSlug =
    slug?.trim() ||
    createSlug(name);

  // ----------------------------------------------
  // FIND
  // ----------------------------------------------

  const [existing] = await db
    .select()
    .from(tags)
    .where(
      eq(
        tags.slug,
        tagSlug
      )
    )
    .limit(1);

  if (existing) {
    return {
      data: existing,
      created: false,
    };
  }

  // ----------------------------------------------
  // CREATE
  // ----------------------------------------------

  const [created] = await db
    .insert(tags)
    .values({
      name: name.trim(),

      slug: tagSlug,

      description:
        description?.trim() || null,
    })
    .returning();

  return {
    data: created,
    created: true,
  };
}

// ==================================================
// IMPORT POEM
// ==================================================

export async function importPoem({
  title,
  slug,
  content,
  description = null,

  poetId,

  categoryId,

  language = "en",

  script = null,

  status = "published",

  contentVersion = 1,

  coverImage = null,
}) {
  // ----------------------------------------------
  // VALIDATION
  // ----------------------------------------------

  if (!title?.trim()) {
    throw new Error(
      "Poem title is required"
    );
  }

  if (!content?.trim()) {
    throw new Error(
      "Poem content is required"
    );
  }

  if (!poetId) {
    throw new Error(
      "poetId is required"
    );
  }

  if (!categoryId) {
    throw new Error(
      "categoryId is required"
    );
  }

  const poemSlug =
    slug?.trim() ||
    createSlug(title);

  // ----------------------------------------------
  // CHECK EXISTING
  // ----------------------------------------------

  const [existing] = await db
    .select()
    .from(poems)
    .where(
      eq(
        poems.slug,
        poemSlug
      )
    )
    .limit(1);

  if (existing) {
    return {
      data: existing,
      created: false,
      duplicate: true,
    };
  }

  // ----------------------------------------------
  // INSERT
  // ----------------------------------------------

  const [created] = await db
    .insert(poems)
    .values({
      title: title.trim(),

      slug: poemSlug,

      content: content.trim(),

      description:
        description?.trim() || null,

      poetId: Number(poetId),

      categoryId:
        Number(categoryId),

      language:
        language
          .trim()
          .toLowerCase(),

      script:
        script?.trim() || null,

      status,

      contentVersion:
        Number(contentVersion) || 1,

      coverImage:
        coverImage?.trim() || null,
    })
    .returning();

  return {
    data: created,
    created: true,
    duplicate: false,
  };
}

// ==================================================
// IMPORT COMPLETE POEM
//
// Creates:
//   Poet
//   Category
//   Tags
//   Poem
// ==================================================

export async function importCompletePoem({
  poem,
  poet,
  category,
  tagList = [],
}) {
  // ----------------------------------------------
  // VALIDATION
  // ----------------------------------------------

  if (!poem) {
    throw new Error(
      "Poem data is required"
    );
  }

  if (!poet) {
    throw new Error(
      "Poet data is required"
    );
  }

  if (!category) {
    throw new Error(
      "Category data is required"
    );
  }

  // ----------------------------------------------
  // POET
  // ----------------------------------------------

  const poetResult =
    await findOrCreatePoet(poet);

  // ----------------------------------------------
  // CATEGORY
  // ----------------------------------------------

  const categoryResult =
    await findOrCreateCategory(
      category
    );

  // ----------------------------------------------
  // TAGS
  // ----------------------------------------------

  const tagsCreated = [];

  for (const tag of tagList) {
    const tagResult =
      await findOrCreateTag(
        typeof tag === "string"
          ? {
              name: tag,
            }
          : tag
      );

    tagsCreated.push(
      tagResult
    );
  }

  // ----------------------------------------------
  // POEM
  // ----------------------------------------------

  const poemResult =
    await importPoem({
      ...poem,

      poetId:
        poetResult.data.id,

      categoryId:
        categoryResult.data.id,
    });

  return {
    poem: poemResult,

    poet: poetResult,

    category: categoryResult,

    tags: tagsCreated,
  };
}

// ==================================================
// IMPORT MANY POEMS
// ==================================================

export async function importPoems(
  items = []
) {
  if (!Array.isArray(items)) {
    throw new Error(
      "Import data must be an array"
    );
  }

  const results = [];

  for (const item of items) {
    try {
      const result =
        await importCompletePoem(item);

      results.push({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error(
        "Poem import failed:",
        error
      );

      results.push({
        success: false,
        error: error.message,
      });
    }
  }

  return {
    total: items.length,

    successful:
      results.filter(
        (item) => item.success
      ).length,

    failed:
      results.filter(
        (item) => !item.success
      ).length,

    results,
  };
}