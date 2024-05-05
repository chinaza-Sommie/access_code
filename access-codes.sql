-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 30, 2024 at 08:27 PM
-- Server version: 8.3.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `access-codes`
--

-- --------------------------------------------------------

--
-- Table structure for table `alerts`
--

CREATE TABLE `alerts` (
  `id` int NOT NULL,
  `message` varchar(255) NOT NULL,
  `sender` int NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `alerts`
--

INSERT INTO `alerts` (`id`, `message`, `sender`, `date`) VALUES
(1, 'mary', 1, '2024-04-30 11:03:02'),
(2, 'hello', 1, '2024-04-30 11:05:17'),
(3, '', 1, '2024-04-30 11:52:24'),
(4, 'we', 1, '2024-04-30 11:52:35'),
(5, 'hello', 1, '2024-04-30 11:53:40'),
(6, 'hello', 1, '2024-04-30 11:54:35'),
(7, '', 1, '2024-04-30 11:54:43'),
(8, 'hello', 1, '2024-04-30 11:55:56'),
(9, '', 1, '2024-04-30 11:56:08'),
(10, 'hello', 1, '2024-04-30 12:00:01'),
(11, 'hello', 1, '2024-04-30 12:01:09'),
(12, 'hello', 1, '2024-04-30 12:01:53');

-- --------------------------------------------------------

--
-- Table structure for table `codes_table`
--

CREATE TABLE `codes_table` (
  `Code_ID` int NOT NULL,
  `Code_Value` varchar(255) NOT NULL,
  `Visitors_Name` varchar(255) DEFAULT NULL,
  `Code_Status` enum('Used','Not Used') NOT NULL,
  `User_ID` int DEFAULT NULL,
  `timeExpired` timestamp NULL DEFAULT NULL,
  `dateAdded` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `codes_table`
--

INSERT INTO `codes_table` (`Code_ID`, `Code_Value`, `Visitors_Name`, `Code_Status`, `User_ID`, `timeExpired`, `dateAdded`) VALUES
(1, '302901', 'Margret Dean', 'Used', 1, '0000-00-00 00:00:00', '2024-04-30 18:15:48'),
(2, '000456', 'Favour Doe', 'Not Used', 2, '0000-00-00 00:00:00', '2024-04-30 18:15:48'),
(3, '490789', 'Candy Sean', 'Used', 3, '0000-00-00 00:00:00', '2024-04-30 18:15:48'),
(4, '012003', 'Mrs Green', 'Used', 1, '0000-00-00 00:00:00', '2024-04-30 18:15:48'),
(5, '304906', 'Charles Poppins', 'Not Used', 2, '0000-00-00 00:00:00', '2024-04-30 18:15:48'),
(6, '900729', 'Mary Heath', 'Used', 3, '0000-00-00 00:00:00', '2024-04-30 18:15:48'),
(7, '5000', 'austine', 'Used', 1, '2024-05-03 00:00:00', '2024-04-30 19:35:05'),
(8, '5000', 'austine', 'Used', 1, '2024-05-05 00:00:00', '2024-04-30 19:35:40'),
(9, '5000', 'Mary', 'Used', 1, '2024-04-30 12:30:00', '2024-04-30 19:42:37'),
(10, '5000', 'austine', 'Used', 1, '2024-05-04 00:00:00', '2024-04-30 19:44:04'),
(11, '5000', 'helen', 'Used', 1, '2024-05-05 00:00:00', '2024-04-30 19:50:27'),
(12, '5000', 'nazz', 'Used', 1, '2024-05-04 00:00:00', '2024-04-30 20:15:20');

-- --------------------------------------------------------

--
-- Table structure for table `user_table`
--

CREATE TABLE `user_table` (
  `User_ID` int NOT NULL,
  `User_Name` varchar(255) NOT NULL,
  `Email_Address` varchar(255) DEFAULT NULL,
  `Phone_Number` varchar(15) DEFAULT NULL,
  `User_role` enum('Security','Resident') NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_table`
--

INSERT INTO `user_table` (`User_ID`, `User_Name`, `Email_Address`, `Phone_Number`, `User_role`, `Password`) VALUES
(1, 'John Doe', '123@gmail.com', '123-456-7890', 'Resident', '$2a$10$w.9MBBed6KLqouHlFrgeHOuLhjc8agmgel00CDMwDLbO7klHwLOWy'),
(2, 'Jane Smith', '456@gmail.com', '987-654-3210', 'Security', '$2a$10$z3JF.zpDjWYvVYljgd.UBOPd5t2LFGLxxQucX0RUpLJyEJUhqO76.'),
(3, 'Bob Johnson', '789@gmail.com', '555-123-4567', 'Resident', '$2a$10$MSPQldHEJrvAFV8iMcsaC.w3JARVw3Jev4dDjcVEV/U8eC.USM9ta');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sender_user` (`sender`);

--
-- Indexes for table `codes_table`
--
ALTER TABLE `codes_table`
  ADD PRIMARY KEY (`Code_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Indexes for table `user_table`
--
ALTER TABLE `user_table`
  ADD PRIMARY KEY (`User_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `codes_table`
--
ALTER TABLE `codes_table`
  MODIFY `Code_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `user_table`
--
ALTER TABLE `user_table`
  MODIFY `User_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alerts`
--
ALTER TABLE `alerts`
  ADD CONSTRAINT `fk_sender_user` FOREIGN KEY (`sender`) REFERENCES `user_table` (`User_ID`);

--
-- Constraints for table `codes_table`
--
ALTER TABLE `codes_table`
  ADD CONSTRAINT `codes_table_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user_table` (`User_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
