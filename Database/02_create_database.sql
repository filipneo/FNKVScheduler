CREATE DATABASE IF NOT EXISTS `fnkvschedulerdb`;

USE `fnkvschedulerdb`;

CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

ALTER DATABASE CHARACTER SET utf8mb4;

CREATE TABLE `CalEvents` (
    `CalEventId` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `Note` varchar(255) CHARACTER SET utf8mb4 NULL,
    `From` date NOT NULL,
    `To` date NOT NULL,
    `Color` varchar(45) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_CalEvents` PRIMARY KEY (`CalEventId`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `EmpCategories` (
    `EmpCategoryId` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `Color` varchar(45) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_EmpCategories` PRIMARY KEY (`EmpCategoryId`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Users` (
    `UserId` int NOT NULL AUTO_INCREMENT,
    `Username` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `Password` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Users` PRIMARY KEY (`UserId`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Employees` (
    `EmployeeId` int NOT NULL AUTO_INCREMENT,
    `FirstName` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `LastName` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `Phone` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `Email` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `NameCode` varchar(6) CHARACTER SET utf8mb4 NOT NULL,
    `EmpCategoryId` int NOT NULL,
    `FromLimit` date NULL,
    `ToLimit` date NULL,
    `PreferredAmbulanceIds` longtext CHARACTER SET utf8mb4 NOT NULL,
    `FixedAmbulanceIds` longtext CHARACTER SET utf8mb4 NOT NULL,
    `FixedDays` varchar(60) CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_Employees` PRIMARY KEY (`EmployeeId`),
    CONSTRAINT `FK_Employees_EmpCategories_EmpCategoryId` FOREIGN KEY (`EmpCategoryId`) REFERENCES `EmpCategories` (`EmpCategoryId`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;

CREATE TABLE `Departments` (
    `DepartmentId` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `MinCap` int NULL,
    `OptCap` int NULL,
    `MaxCap` int NULL,
    `HeadEmpId` int NULL,
    CONSTRAINT `PK_Departments` PRIMARY KEY (`DepartmentId`),
    CONSTRAINT `FK_Departments_Employees_HeadEmpId` FOREIGN KEY (`HeadEmpId`) REFERENCES `Employees` (`EmployeeId`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;

CREATE TABLE `Vacations` (
    `VacationId` int NOT NULL AUTO_INCREMENT,
    `From` date NOT NULL,
    `To` date NOT NULL,
    `VacationState` int NOT NULL,
    `Note` varchar(500) CHARACTER SET utf8mb4 NULL,
    `EmployeeId` int NULL,
    `NewEmpName` varchar(255) CHARACTER SET utf8mb4 NULL,
    CONSTRAINT `PK_Vacations` PRIMARY KEY (`VacationId`),
    CONSTRAINT `FK_Vacations_Employees_EmployeeId` FOREIGN KEY (`EmployeeId`) REFERENCES `Employees` (`EmployeeId`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;

CREATE TABLE `Ambulances` (
    `AmbulanceId` int NOT NULL AUTO_INCREMENT,
    `Name` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `DepartmentId` int NOT NULL,
    `MinCap` int NOT NULL,
    `OptCap` int NOT NULL,
    `MaxCap` int NOT NULL,
    CONSTRAINT `PK_Ambulances` PRIMARY KEY (`AmbulanceId`),
    CONSTRAINT `FK_Ambulances_Departments_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `Departments` (`DepartmentId`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;

CREATE TABLE `fixed_ambulance` (
    `FixedAmbulancesAmbulanceId` int NOT NULL,
    `FixedEmployeesEmployeeId` int NOT NULL,
    CONSTRAINT `PK_fixed_ambulance` PRIMARY KEY (`FixedAmbulancesAmbulanceId`, `FixedEmployeesEmployeeId`),
    CONSTRAINT `FK_fixed_ambulance_Ambulances_FixedAmbulancesAmbulanceId` FOREIGN KEY (`FixedAmbulancesAmbulanceId`) REFERENCES `Ambulances` (`AmbulanceId`) ON DELETE CASCADE,
    CONSTRAINT `FK_fixed_ambulance_Employees_FixedEmployeesEmployeeId` FOREIGN KEY (`FixedEmployeesEmployeeId`) REFERENCES `Employees` (`EmployeeId`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `preferred_ambulance` (
    `PreferredAmbulancesAmbulanceId` int NOT NULL,
    `PreferredEmployeesEmployeeId` int NOT NULL,
    CONSTRAINT `PK_preferred_ambulance` PRIMARY KEY (`PreferredAmbulancesAmbulanceId`, `PreferredEmployeesEmployeeId`),
    CONSTRAINT `FK_preferred_ambulance_Ambulances_PreferredAmbulancesAmbulanceId` FOREIGN KEY (`PreferredAmbulancesAmbulanceId`) REFERENCES `Ambulances` (`AmbulanceId`) ON DELETE CASCADE,
    CONSTRAINT `FK_preferred_ambulance_Employees_PreferredEmployeesEmployeeId` FOREIGN KEY (`PreferredEmployeesEmployeeId`) REFERENCES `Employees` (`EmployeeId`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Shifts` (
    `ShiftId` int NOT NULL AUTO_INCREMENT,
    `PartOfTheDay` int NOT NULL,
    `Date` date NOT NULL,
    `Note` varchar(500) CHARACTER SET utf8mb4 NULL,
    `EmployeeId` int NOT NULL,
    `AmbulanceId` int NOT NULL,
    CONSTRAINT `PK_Shifts` PRIMARY KEY (`ShiftId`),
    CONSTRAINT `FK_Shifts_Ambulances_AmbulanceId` FOREIGN KEY (`AmbulanceId`) REFERENCES `Ambulances` (`AmbulanceId`) ON DELETE RESTRICT,
    CONSTRAINT `FK_Shifts_Employees_EmployeeId` FOREIGN KEY (`EmployeeId`) REFERENCES `Employees` (`EmployeeId`) ON DELETE RESTRICT
) CHARACTER SET=utf8mb4;

INSERT INTO `EmpCategories` (`EmpCategoryId`, `Color`, `Name`)
VALUES (1, '#0e7d01', 'Doktor');

INSERT INTO `Users` (`UserId`, `Password`, `Username`)
VALUES (1, '8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918', 'admin');

INSERT INTO `Employees` (`EmployeeId`, `Email`, `EmpCategoryId`, `FirstName`, `FixedAmbulanceIds`, `FixedDays`, `FromLimit`, `LastName`, `NameCode`, `Phone`, `PreferredAmbulanceIds`, `ToLimit`)
VALUES (1, 'john.smith@example.com', 1, 'John', '[]', NULL, NULL, 'Smith', 'JS', '123456789', '[]', NULL),
(2, 'emma.johnson@example.com', 1, 'Emma', '[]', NULL, NULL, 'Johnson', 'EJ', '123456789', '[]', NULL),
(3, 'michael.williams@example.com', 1, 'Michael', '[]', NULL, NULL, 'Williams', 'MW', '123456789', '[]', NULL),
(4, 'sarah.brown@example.com', 1, 'Sarah', '[]', NULL, NULL, 'Brown', 'SB', '123456789', '[]', NULL),
(5, 'james.jones@example.com', 1, 'James', '[]', NULL, NULL, 'Jones', 'JJ', '123456789', '[]', NULL),
(6, 'jennifer.davis@example.com', 1, 'Jennifer', '[]', NULL, NULL, 'Davis', 'JD', '123456789', '[]', NULL),
(7, 'david.miller@example.com', 1, 'David', '[]', NULL, NULL, 'Miller', 'DM', '123456789', '[]', NULL),
(8, 'jessica.wilson@example.com', 1, 'Jessica', '[]', NULL, NULL, 'Wilson', 'JW', '123456789', '[]', NULL),
(9, 'daniel.taylor@example.com', 1, 'Daniel', '[]', NULL, NULL, 'Taylor', 'DT', '123456789', '[]', NULL),
(10, 'emily.clark@example.com', 1, 'Emily', '[]', NULL, NULL, 'Clark', 'EC', '123456789', '[]', NULL);

CREATE INDEX `IX_Ambulances_DepartmentId` ON `Ambulances` (`DepartmentId`);

CREATE INDEX `IX_Departments_HeadEmpId` ON `Departments` (`HeadEmpId`);

CREATE INDEX `IX_Employees_EmpCategoryId` ON `Employees` (`EmpCategoryId`);

CREATE INDEX `IX_fixed_ambulance_FixedEmployeesEmployeeId` ON `fixed_ambulance` (`FixedEmployeesEmployeeId`);

CREATE INDEX `IX_preferred_ambulance_PreferredEmployeesEmployeeId` ON `preferred_ambulance` (`PreferredEmployeesEmployeeId`);

CREATE INDEX `IX_Shifts_AmbulanceId` ON `Shifts` (`AmbulanceId`);

CREATE INDEX `IX_Shifts_EmployeeId` ON `Shifts` (`EmployeeId`);

CREATE INDEX `IX_Vacations_EmployeeId` ON `Vacations` (`EmployeeId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20240429081115_InitialMigration', '8.0.3');

COMMIT;
