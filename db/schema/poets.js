import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const poets = sqliteTable(
  "poets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    // Poet's name
    name: text("name").notNull(),

    // URL-friendly name
    slug: text("slug").notNull(),

    // Short biography
    bio: text("bio"),

    // Country / region
    country: text("country"),

    // Birth and death dates
    birthDate: text("birth_date"),
    deathDate: text("death_date"),

    // Primary language
    language: text("language"),

    // Poet profile image
    photo: text("photo"),

    // Optional website
    website: text("website"),

    // draft | published | archived
    status: text("status")
      .notNull()
      .default("draft"),

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
    slugUnique: uniqueIndex("poets_slug_unique").on(
      table.slug
    ),

    nameIndex: uniqueIndex("poets_name_unique").on(
      table.name
    ),
  })
);