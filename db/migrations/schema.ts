import { sqliteTable, AnySQLiteColumn, index, uniqueIndex, foreignKey, integer, text } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const aiTranslations = sqliteTable("ai_translations", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	poemId: integer("poem_id").notNull().references(() => poems.id, { onDelete: "cascade" } ),
	sourceLanguage: text("source_language").notNull(),
	targetLanguage: text("target_language").notNull(),
	translation: text(),
	model: text(),
	status: text().default("pending").notNull(),
	attempts: integer().default(0).notNull(),
	poemVersion: integer("poem_version").default(1).notNull(),
	error: text(),
	generatedAt: integer("generated_at"),
	approvedAt: integer("approved_at"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
},
(table) => [
	index("ai_translations_target_language_idx").on(table.targetLanguage),
	index("ai_translations_status_idx").on(table.status),
	index("ai_translations_poem_id_idx").on(table.poemId),
	uniqueIndex("ai_translations_poem_language_unique").on(table.poemId, table.targetLanguage),
]);

export const categories = sqliteTable("categories", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	parentId: integer("parent_id"),
	sortOrder: integer("sort_order").default(0).notNull(),
	status: text().default("active").notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
},
(table) => [
	uniqueIndex("categories_slug_unique").on(table.slug),
]);

export const contributors = sqliteTable("contributors", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	bio: text(),
	photo: text(),
	role: text(),
	language: text(),
	email: text(),
	status: text().default("active").notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
},
(table) => [
	uniqueIndex("contributors_slug_unique").on(table.slug),
]);

export const poems = sqliteTable("poems", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	title: text().notNull(),
	slug: text().notNull(),
	content: text().notNull(),
	description: text(),
	poetId: integer("poet_id").notNull().references(() => poets.id, { onDelete: "restrict" } ),
	categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" } ),
	language: text().notNull(),
	script: text(),
	status: text().default("draft").notNull(),
	contentVersion: integer("content_version").default(1).notNull(),
	coverImage: text("cover_image"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
},
(table) => [
	index("poems_status_idx").on(table.status),
	index("poems_language_idx").on(table.language),
	index("poems_category_id_idx").on(table.categoryId),
	index("poems_poet_id_idx").on(table.poetId),
	uniqueIndex("poems_slug_unique").on(table.slug),
]);

export const poets = sqliteTable("poets", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	bio: text(),
	country: text(),
	birthDate: text("birth_date"),
	deathDate: text("death_date"),
	language: text(),
	photo: text(),
	website: text(),
	status: text().default("draft").notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
},
(table) => [
	uniqueIndex("poets_name_unique").on(table.name),
	uniqueIndex("poets_slug_unique").on(table.slug),
]);

export const tags = sqliteTable("tags", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
},
(table) => [
	uniqueIndex("tags_slug_unique").on(table.slug),
]);

