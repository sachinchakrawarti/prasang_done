import { Router } from "express";

import {
  getAllCategories,
  getCategoryById,
  getChildCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";

const router = Router();

// --------------------------------------------------
// GET ALL CATEGORIES
// GET /api/categories
// --------------------------------------------------

router.get(
  "/",
  getAllCategories
);

// --------------------------------------------------
// GET CHILD CATEGORIES
// GET /api/categories/parent/:parentId
// --------------------------------------------------

router.get(
  "/parent/:parentId",
  getChildCategories
);

// --------------------------------------------------
// GET CATEGORY BY ID
// GET /api/categories/:id
// --------------------------------------------------

router.get(
  "/:id",
  getCategoryById
);

// --------------------------------------------------
// CREATE CATEGORY
// POST /api/categories
// --------------------------------------------------

router.post(
  "/",
  createCategory
);

// --------------------------------------------------
// UPDATE CATEGORY
// PUT /api/categories/:id
// --------------------------------------------------

router.put(
  "/:id",
  updateCategory
);

// --------------------------------------------------
// DELETE CATEGORY
// DELETE /api/categories/:id
// --------------------------------------------------

router.delete(
  "/:id",
  deleteCategory
);

export default router;