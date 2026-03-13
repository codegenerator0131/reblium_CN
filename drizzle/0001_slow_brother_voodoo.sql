CREATE TABLE `assetDownloads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`avatarProjectId` int NOT NULL,
	`assetUrl` text NOT NULL,
	`assetKey` text NOT NULL,
	`creditCost` int NOT NULL,
	`format` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assetDownloads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `avatarProjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`thumbnailUrl` text,
	`thumbnailKey` text,
	`isPublished` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `avatarProjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creditPacks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`credits` int NOT NULL,
	`priceUSD` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creditPacks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creditPurchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`creditPackId` int NOT NULL,
	`credits` int NOT NULL,
	`amountUSD` int NOT NULL,
	`paymentMethod` varchar(50),
	`paymentStatus` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`transactionId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creditPurchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creditTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('purchase','usage','refund') NOT NULL,
	`amount` int NOT NULL,
	`balanceAfter` int NOT NULL,
	`description` text,
	`relatedId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creditTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `licenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`licenseKey` varchar(255) NOT NULL,
	`licenseType` varchar(100) NOT NULL,
	`status` enum('active','expired','revoked') NOT NULL DEFAULT 'active',
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `licenses_id` PRIMARY KEY(`id`),
	CONSTRAINT `licenses_licenseKey_unique` UNIQUE(`licenseKey`)
);
--> statement-breakpoint
CREATE TABLE `storeItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('clothing','hair','face','accessories','animations') NOT NULL,
	`thumbnailUrl` text NOT NULL,
	`thumbnailKey` text NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `storeItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templateAvatars` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`thumbnailUrl` text NOT NULL,
	`thumbnailKey` text NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `templateAvatars_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`storeItemId` int NOT NULL,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `creditBalance` int DEFAULT 0 NOT NULL;