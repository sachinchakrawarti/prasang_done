import { Router } from "express";

import {
  getAllTags,
  getTagById,
  getTagBySlug,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tags.controller.js";

const router = Router();

// --------------------------------------------------
// GET ALL TAGS
// GET /api/tags
//
// Examples:
// /api/tags
// /api/tags?search=love
// --------------------------------------------------

router.get(
  "/",
  getAllTags
);

// --------------------------------------------------
// GET TAG BY SLUG
// GET /api/tags/slug/:slug
// --------------------------------------------------

router.get(
  "/slug/:slug",
  getTagBySlug
);

// --------------------------------------------------
// GET TAG BY ID
// GET /api/tags/:id
// --------------------------------------------------

router.get(
  "/:id",
  getTagById
);

// --------------------------------------------------
// CREATE TAG
// POST /api/tags
// --------------------------------------------------

router.post(
  "/",
  createTag
);

// --------------------------------------------------
// UPDATE TAG
// PUT /api/tags/:id
// --------------------------------------------------

router.put(
  "/:id",
  updateTag
);

// --------------------------------------------------
// DELETE TAG
// DELETE /api/tags/:id
// --------------------------------------------------

router.delete(
  "/:id",
  deleteTag
);

export default router;