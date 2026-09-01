import { eq, and, or, like, desc, asc, count } from "drizzle-orm";

import { db } from "../config/database.js";

import {
  poets,
  poems,
} from "../../db/schema/index.js";

// --------------------------------------------------
// GET ALL POETS
// GET /api/poets
//
// Optional:
// ?page=1
// ?limit=20
// ?search=shakespeare
// ?language=en
// ?status=active
// --------------------------------------------------

export async function getAllPoets(req, res) {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 20,
        1
      ),
      100
    );

    const offset = (page - 1) * limit;

    const {
      search,
      language,
      status,
    } = req.query;

    const conditions = [];

    // Search
    if (search?.trim()) {
      const searchValue = `%${search.trim()}%`;

      conditions.push(
        or(
          like(poets.name, searchValue),
          like(poets.bio, searchValue),
          like(poets.description, searchValue)
        )
      );
    }

    // Language
    if (language?.trim()) {
      conditions.push(
        eq(
          poets.language,
          language.trim().toLowerCase()
        )
      );
    }

    // Status
    if (status?.trim()) {
      conditions.push(
        eq(
          poets.status,
          status.trim()
        )
      );
    }

    const whereClause =
      conditions.length > 0
        ? and(...conditions)
        : undefined;

    const data = await db
      .select()
      .from(poets)
      .where(whereClause)
      .orderBy(asc(poets.name))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({
        count: count(),
      })
      .from(poets)
      .where(whereClause);

    const total = Number(
      totalResult[0]?.count || 0
    );

    res.json({
      success: true,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
        hasNextPage:
          page <
          Math.ceil(total / limit),
        hasPreviousPage:
          page > 1,
      },

      data,
    });
  } catch (error) {
    console.error(
      "Get poets error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch poets",
    });
  }
}

// --------------------------------------------------
// GET POET BY ID
// GET /api/poets/:id
// --------------------------------------------------

export async function getPoetById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid poet ID",
      });
    }

    const [poet] = await db
      .select()
      .from(poets)
      .where(eq(poets.id, id))
      .limit(1);

    if (!poet) {
      return res.status(404).json({
        success: false,
        message: "Poet not found",
      });
    }

    res.json({
      success: true,
      data: poet,
    });
  } catch (error) {
    console.error(
      "Get poet error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch poet",
    });
  }
}

// --------------------------------------------------
// GET POET BY SLUG
// GET /api/poets/slug/:slug
// --------------------------------------------------

export async function getPoetBySlug(req, res) {
  try {
    const slug = req.params.slug?.trim();

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const [poet] = await db
      .select()
      .from(poets)
      .where(eq(poets.slug, slug))
      .limit(1);

    if (!poet) {
      return res.status(404).json({
        success: false,
        message: "Poet not found",
      });
    }

    res.json({
      success: true,
      data: poet,
    });
  } catch (error) {
    console.error(
      "Get poet by slug error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch poet",
    });
  }
}

// --------------------------------------------------
// GET POEMS BY POET
// GET /api/poets/:id/poems
// --------------------------------------------------

export async function getPoetPoems(req, res) {
  try {
    const poetId = Number(
      req.params.id
    );

    if (!Number.isInteger(poetId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid poet ID",
      });
    }

    // Check poet
    const [poet] = await db
      .select({
        id: poets.id,
        name: poets.name,
      })
      .from(poets)
      .where(eq(poets.id, poetId))
      .limit(1);

    if (!poet) {
      return res.status(404).json({
        success: false,
        message: "Poet not found",
      });
    }

    const result = await db
      .select()
      .from(poems)
      .where(eq(poems.poetId, poetId))
      .orderBy(desc(poems.createdAt));

    res.json({
      success: true,

      poet,

      count: result.length,

      data: result,
    });
  } catch (error) {
    console.error(
      "Get poet poems error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch poet poems",
    });
  }
}

// --------------------------------------------------
// CREATE POET
// POST /api/poets
// --------------------------------------------------

export async function createPoet(req, res) {
  try {
    const {
      name,
      slug,
      bio,
      description,
      birthDate,
      deathDate,
      birthPlace,
      nationality,
      language,
      website,
      image,
      status,
    } = req.body;

    // ----------------------------------------------
    // REQUIRED
    // ----------------------------------------------

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message:
          "name and slug are required",
      });
    }

    // ----------------------------------------------
    // INSERT
    // ----------------------------------------------

    const [created] = await db
      .insert(poets)
      .values({
        name: name.trim(),

        slug: slug
          .trim()
          .toLowerCase(),

        bio:
          bio?.trim() || null,

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

        status:
          status?.trim() || "active",
      })
      .returning();

    res.status(201).json({
      success: true,
      message:
        "Poet created successfully",
      data: created,
    });
  } catch (error) {
    console.error(
      "Create poet error:",
      error
    );

    if (
      error.code ===
      "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Poet slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to create poet",
    });
  }
}

// --------------------------------------------------
// UPDATE POET
// PUT /api/poets/:id
// --------------------------------------------------

export async function updatePoet(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid poet ID",
      });
    }

    const {
      name,
      slug,
      bio,
      description,
      birthDate,
      deathDate,
      birthPlace,
      nationality,
      language,
      website,
      image,
      status,
    } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    // ----------------------------------------------
    // FIELDS
    // ----------------------------------------------

    if (name !== undefined) {
      updateData.name =
        name.trim();
    }

    if (slug !== undefined) {
      updateData.slug = slug
        .trim()
        .toLowerCase();
    }

    if (bio !== undefined) {
      updateData.bio =
        bio?.trim() || null;
    }

    if (description !== undefined) {
      updateData.description =
        description?.trim() || null;
    }

    if (birthDate !== undefined) {
      updateData.birthDate =
        birthDate?.trim() || null;
    }

    if (deathDate !== undefined) {
      updateData.deathDate =
        deathDate?.trim() || null;
    }

    if (birthPlace !== undefined) {
      updateData.birthPlace =
        birthPlace?.trim() || null;
    }

    if (nationality !== undefined) {
      updateData.nationality =
        nationality?.trim() || null;
    }

    if (language !== undefined) {
      updateData.language =
        language
          ?.trim()
          .toLowerCase() || null;
    }

    if (website !== undefined) {
      updateData.website =
        website?.trim() || null;
    }

    if (image !== undefined) {
      updateData.image =
        image?.trim() || null;
    }

    if (status !== undefined) {
      updateData.status =
        status.trim();
    }

    // ----------------------------------------------
    // UPDATE
    // ----------------------------------------------

    const [updated] = await db
      .update(poets)
      .set(updateData)
      .where(eq(poets.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Poet not found",
      });
    }

    res.json({
      success: true,
      message:
        "Poet updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(
      "Update poet error:",
      error
    );

    if (
      error.code ===
      "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Poet slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to update poet",
    });
  }
}

// --------------------------------------------------
// DELETE POET
// DELETE /api/poets/:id
// --------------------------------------------------

export async function deletePoet(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid poet ID",
      });
    }

    const [deleted] = await db
      .delete(poets)
      .where(eq(poets.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Poet not found",
      });
    }

    res.json({
      success: true,
      message:
        "Poet deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error(
      "Delete poet error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete poet",
    });
  }
}