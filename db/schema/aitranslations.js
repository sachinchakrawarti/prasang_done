import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";

import { poems } from "./poems.js";

export const aiTranslations = sqliteTable(
  "ai_translations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    // Original poem
    poemId: integer("poem_id")
      .notNull()
      .references(() => poems.id, {
        onDelete: "cascade",
      }),

    // Original poem language
    sourceLanguage: text("source_language").notNull(),

    // Translation language
    targetLanguage: text("target_language").notNull(),

    // AI-generated translation
    translation: text("translation"),

    // AI model used
    model: text("model"),

    // pending | processing | generated | approved | rejected | failed
    status: text("status")
      .notNull()
      .default("pending"),

    // Number of AI attempts
    attempts: integer("attempts")
      .notNull()
      .default(0),

    // Version of poem that was translated
    poemVersion: integer("poem_version")
      .notNull()
      .default(1),

    // Error message if generation fails
    error: text("error"),

    // When translation was generated
    generatedAt: integer("generated_at", {
      mode: "timestamp",
    }),

    // When admin approved it
    approvedAt: integer("approved_at", {
      mode: "timestamp",
    }),

    createdAt: integer("created_at", {
      mode: "timestamp",
    })
      .notNull()
      .$defaultFn(() => new Date()),

    updatedAt: integer("updated_at", {
      mode: "timestamp",
    })
      .notNull()
      .$defaultFn(() => new Date()),
  },

  (table) => ({
    // One translation per poem + target language
    poemLanguageUnique: uniqueIndex(
      "ai_translations_poem_language_unique"
    ).on(
      table.poemId,
      table.targetLanguage
    ),

    poemIndex: index(
      "ai_translations_poem_id_idx"
    ).on(table.poemId),

    statusIndex: index(
      "ai_translations_status_idx"
    ).on(table.status),

    targetLanguageIndex: index(
      "ai_translations_target_language_idx"
    ).on(table.targetLanguage),
  })
);