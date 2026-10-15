import express from "express";
import cors from "cors";

import poemsRoutes           from "./routes/poems.routes.js";
import poetsRoutes           from "./routes/poets.routes.js";
import tagsRoutes            from "./routes/tags.routes.js";
import categoriesRoutes      from "./routes/categories.routes.js";
import contributorsRoutes    from "./routes/contributors.routes.js";
import aiTranslationsRoutes  from "./routes/aiTranslations.routes.js";
import translationsRoutes    from "./routes/translations.routes.js";   // ← ADD

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Prasang API is running",
    timestamp: new Date().toISOString(),
  });
});

// ── ROUTES ────────────────────────────────────────────────
app.use("/api/poems", translationsRoutes);     // ← ADD THIS FIRST
app.use("/api/poems", poemsRoutes);            //   (was first, now second)

app.use("/api/poets", poetsRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/contributors", contributorsRoutes);
app.use("/api/ai-translations", aiTranslationsRoutes);

// ── 404 ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;