CREATE TABLE `guestbook` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`message` text NOT NULL,
	`kind` text NOT NULL,
	`created_at` integer NOT NULL,
	`rate_key` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `guestbook_created` ON `guestbook` (`created_at`);--> statement-breakpoint
CREATE INDEX `guestbook_rate` ON `guestbook` (`rate_key`,`created_at`);--> statement-breakpoint
CREATE TABLE `visits` (
	`id` text PRIMARY KEY NOT NULL,
	`visitor` text NOT NULL,
	`country` text NOT NULL,
	`page` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `visits_created` ON `visits` (`created_at`);--> statement-breakpoint
CREATE INDEX `visits_visitor` ON `visits` (`visitor`);