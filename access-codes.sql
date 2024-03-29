-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 19, 2024 at 09:03 PM
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
-- Table structure for table `codes_table`
--

CREATE TABLE `codes_table` (
  `Code_ID` int NOT NULL,
  `Code_Value` varchar(255) NOT NULL,
  `Visitors_Name` varchar(255) DEFAULT NULL,
  `Code_Status` enum('Used','Not Used') NOT NULL,
  `User_ID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `codes_table`
--

INSERT INTO `codes_table` (`Code_ID`, `Code_Value`, `Visitors_Name`, `Code_Status`, `User_ID`) VALUES
(1, '302901', 'Margret Dean', 'Used', 1),
(2, '000456', 'Favour Doe', 'Not Used', 2),
(3, '490789', 'Candy Sean', 'Used', 3),
(4, '012003', 'Mrs Green', 'Used', 1),
(5, '304906', 'Charles Poppins', 'Not Used', 2),
(6, '900729', 'Mary Heath', 'Used', 3);

-- --------------------------------------------------------

--
-- Table structure for table `user_table`
--

CREATE TABLE `user_table` (
  `User_ID` int NOT NULL,
  `User_Name` varchar(255) NOT NULL,
  `Email_Address` varchar(255) DEFAULT NULL,
  `Phone_Number` varchar(15) DEFAULT NULL,
  `User_role` enum('Security','Resident') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_table`
--

INSERT INTO `user_table` (`User_ID`, `User_Name`, `Email_Address`, `Phone_Number`, `User_role`) VALUES
(1, 'John Doe', '123@gmail.com', '123-456-7890', 'Resident'),
(2, 'Jane Smith', '456@gmail.com', '987-654-3210', 'Security'),
(3, 'Bob Johnson', '789@gmail.com', '555-123-4567', 'Resident');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `codes_table`
--
ALTER TABLE `codes_table`
  MODIFY `Code_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_table`
--
ALTER TABLE `user_table`
  MODIFY `User_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `codes_table`
--
ALTER TABLE `codes_table`
  ADD CONSTRAINT `codes_table_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user_table` (`User_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
