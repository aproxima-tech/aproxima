CREATE TABLE `device_models` (
	`id` text(60) PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`description` text,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `home_owners` (
	`home_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text,
	PRIMARY KEY(`home_id`, `user_id`),
	FOREIGN KEY (`home_id`) REFERENCES `homes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `homes` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`display_name` text(320) NOT NULL,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`model_id` text NOT NULL,
	`created_at` text,
	FOREIGN KEY (`order_id`) REFERENCES `user_orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`model_id`) REFERENCES `device_models`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `user_devices` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`home_id` text,
	`model_id` text NOT NULL,
	`display_name` text(320) NOT NULL,
	`created_at` text,
	`updated_at` text,
	FOREIGN KEY (`home_id`) REFERENCES `homes`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`model_id`) REFERENCES `device_models`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `user_orders` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text,
	`updated_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_passwords` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`password_hash` text(100) NOT NULL,
	`created_at` text,
	`updated_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_tokens` (
	`id` text(41) PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text(4) NOT NULL,
	`expires_at` text,
	`created_at` text,
	`updated_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`email` text(320) NOT NULL,
	`display_name` text(320) NOT NULL,
	`created_at` text,
	`updated_at` text
);
--> statement-breakpoint
CREATE INDEX `order_items_order_id_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `order_items_model_id_idx` ON `order_items` (`model_id`);--> statement-breakpoint
CREATE INDEX `user_devices_home_id_idx` ON `user_devices` (`home_id`);--> statement-breakpoint
CREATE INDEX `user_orders_user_id_idx` ON `user_orders` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_passwords_user_id_unique` ON `user_passwords` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_tokens_user_id_idx` ON `user_tokens` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);