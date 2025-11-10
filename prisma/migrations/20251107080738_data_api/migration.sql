-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE `alerts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alert_number` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `time` VARCHAR(191) NOT NULL,
    `alert_link` VARCHAR(191) NULL,
    `camera_num` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_camera_num_fkey` FOREIGN KEY (`camera_num`) REFERENCES `Camera`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
