import { Router } from "express";

import {
  getAllAiTranslations,
  getAiTranslationById,
  getTranslationsByPoem,
  createAiTranslation,
  updateAiTranslation,
  updateTranslationStatus,
  deleteAiTranslation,
} from "../controllers/aiTranslations.controller.js";

const router = Router();

// --------------------------------------------------
// GET ALL AI TRANSLATIONS
// GET /api/ai-translations
// --------------------------------------------------

router.get(
  "/",
  getAllAiTranslations
);

// --------------------------------------------------
// GET TRANSLATIONS FOR A POEM
// GET /api/ai-translations/poem/:poemId
// --------------------------------------------------

router.get(
  "/poem/:poemId",
  getTranslationsByPoem
);

// --------------------------------------------------
// GET AI TRANSLATION BY ID
// GET /api/ai-translations/:id
// --------------------------------------------------

router.get(
  "/:id",
  getAiTranslationById
);

// --------------------------------------------------
// CREATE AI TRANSLATION
// POST /api/ai-translations
// --------------------------------------------------

router.post(
  "/",
  createAiTranslation
);

// --------------------------------------------------
// UPDATE AI TRANSLATION
// PUT /api/ai-translations/:id
// --------------------------------------------------

router.put(
  "/:id",
  updateAiTranslation
);

// --------------------------------------------------
// UPDATE TRANSLATION STATUS
// PATCH /api/ai-translations/:id/status
// --------------------------------------------------

router.patch(
  "/:id/status",
  updateTranslationStatus
);

// --------------------------------------------------
// DELETE AI TRANSLATION
// DELETE /api/ai-translations/:id
// --------------------------------------------------

router.delete(
  "/:id",
  deleteAiTranslation
);

export default router;