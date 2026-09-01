import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const contributors = sqliteTable(
  "contributors",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    // Contributor's name
    name: text("name").notNull(),

    // URL-friendly name
    slug: text("slug").notNull(),

    // Short biography
    bio: text("bio"),

    // Profile photo
    photo: text("photo"),

    // Contributor role
    // author | editor | translator | curator | reviewer
    role: text("role"),

    // Primary language
    language: text("language"),

    // Email/contact (optional)
    email: text("email"),

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
    slugUnique: uniqueIndex("contributors_slug_unique").on(
      table.slug
    ),
  })
);