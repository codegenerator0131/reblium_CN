ALTER TABLE `storeItems` ADD `polyCount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `storeItems` ADD `textureTypes` text;--> statement-breakpoint
ALTER TABLE `storeItems` ADD `fileFormat` varchar(50) DEFAULT 'FBX';--> statement-breakpoint
ALTER TABLE `storeItems` ADD `fileSize` int DEFAULT 0;