CREATE TABLE `sdks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`engine` varchar(100) NOT NULL,
	`version` varchar(50) NOT NULL,
	`description` text,
	`downloadUrl` text NOT NULL,
	`documentationUrl` text,
	`fileSize` int,
	`releaseDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sdks_id` PRIMARY KEY(`id`)
);
