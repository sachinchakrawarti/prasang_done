import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { poems } from "./poems.js";

export const aiTranslations = sqliteTable(
  "ai_translations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    // The poem this translation belongs to
    poemId: integer("poem_id")
      .notNull()
      .references(() => poems.id, {
        onDelete: "cascade",
      }),

    // Where the translation came from
    sourceLang: text("source_lang").notNull(),
    sourceScript: text("source_script"),

    // The translation target
    targetLang: text("target_lang").notNull(),
    targetScript: text("target_script"),

    // Translated fields
    title: text("title"),
    content: text("content").notNull(),

    // Provenance
    provider: text("provider").notNull().default("google"),
    model: text("model"),

    // Versioned against poems.content_version
    // so we can invalidate stale translations
    sourceContentVersion: integer("source_content_version")
      .notNull()
      .default(1),

    // Optional: quality flag for human review
    // ai | reviewed | rejected
    status: text("status").notNull().default("ai"),

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
    // Look up all translations for a poem
    poemIndex: index("ait_poem_id_idx").on(table.poemId),

    // Look up every poem translated into a language
    targetLangIndex: index("ait_target_lang_idx").on(table.targetLang),

    // One translation per (poem, target_lang)
    poemTargetUnique: uniqueIndex("ait_poem_target_unique").on(
      table.poemId,
      table.targetLang
    ),
  })
);