import {
  sqliteTable,
  text,
  integer,
  index,
} from "drizzle-orm/sqlite-core";

import { poets } from "./poets.js";
import { categories } from "./categories.js";

export const poems = sqliteTable(
  "poems",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    title: text("title").notNull(),

    slug: text("slug").notNull().unique(),

    content: text("content").notNull(),

    description: text("description"),

    // Poet
    poetId: integer("poet_id")
      .notNull()
      .references(() => poets.id, {
        onDelete: "restrict",
      }),

    // Poetry category/type
    categoryId: integer("category_id")
      .references(() => categories.id, {
        onDelete: "set null",
      }),

    // Original language
    language: text("language").notNull(),

    // Script used by the poem
    // Example: Devanagari, Latin, Arabic
    script: text("script"),

    // draft | published | archived
    status: text("status")
      .notNull()
      .default("draft"),

    // Used to know when AI translations are outdated
    contentVersion: integer("content_version")
      .notNull()
      .default(1),

    // Optional cover image URL/path
    coverImage: text("cover_image"),

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
    poetIndex: index("poems_poet_id_idx").on(table.poetId),

    categoryIndex: index("poems_category_id_idx").on(
      table.categoryId
    ),

    languageIndex: index("poems_language_idx").on(
      table.language
    ),

    statusIndex: index("poems_status_idx").on(
      table.status
    ),
  })
);