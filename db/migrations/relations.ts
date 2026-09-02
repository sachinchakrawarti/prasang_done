import { relations } from "drizzle-orm/relations";
import { poems, aiTranslations, categories, poets } from "./schema";

export const aiTranslationsRelations = relations(aiTranslations, ({one}) => ({
	poem: one(poems, {
		fields: [aiTranslations.poemId],
		references: [poems.id]
	}),
}));

export const poemsRelations = relations(poems, ({one, many}) => ({
	aiTranslations: many(aiTranslations),
	category: one(categories, {
		fields: [poems.categoryId],
		references: [categories.id]
	}),
	poet: one(poets, {
		fields: [poems.poetId],
		references: [poets.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	poems: many(poems),
}));

export const poetsRelations = relations(poets, ({many}) => ({
	poems: many(poems),
}));