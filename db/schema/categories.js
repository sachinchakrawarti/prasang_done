import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const categories = sqliteTable(
  "categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    // Category name
    name: text("name").notNull(),

    // URL-friendly name
    slug: text("slug").notNull(),

    // Optional description
    description: text("description"),

    // Optional parent category
    parentId: integer("parent_id"),

    // Display order
    sortOrder: integer("sort_order")
      .notNull()
      .default(0),

    // Active / inactive
    status: text("status")
      .notNull()
      .default("active"),

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
    slugUnique: uniqueIndex("categories_slug_unique").on(
      table.slug
    ),
  })
);