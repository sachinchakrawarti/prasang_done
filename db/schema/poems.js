import { sqliteTable, text, integer, foreignKey } from "drizzle-orm/sqlite-core";

export const poems = sqliteTable(
  "poems",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    title: text("title").notNull(),

    content: text("content").notNull(),

    slug: text("slug").notNull().unique(),

    poetId: integer("poet_id").notNull(),

    language: text("language").notNull(),

    poetryType: text("poetry_type"),

    description: text("description"),

    coverImage: text("cover_image"),

    status: text("status")
      .notNull()
      .default("draft"),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),

    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },

  (table) => ({
    poetFk: foreignKey({
      columns: [table.poetId],
      foreignColumns: [poets.id],
      name: "poems_poet_id_fk",
    }),
  })
);