import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const poets = sqliteTable(
  "poets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    name: text("name").notNull(),

    slug: text("slug").notNull(),

    bio: text("bio"),

    country: text("country"),

    birthDate: text("birth_date"),

    deathDate: text("death_date"),

    language: text("language"),

    photo: text("photo"),

    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),

    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },

  (table) => ({
    slugUnique: uniqueIndex("poets_slug_unique").on(table.slug),
  })
);