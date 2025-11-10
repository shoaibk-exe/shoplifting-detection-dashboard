-- CreateTable SystemStatus
CREATE TABLE `SystemStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalCameras` INTEGER NOT NULL,
    `liveCamerasCount` INTEGER NOT NULL,
    `degradedCount` INTEGER NOT NULL,
    `offlineCount` INTEGER NOT NULL,
    `overallHealth` VARCHAR(191) NOT NULL,
    `statusSummary` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable GPUInfo
CREATE TABLE `GPUInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilizationPercent` DOUBLE NOT NULL,
    `memoryStatus` VARCHAR(191) NOT NULL,
    `allocatedGB` DOUBLE NOT NULL,
    `reservedGB` DOUBLE NOT NULL,
    `available` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
