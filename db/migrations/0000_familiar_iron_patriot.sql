CREATE TABLE `ai_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`poem_id` integer NOT NULL,
	`source_language` text NOT NULL,
	`target_language` text NOT NULL,
	`translation` text,
	`model` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`poem_version` integer DEFAULT 1 NOT NULL,
	`error` text,
	`generated_at` integer,
	`approved_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`poem_id`) REFERENCES `poems`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_translations_poem_language_unique` ON `ai_translations` (`poem_id`,`target_language`);--> statement-breakpoint
CREATE INDEX `ai_translations_poem_id_idx` ON `ai_translations` (`poem_id`);--> statement-breakpoint
CREATE INDEX `ai_translations_status_idx` ON `ai_translations` (`status`);--> statement-breakpoint
CREATE INDEX `ai_translations_target_language_idx` ON `ai_translations` (`target_language`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`parent_id` integer,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `contributors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`bio` text,
	`photo` text,
	`role` text,
	`language` text,
	`email` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contributors_slug_unique` ON `contributors` (`slug`);--> statement-breakpoint
CREATE TABLE `poems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text NOT NULL,
	`description` text,
	`poet_id` integer NOT NULL,
	`category_id` integer,
	`language` text NOT NULL,
	`script` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`content_version` integer DEFAULT 1 NOT NULL,
	`cover_image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`poet_id`) REFERENCES `poets`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `poems_slug_unique` ON `poems` (`slug`);--> statement-breakpoint
CREATE INDEX `poems_poet_id_idx` ON `poems` (`poet_id`);--> statement-breakpoint
CREATE INDEX `poems_category_id_idx` ON `poems` (`category_id`);--> statement-breakpoint
CREATE INDEX `poems_language_idx` ON `poems` (`language`);--> statement-breakpoint
CREATE INDEX `poems_status_idx` ON `poems` (`status`);--> statement-breakpoint
CREATE TABLE `poets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`bio` text,
	`country` text,
	`birth_date` text,
	`death_date` text,
	`language` text,
	`photo` text,
	`website` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `poets_slug_unique` ON `poets` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `poets_name_unique` ON `poets` (`name`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);