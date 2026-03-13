CREATE TABLE `softwareVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`version` varchar(50) NOT NULL,
	`displayName` varchar(255) NOT NULL,
	`description` text,
	`releaseNotes` text,
	`downloadUrl` text NOT NULL,
	`fileSize` int,
	`isLatest` boolean NOT NULL DEFAULT false,
	`releaseDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `softwareVersions_id` PRIMARY KEY(`id`),
	CONSTRAINT `softwareVersions_version_unique` UNIQUE(`version`)
);
