import { eq, asc } from "drizzle-orm";

import { db } from "../config/database.js";

import { categories } from "../../db/schema/index.js";

// --------------------------------------------------
// GET ALL CATEGORIES
// GET /api/categories
// --------------------------------------------------

export async function getAllCategories(req, res) {
  try {
    const result = await db
      .select()
      .from(categories)
      .orderBy(
        asc(categories.sortOrder),
        asc(categories.name)
      );

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
}

// --------------------------------------------------
// GET CATEGORY BY ID
// GET /api/categories/:id
// --------------------------------------------------

export async function getCategoryById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
}

// --------------------------------------------------
// GET CATEGORIES BY PARENT
// GET /api/categories/parent/:parentId
// --------------------------------------------------

export async function getChildCategories(req, res) {
  try {
    const parentId = Number(req.params.parentId);

    if (!Number.isInteger(parentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent category ID",
      });
    }

    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.parentId, parentId))
      .orderBy(
        asc(categories.sortOrder),
        asc(categories.name)
      );

    res.json({
      success: true,
      parentId,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error(
      "Get child categories error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch child categories",
    });
  }
}

// --------------------------------------------------
// CREATE CATEGORY
// POST /api/categories
// --------------------------------------------------

export async function createCategory(req, res) {
  try {
    const {
      name,
      slug,
      description,
      parentId,
      sortOrder,
      status,
    } = req.body;

    // Required fields
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "name and slug are required",
      });
    }

    const [created] = await db
      .insert(categories)
      .values({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),

        description:
          description?.trim() || null,

        parentId:
          parentId !== undefined &&
          parentId !== null
            ? Number(parentId)
            : null,

        sortOrder:
          sortOrder !== undefined
            ? Number(sortOrder)
            : 0,

        status:
          status?.trim() || "active",
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: created,
    });
  } catch (error) {
    console.error("Create category error:", error);

    if (
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return res.status(409).json({
        success: false,
        message: "Category slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
}

// --------------------------------------------------
// UPDATE CATEGORY
// PUT /api/categories/:id
// --------------------------------------------------

export async function updateCategory(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const {
      name,
      slug,
      description,
      parentId,
      sortOrder,
      status,
    } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (slug !== undefined) {
      updateData.slug = slug.trim().toLowerCase();
    }

    if (description !== undefined) {
      updateData.description =
        description?.trim() || null;
    }

    if (parentId !== undefined) {
      updateData.parentId =
        parentId === null
          ? null
          : Number(parentId);
    }

    if (sortOrder !== undefined) {
      updateData.sortOrder = Number(sortOrder);
    }

    if (status !== undefined) {
      updateData.status = status.trim();
    }

    const [updated] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update category error:", error);

    if (
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return res.status(409).json({
        success: false,
        message: "Category slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
}

// --------------------------------------------------
// DELETE CATEGORY
// DELETE /api/categories/:id
// --------------------------------------------------

export async function deleteCategory(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
}