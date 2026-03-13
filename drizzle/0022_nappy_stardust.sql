CREATE TABLE `contentReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submissionId` int NOT NULL,
	`reviewerId` int NOT NULL,
	`status` enum('approved','revision_required','rejected') NOT NULL,
	`visualQualityFeedback` text,
	`technicalFeedback` text,
	`optimizationFeedback` text,
	`namingFeedback` text,
	`overallComments` text,
	`reviewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contentReviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artistId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('clothing','hair','face','accessories','animations','packs') NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` text NOT NULL,
	`thumbnailUrl` text,
	`thumbnailKey` text,
	`polyCount` int,
	`textureTypes` text,
	`fileFormat` varchar(50),
	`fileSize` int,
	`personalPriceUSD` decimal(10,2) NOT NULL,
	`commercialPriceUSD` decimal(10,2) NOT NULL,
	`personalPriceCNY` decimal(10,2) NOT NULL,
	`commercialPriceCNY` decimal(10,2) NOT NULL,
	`status` enum('pending','approved','revision_required','rejected') NOT NULL DEFAULT 'pending',
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentSubmissions_id` PRIMARY KEY(`id`)
);
