CREATE TABLE `pollOptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pollId` int NOT NULL,
	`option` varchar(255) NOT NULL,
	`voteCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pollOptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pollVotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pollId` int NOT NULL,
	`optionId` int NOT NULL,
	`voterIdentifier` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pollVotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `polls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` varchar(255) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `polls_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `pollOptions` ADD CONSTRAINT `pollOptions_pollId_polls_id_fk` FOREIGN KEY (`pollId`) REFERENCES `polls`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pollVotes` ADD CONSTRAINT `pollVotes_pollId_polls_id_fk` FOREIGN KEY (`pollId`) REFERENCES `polls`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pollVotes` ADD CONSTRAINT `pollVotes_optionId_pollOptions_id_fk` FOREIGN KEY (`optionId`) REFERENCES `pollOptions`(`id`) ON DELETE cascade ON UPDATE no action;