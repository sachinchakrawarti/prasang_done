import { eq, asc, like, or } from "drizzle-orm";

import { db } from "../config/database.js";

import { tags } from "../../db/schema/index.js";

// --------------------------------------------------
// GET ALL TAGS
// GET /api/tags
//
// Optional:
// ?search=love
// --------------------------------------------------

export async function getAllTags(req, res) {
  try {
    const { search } = req.query;

    let query = db
      .select()
      .from(tags);

    if (search?.trim()) {
      const searchValue = `%${search.trim()}%`;

      query = query.where(
        or(
          like(tags.name, searchValue),
          like(tags.slug, searchValue)
        )
      );
    }

    const result = await query.orderBy(
      asc(tags.name)
    );

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error(
      "Get tags error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch tags",
    });
  }
}

// --------------------------------------------------
// GET TAG BY ID
// GET /api/tags/:id
// --------------------------------------------------

export async function getTagById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tag ID",
      });
    }

    const [tag] = await db
      .select()
      .from(tags)
      .where(eq(tags.id, id))
      .limit(1);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error(
      "Get tag error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch tag",
    });
  }
}

// --------------------------------------------------
// GET TAG BY SLUG
// GET /api/tags/slug/:slug
// --------------------------------------------------

export async function getTagBySlug(req, res) {
  try {
    const slug = req.params.slug?.trim();

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const [tag] = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, slug))
      .limit(1);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error(
      "Get tag by slug error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch tag",
    });
  }
}

// --------------------------------------------------
// CREATE TAG
// POST /api/tags
// --------------------------------------------------

export async function createTag(req, res) {
  try {
    const {
      name,
      slug,
      description,
    } = req.body;

    // ----------------------------------------------
    // REQUIRED
    // ----------------------------------------------

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is required",
      });
    }

    // ----------------------------------------------
    // CREATE SLUG AUTOMATICALLY
    // ----------------------------------------------

    const finalSlug =
      slug?.trim() ||
      createSlug(name);

    // ----------------------------------------------
    // INSERT
    // ----------------------------------------------

    const [created] = await db
      .insert(tags)
      .values({
        name: name.trim(),

        slug: finalSlug
          .toLowerCase(),

        description:
          description?.trim() || null,
      })
      .returning();

    res.status(201).json({
      success: true,
      message:
        "Tag created successfully",
      data: created,
    });
  } catch (error) {
    console.error(
      "Create tag error:",
      error
    );

    if (
      error.code ===
      "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Tag name or slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to create tag",
    });
  }
}

// --------------------------------------------------
// UPDATE TAG
// PUT /api/tags/:id
// --------------------------------------------------

export async function updateTag(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tag ID",
      });
    }

    const {
      name,
      slug,
      description,
    } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      updateData.name =
        name.trim();
    }

    if (slug !== undefined) {
      updateData.slug =
        slug.trim().toLowerCase();
    }

    if (description !== undefined) {
      updateData.description =
        description?.trim() || null;
    }

    const [updated] = await db
      .update(tags)
      .set(updateData)
      .where(eq(tags.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.json({
      success: true,
      message:
        "Tag updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(
      "Update tag error:",
      error
    );

    if (
      error.code ===
      "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Tag name or slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to update tag",
    });
  }
}

// --------------------------------------------------
// DELETE TAG
// DELETE /api/tags/:id
// --------------------------------------------------

export async function deleteTag(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tag ID",
      });
    }

    const [deleted] = await db
      .delete(tags)
      .where(eq(tags.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.json({
      success: true,
      message:
        "Tag deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error(
      "Delete tag error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete tag",
    });
  }
}

// --------------------------------------------------
// CREATE SLUG
// --------------------------------------------------

function createSlug(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}