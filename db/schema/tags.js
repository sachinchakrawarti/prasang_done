import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const tags = sqliteTable(
  "tags",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    // English tag name
    name: text("name").notNull(),

    // URL-friendly English slug
    slug: text("slug").notNull(),


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
    slugUnique: uniqueIndex("tags_slug_unique").on(
      table.slug
    ),
  })
);