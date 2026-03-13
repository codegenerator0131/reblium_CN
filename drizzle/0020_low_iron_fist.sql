ALTER TABLE `featureRequests` ADD `userName` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `featureRequests` ADD `category` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `featureRequests` DROP COLUMN `subject`;