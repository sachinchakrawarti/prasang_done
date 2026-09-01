import { Router } from "express";

import {
  getAllPoems,
  getPoemById,
  getPoemBySlug,
  createPoem,
  updatePoem,
  deletePoem,
} from "../controllers/poems.controller.js";

const router = Router();

// --------------------------------------------------
// GET ALL POEMS
// GET /api/poems
//
// Examples:
// /api/poems
// /api/poems?page=1&limit=20
// /api/poems?search=love
// /api/poems?language=en
// /api/poems?status=published
// /api/poems?poetId=1
// /api/poems?categoryId=1
// --------------------------------------------------

router.get(
  "/",
  getAllPoems
);

// --------------------------------------------------
// GET POEM BY SLUG
// GET /api/poems/slug/:slug
// --------------------------------------------------

router.get(
  "/slug/:slug",
  getPoemBySlug
);

// --------------------------------------------------
// GET POEM BY ID
// GET /api/poems/:id
// --------------------------------------------------

router.get(
  "/:id",
  getPoemById
);

// --------------------------------------------------
// CREATE POEM
// POST /api/poems
// --------------------------------------------------

router.post(
  "/",
  createPoem
);

// --------------------------------------------------
// UPDATE POEM
// PUT /api/poems/:id
// --------------------------------------------------

router.put(
  "/:id",
  updatePoem
);

// --------------------------------------------------
// DELETE POEM
// DELETE /api/poems/:id
// --------------------------------------------------

router.delete(
  "/:id",
  deletePoem
);

export default router;