import { Router } from "express";

import {
  getAllContributors,
  getContributorById,
  getContributorsByRole,
  createContributor,
  updateContributor,
  deleteContributor,
} from "../controllers/contributors.controller.js";

const router = Router();

// --------------------------------------------------
// GET ALL CONTRIBUTORS
// GET /api/contributors
// --------------------------------------------------

router.get(
  "/",
  getAllContributors
);

// --------------------------------------------------
// GET CONTRIBUTORS BY ROLE
// GET /api/contributors/role/:role
// --------------------------------------------------

router.get(
  "/role/:role",
  getContributorsByRole
);

// --------------------------------------------------
// GET CONTRIBUTOR BY ID
// GET /api/contributors/:id
// --------------------------------------------------

router.get(
  "/:id",
  getContributorById
);

// --------------------------------------------------
// CREATE CONTRIBUTOR
// POST /api/contributors
// --------------------------------------------------

router.post(
  "/",
  createContributor
);

// --------------------------------------------------
// UPDATE CONTRIBUTOR
// PUT /api/contributors/:id
// --------------------------------------------------

router.put(
  "/:id",
  updateContributor
);

// --------------------------------------------------
// DELETE CONTRIBUTOR
// DELETE /api/contributors/:id
// --------------------------------------------------

router.delete(
  "/:id",
  deleteContributor
);

export default router;