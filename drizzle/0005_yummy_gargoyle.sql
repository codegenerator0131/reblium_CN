ALTER TABLE `storeItems` ADD `personalPrice` int DEFAULT 500 NOT NULL;--> statement-breakpoint
ALTER TABLE `storeItems` ADD `commercialPrice` int DEFAULT 2000 NOT NULL;--> statement-breakpoint
ALTER TABLE `userItems` ADD `licenseType` enum('personal','commercial') NOT NULL;--> statement-breakpoint
ALTER TABLE `userItems` ADD `priceEuroCents` int NOT NULL;