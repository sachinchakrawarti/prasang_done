import { Router } from "express";

import {
  getAllPoets,
  getPoetById,
  getPoetBySlug,
  getPoetPoems,
  createPoet,
  updatePoet,
  deletePoet,
} from "../controllers/poets.controller.js";

const router = Router();

// --------------------------------------------------
// GET ALL POETS
// GET /api/poets
//
// Examples:
// /api/poets
// /api/poets?page=1&limit=20
// /api/poets?search=shakespeare
// /api/poets?language=en
// /api/poets?status=active
// --------------------------------------------------

router.get(
  "/",
  getAllPoets
);

// --------------------------------------------------
// GET POET BY SLUG
// GET /api/poets/slug/:slug
// --------------------------------------------------

router.get(
  "/slug/:slug",
  getPoetBySlug
);

// --------------------------------------------------
// GET POEMS BY POET
// GET /api/poets/:id/poems
// --------------------------------------------------

router.get(
  "/:id/poems",
  getPoetPoems
);

// --------------------------------------------------
// GET POET BY ID
// GET /api/poets/:id
// --------------------------------------------------

router.get(
  "/:id",
  getPoetById
);

// --------------------------------------------------
// CREATE POET
// POST /api/poets
// --------------------------------------------------

router.post(
  "/",
  createPoet
);

// --------------------------------------------------
// UPDATE POET
// PUT /api/poets/:id
// --------------------------------------------------

router.put(
  "/:id",
  updatePoet
);

// --------------------------------------------------
// DELETE POET
// DELETE /api/poets/:id
// --------------------------------------------------

router.delete(
  "/:id",
  deletePoet
);

export default router;