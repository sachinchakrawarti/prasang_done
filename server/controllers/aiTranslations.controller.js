import { eq, and, desc } from "drizzle-orm";

import { db } from "../config/database.js";

import {
  aiTranslations,
  poems,
} from "../../db/schema/index.js";

// --------------------------------------------------
// GET ALL AI TRANSLATIONS
// GET /api/ai-translations
// --------------------------------------------------

export async function getAllAiTranslations(req, res) {
  try {
    const translations = await db
      .select()
      .from(aiTranslations)
      .orderBy(desc(aiTranslations.createdAt));

    res.json({
      success: true,
      count: translations.length,
      data: translations,
    });
  } catch (error) {
    console.error("Get AI translations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch AI translations",
    });
  }
}

// --------------------------------------------------
// GET AI TRANSLATION BY ID
// GET /api/ai-translations/:id
// --------------------------------------------------

export async function getAiTranslationById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid translation ID",
      });
    }

    const [translation] = await db
      .select()
      .from(aiTranslations)
      .where(eq(aiTranslations.id, id))
      .limit(1);

    if (!translation) {
      return res.status(404).json({
        success: false,
        message: "AI translation not found",
      });
    }

    res.json({
      success: true,
      data: translation,
    });
  } catch (error) {
    console.error("Get AI translation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch AI translation",
    });
  }
}

// --------------------------------------------------
// GET TRANSLATIONS FOR A POEM
// GET /api/ai-translations/poem/:poemId
// --------------------------------------------------

export async function getTranslationsByPoem(req, res) {
  try {
    const poemId = Number(req.params.poemId);

    if (!Number.isInteger(poemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid poem ID",
      });
    }

    const translations = await db
      .select()
      .from(aiTranslations)
      .where(eq(aiTranslations.poemId, poemId))
      .orderBy(desc(aiTranslations.createdAt));

    res.json({
      success: true,
      poemId,
      count: translations.length,
      data: translations,
    });
  } catch (error) {
    console.error(
      "Get poem translations error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch poem translations",
    });
  }
}

// --------------------------------------------------
// CREATE AI TRANSLATION
// POST /api/ai-translations
// --------------------------------------------------

export async function createAiTranslation(req, res) {
  try {
    const {
      poemId,
      sourceLanguage,
      targetLanguage,
      translation,
      model,
      status,
      attempts,
      poemVersion,
      error,
    } = req.body;

    if (
      !poemId ||
      !sourceLanguage ||
      !targetLanguage
    ) {
      return res.status(400).json({
        success: false,
        message:
          "poemId, sourceLanguage and targetLanguage are required",
      });
    }

    // Check poem exists
    const [poem] = await db
      .select({
        id: poems.id,
      })
      .from(poems)
      .where(eq(poems.id, Number(poemId)))
      .limit(1);

    if (!poem) {
      return res.status(404).json({
        success: false,
        message: "Poem not found",
      });
    }

    const [created] = await db
      .insert(aiTranslations)
      .values({
        poemId: Number(poemId),
        sourceLanguage,
        targetLanguage,
        translation: translation ?? null,
        model: model ?? null,
        status: status ?? "pending",
        attempts: attempts ?? 0,
        poemVersion: poemVersion ?? 1,
        error: error ?? null,

        generatedAt:
          status === "generated" || status === "approved"
            ? new Date()
            : null,

        approvedAt:
          status === "approved"
            ? new Date()
            : null,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "AI translation created",
      data: created,
    });
  } catch (error) {
    console.error(
      "Create AI translation error:",
      error
    );

    // SQLite unique constraint
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        success: false,
        message:
          "A translation for this poem and language already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create AI translation",
    });
  }
}

// --------------------------------------------------
// UPDATE AI TRANSLATION
// PUT /api/ai-translations/:id
// --------------------------------------------------

export async function updateAiTranslation(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid translation ID",
      });
    }

    const {
      translation,
      model,
      status,
      attempts,
      poemVersion,
      error,
    } = req.body;

    const updateData = {
      updatedAt: new Date(),
    };

    if (translation !== undefined) {
      updateData.translation = translation;
    }

    if (model !== undefined) {
      updateData.model = model;
    }

    if (status !== undefined) {
      updateData.status = status;

      if (
        status === "generated" ||
        status === "approved"
      ) {
        updateData.generatedAt = new Date();
      }

      if (status === "approved") {
        updateData.approvedAt = new Date();
      }
    }

    if (attempts !== undefined) {
      updateData.attempts = attempts;
    }

    if (poemVersion !== undefined) {
      updateData.poemVersion = poemVersion;
    }

    if (error !== undefined) {
      updateData.error = error;
    }

    const [updated] = await db
      .update(aiTranslations)
      .set(updateData)
      .where(eq(aiTranslations.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "AI translation not found",
      });
    }

    res.json({
      success: true,
      message: "AI translation updated",
      data: updated,
    });
  } catch (error) {
    console.error(
      "Update AI translation error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update AI translation",
    });
  }
}

// --------------------------------------------------
// DELETE AI TRANSLATION
// DELETE /api/ai-translations/:id
// --------------------------------------------------

export async function deleteAiTranslation(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid translation ID",
      });
    }

    const [deleted] = await db
      .delete(aiTranslations)
      .where(eq(aiTranslations.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "AI translation not found",
      });
    }

    res.json({
      success: true,
      message: "AI translation deleted",
      data: deleted,
    });
  } catch (error) {
    console.error(
      "Delete AI translation error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete AI translation",
    });
  }
}

// --------------------------------------------------
// UPDATE TRANSLATION STATUS
// PATCH /api/ai-translations/:id/status
// --------------------------------------------------

export async function updateTranslationStatus(req, res) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "generated",
      "approved",
      "rejected",
      "failed",
    ];

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid translation ID",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid translation status",
        allowedStatuses,
      });
    }

    const updateData = {
      status,
      updatedAt: new Date(),
    };

    if (
      status === "generated" ||
      status === "approved"
    ) {
      updateData.generatedAt = new Date();
    }

    if (status === "approved") {
      updateData.approvedAt = new Date();
    }

    const [updated] = await db
      .update(aiTranslations)
      .set(updateData)
      .where(eq(aiTranslations.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "AI translation not found",
      });
    }

    res.json({
      success: true,
      message: `Translation marked as ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error(
      "Update translation status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update translation status",
    });
  }
}