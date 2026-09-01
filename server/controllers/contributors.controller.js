import { eq, asc } from "drizzle-orm";

import { db } from "../config/database.js";

import { contributors } from "../../db/schema/index.js";

// --------------------------------------------------
// GET ALL CONTRIBUTORS
// GET /api/contributors
// --------------------------------------------------

export async function getAllContributors(req, res) {
  try {
    const result = await db
      .select()
      .from(contributors)
      .orderBy(asc(contributors.name));

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Get contributors error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contributors",
    });
  }
}

// --------------------------------------------------
// GET CONTRIBUTOR BY ID
// GET /api/contributors/:id
// --------------------------------------------------

export async function getContributorById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contributor ID",
      });
    }

    const [contributor] = await db
      .select()
      .from(contributors)
      .where(eq(contributors.id, id))
      .limit(1);

    if (!contributor) {
      return res.status(404).json({
        success: false,
        message: "Contributor not found",
      });
    }

    res.json({
      success: true,
      data: contributor,
    });
  } catch (error) {
    console.error("Get contributor error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contributor",
    });
  }
}

// --------------------------------------------------
// GET CONTRIBUTORS BY ROLE
// GET /api/contributors/role/:role
// --------------------------------------------------

export async function getContributorsByRole(req, res) {
  try {
    const role = req.params.role?.trim();

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const result = await db
      .select()
      .from(contributors)
      .where(eq(contributors.role, role))
      .orderBy(asc(contributors.name));

    res.json({
      success: true,
      role,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error(
      "Get contributors by role error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch contributors",
    });
  }
}

// --------------------------------------------------
// CREATE CONTRIBUTOR
// POST /api/contributors
// --------------------------------------------------

export async function createContributor(req, res) {
  try {
    const {
      name,
      slug,
      bio,
      photo,
      role,
      language,
      email,
      status,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "name and slug are required",
      });
    }

    const [created] = await db
      .insert(contributors)
      .values({
        name: name.trim(),

        slug: slug
          .trim()
          .toLowerCase(),

        bio:
          bio?.trim() || null,

        photo:
          photo?.trim() || null,

        role:
          role?.trim() || null,

        language:
          language?.trim() || null,

        email:
          email?.trim() || null,

        status:
          status?.trim() || "active",
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Contributor created successfully",
      data: created,
    });
  } catch (error) {
    console.error(
      "Create contributor error:",
      error
    );

    if (
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return res.status(409).json({
        success: false,
        message: "Contributor slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create contributor",
    });
  }
}

// --------------------------------------------------
// UPDATE CONTRIBUTOR
// PUT /api/contributors/:id
// --------------------------------------------------

export async function updateContributor(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contributor ID",
      });
    }

    const {
      name,
      slug,
      bio,
      photo,
      role,
      language,
      email,
      status,
    } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      updateData.name = name.trim();
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

    if (photo !== undefined) {
      updateData.photo =
        photo?.trim() || null;
    }

    if (role !== undefined) {
      updateData.role =
        role?.trim() || null;
    }

    if (language !== undefined) {
      updateData.language =
        language?.trim() || null;
    }

    if (email !== undefined) {
      updateData.email =
        email?.trim() || null;
    }

    if (status !== undefined) {
      updateData.status =
        status.trim();
    }

    const [updated] = await db
      .update(contributors)
      .set(updateData)
      .where(eq(contributors.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Contributor not found",
      });
    }

    res.json({
      success: true,
      message: "Contributor updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(
      "Update contributor error:",
      error
    );

    if (
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return res.status(409).json({
        success: false,
        message: "Contributor slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update contributor",
    });
  }
}

// --------------------------------------------------
// DELETE CONTRIBUTOR
// DELETE /api/contributors/:id
// --------------------------------------------------

export async function deleteContributor(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contributor ID",
      });
    }

    const [deleted] = await db
      .delete(contributors)
      .where(eq(contributors.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Contributor not found",
      });
    }

    res.json({
      success: true,
      message: "Contributor deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error(
      "Delete contributor error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete contributor",
    });
  }
}