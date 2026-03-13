ALTER TABLE `storeItems` ADD `personalPriceUSD` decimal(10,2) DEFAULT '5.00' NOT NULL;--> statement-breakpoint
ALTER TABLE `storeItems` ADD `commercialPriceUSD` decimal(10,2) DEFAULT '25.00' NOT NULL;--> statement-breakpoint
ALTER TABLE `storeItems` DROP COLUMN `price`;--> statement-breakpoint
ALTER TABLE `storeItems` DROP COLUMN `personalPrice`;--> statement-breakpoint
ALTER TABLE `storeItems` DROP COLUMN `commercialPrice`;