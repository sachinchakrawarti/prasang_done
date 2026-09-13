// server/controllers/poems.controller.js

import {
  eq,
  and,
  or,
  ne,
  notInArray,
  like,
  desc,
  asc,
  count,
} from "drizzle-orm";

import { db } from "../config/database.js";

import {
  poems,
  poets,
  categories,
} from "../../db/schema/index.js";

import { slugify, makeUniqueSlug } from "../utils/slugify.js";

// --------------------------------------------------
// GET ALL POEMS
// GET /api/poems
//
// Optional:
// ?page=1
// ?limit=20
// ?search=love
// ?language=en
// ?status=published
// ?poetId=1
// ?categoryId=1
// --------------------------------------------------

export async function getAllPoems(req, res) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );
    const offset = (page - 1) * limit;

    const { search, language, status, poetId, categoryId } = req.query;

    const conditions = [];

    if (search?.trim()) {
      const searchValue = `%${search.trim()}%`;

      conditions.push(
        or(
          like(poems.title, searchValue),
          like(poems.content, searchValue),
          like(poems.description, searchValue)
        )
      );
    }

    if (language?.trim()) {
      conditions.push(eq(poems.language, language.trim()));
    }

    if (status?.trim()) {
      conditions.push(eq(poems.status, status.trim()));
    }

    if (poetId) {
      const id = Number(poetId);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid poetId",
        });
      }

      conditions.push(eq(poems.poetId, id));
    }

    if (categoryId) {
      const id = Number(categoryId);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid categoryId",
        });
      }

      conditions.push(eq(poems.categoryId, id));
    }

    const whereClause =
      conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select({
        id: poems.id,
        title: poems.title,
        slug: poems.slug,
        content: poems.content,
        description: poems.description,
        language: poems.language,
        script: poems.script,
        status: poems.status,
        contentVersion: poems.contentVersion,
        coverImage: poems.coverImage,
        createdAt: poems.createdAt,
        updatedAt: poems.updatedAt,

        poet: {
          id: poets.id,
          name: poets.name,
          slug: poets.slug,
        },

        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(poems)
      .leftJoin(poets, eq(poems.poetId, poets.id))
      .leftJoin(categories, eq(poems.categoryId, categories.id))
      .where(whereClause)
      .orderBy(desc(poems.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({
        count: count(),
      })
      .from(poems)
      .where(whereClause);

    const total = Number(totalResult[0]?.count || 0);

    res.json({
      success: true,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },

      data,
    });
  } catch (error) {
    console.error("Get poems error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch poems",
    });
  }
}

// --------------------------------------------------
// GET POEM BY ID
// GET /api/poems/:id
// --------------------------------------------------

export async function getPoemById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid poem ID",
      });
    }

    const [poem] = await db
      .select({
        id: poems.id,
        title: poems.title,
        slug: poems.slug,
        content: poems.content,
        description: poems.description,
        language: poems.language,
        script: poems.script,
        status: poems.status,
        contentVersion: poems.contentVersion,
        coverImage: poems.coverImage,
        createdAt: poems.createdAt,
        updatedAt: poems.updatedAt,

        poet: {
          id: poets.id,
          name: poets.name,
          slug: poets.slug,
        },

        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(poems)
      .leftJoin(poets, eq(poems.poetId, poets.id))
      .leftJoin(categories, eq(poems.categoryId, categories.id))
      .where(eq(poems.id, id))
      .limit(1);

    if (!poem) {
      return res.status(404).json({
        success: false,
        message: "Poem not found",
      });
    }

    res.json({
      success: true,
      data: poem,
    });
  } catch (error) {
    console.error("Get poem error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch poem",
    });
  }
}

// --------------------------------------------------
// GET POEM BY SLUG
// GET /api/poems/slug/:slug
// --------------------------------------------------

export async function getPoemBySlug(req, res) {
  try {
    const rawSlug = req.params.slug?.trim();

    if (!rawSlug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    // Accept both the ASCII slug ("rshmirthi") and legacy Devanagari slugs.
    // Normalise first, then fall back to the raw value.
    const normalized = slugify(rawSlug);

    const candidates = Array.from(
      new Set([rawSlug, normalized].filter(Boolean))
    );

    let poem = null;

    for (const candidate of candidates) {
      const [row] = await db
        .select({
          id: poems.id,
          title: poems.title,
          slug: poems.slug,
          content: poems.content,
          description: poems.description,
          language: poems.language,
          script: poems.script,
          status: poems.status,
          contentVersion: poems.contentVersion,
          coverImage: poems.coverImage,
          createdAt: poems.createdAt,
          updatedAt: poems.updatedAt,

          poet: {
            id: poets.id,
            name: poets.name,
            slug: poets.slug,
          },

          category: {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          },
        })
        .from(poems)
        .leftJoin(poets, eq(poems.poetId, poets.id))
        .leftJoin(categories, eq(poems.categoryId, categories.id))
        .where(eq(poems.slug, candidate))
        .limit(1);

      if (row) {
        poem = row;
        break;
      }
    }

    if (!poem) {
      return res.status(404).json({
        success: false,
        message: "Poem not found",
      });
    }

    res.json({
      success: true,
      data: poem,
    });
  } catch (error) {
    console.error("Get poem by slug error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch poem",
    });
  }
}

// --------------------------------------------------
// GET RELATED POEMS
// GET /api/poems/related/:id
//
// Returns up to 3 other poems:
//   1. Same poet (excluding the current poem)
//   2. Topped up with same category
// --------------------------------------------------

export async function getRelatedPoems(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid poem ID",
      });
    }

    // Load source poem to know poet + category
    const [source] = await db
      .select({
        id: poems.id,
        poetId: poems.poetId,
        categoryId: poems.categoryId,
      })
      .from(poems)
      .where(eq(poems.id, id))
      .limit(1);

    if (!source) {
      return res.status(404).json({
        success: false,
        message: "Poem not found",
      });
    }

    const baseColumns = {
      id: poems.id,
      title: poems.title,
      slug: poems.slug,
      content: poems.content,
      description: poems.description,
      language: poems.language,
      script: poems.script,
      status: poems.status,
      contentVersion: poems.contentVersion,
      coverImage: poems.coverImage,
      createdAt: poems.createdAt,
      updatedAt: poems.updatedAt,

      poet: {
        id: poets.id,
        name: poets.name,
        slug: poets.slug,
      },

      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
    };

    // 1) Same poet first
    let results = [];

    if (source.poetId) {
      results = await db
        .select(baseColumns)
        .from(poems)
        .leftJoin(poets, eq(poems.poetId, poets.id))
        .leftJoin(categories, eq(poems.categoryId, categories.id))
        .where(
          and(eq(poems.poetId, source.poetId), ne(poems.id, id))
        )
        .orderBy(desc(poems.createdAt))
        .limit(3);
    }

    // 2) Top up with same category if needed
    if (results.length < 3 && source.categoryId) {
      const excludeIds = [id, ...results.map((p) => p.id)];

      const sameCategory = await db
        .select(baseColumns)
        .from(poems)
        .leftJoin(poets, eq(poems.poetId, poets.id))
        .leftJoin(categories, eq(poems.categoryId, categories.id))
        .where(
          and(
            eq(poems.categoryId, source.categoryId),
            notInArray(poems.id, excludeIds)
          )
        )
        .orderBy(desc(poems.createdAt))
        .limit(3 - results.length);

      results = [...results, ...sameCategory];
    }

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Get related poems error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch related poems",
    });
  }
}

// --------------------------------------------------
// CREATE POEM
// POST /api/poems
// --------------------------------------------------

export async function createPoem(req, res) {
  try {
    const {
      title,
      content,
      description,
      poetId,
      categoryId,
      language,
      script,
      status,
      contentVersion,
      coverImage,
    } = req.body;

    // Slug is always generated from the title.
    if (!title || !content || !poetId || !categoryId || !language) {
      return res.status(400).json({
        success: false,
        message:
          "title, content, poetId, categoryId and language are required",
      });
    }

    const parsedPoetId = Number(poetId);
    const parsedCategoryId = Number(categoryId);

    if (!Number.isInteger(parsedPoetId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid poetId",
      });
    }

    if (!Number.isInteger(parsedCategoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid categoryId",
      });
    }

    // Check poet
    const [poet] = await db
      .select({ id: poets.id })
      .from(poets)
      .where(eq(poets.id, parsedPoetId))
      .limit(1);

    if (!poet) {
      return res.status(404).json({
        success: false,
        message: "Poet not found",
      });
    }

    // Check category
    const [category] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, parsedCategoryId))
      .limit(1);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Generate unique slug from title
    const generatedSlug = await makeUniqueSlug(
      db,
      poems,
      title.trim()
    );

    const [created] = await db
      .insert(poems)
      .values({
        title: title.trim(),
        slug: generatedSlug,
        content: content.trim(),
        description: description?.trim() || null,
        poetId: parsedPoetId,
        categoryId: parsedCategoryId,
        language: language.trim().toLowerCase(),
        script: script?.trim() || null,
        status: status?.trim() || "draft",
        contentVersion:
          contentVersion !== undefined ? Number(contentVersion) : 1,
        coverImage: coverImage?.trim() || null,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Poem created successfully",
      data: created,
    });
  } catch (error) {
    console.error("Create poem error:", error);

    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        success: false,
        message: "Poem slug already exists",
      });
    }

    if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
      return res.status(400).json({
        success: false,
        message: "Invalid poetId or categoryId",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create poem",
    });
  }
}

// --------------------------------------------------
// UPDATE POEM
// PUT /api/poems/:id
// --------------------------------------------------

export async function updatePoem(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid poem ID",
      });
    }

    const {
      title,
      content,
      description,
      poetId,
      categoryId,
      language,
      script,
      status,
      coverImage,
    } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    // ---------- BASIC FIELDS ----------

    if (title !== undefined) {
      updateData.title = title.trim();

      // Regenerate slug whenever the title changes.
      // The current poem is excluded so it doesn't collide with itself.
      updateData.slug = await makeUniqueSlug(
        db,
        poems,
        title.trim(),
        id
      );
    }

    if (content !== undefined) {
      updateData.content = content.trim();
      updateData.contentVersion = await getNextContentVersion(id);
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (language !== undefined) {
      updateData.language = language.trim().toLowerCase();
    }

    if (script !== undefined) {
      updateData.script = script?.trim() || null;
    }

    if (status !== undefined) {
      updateData.status = status.trim();
    }

    if (coverImage !== undefined) {
      updateData.coverImage = coverImage?.trim() || null;
    }

    // ---------- POET ----------

    if (poetId !== undefined) {
      const parsedPoetId = Number(poetId);

      if (!Number.isInteger(parsedPoetId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid poetId",
        });
      }

      const [poet] = await db
        .select({ id: poets.id })
        .from(poets)
        .where(eq(poets.id, parsedPoetId))
        .limit(1);

      if (!poet) {
        return res.status(404).json({
          success: false,
          message: "Poet not found",
        });
      }

      updateData.poetId = parsedPoetId;
    }

    // ---------- CATEGORY ----------

    if (categoryId !== undefined) {
      const parsedCategoryId = Number(categoryId);

      if (!Number.isInteger(parsedCategoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid categoryId",
        });
      }

      const [category] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, parsedCategoryId))
        .limit(1);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      updateData.categoryId = parsedCategoryId;
    }

    // ---------- UPDATE ----------

    const [updated] = await db
      .update(poems)
      .set(updateData)
      .where(eq(poems.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Poem not found",
      });
    }

    res.json({
      success: true,
      message: "Poem updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update poem error:", error);

    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        success: false,
        message: "Poem slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update poem",
    });
  }
}

// --------------------------------------------------
// DELETE POEM
// DELETE /api/poems/:id
// --------------------------------------------------

export async function deletePoem(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid poem ID",
      });
    }

    const [deleted] = await db
      .delete(poems)
      .where(eq(poems.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Poem not found",
      });
    }

    res.json({
      success: true,
      message: "Poem deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete poem error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete poem",
    });
  }
}

// --------------------------------------------------
// GET NEXT CONTENT VERSION
// --------------------------------------------------

async function getNextContentVersion(poemId) {
  const [poem] = await db
    .select({ contentVersion: poems.contentVersion })
    .from(poems)
    .where(eq(poems.id, poemId))
    .limit(1);

  if (!poem) return 1;

  return Number(poem.contentVersion || 1) + 1;
}